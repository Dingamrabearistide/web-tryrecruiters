import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import {
  JobOffer as ModuleObject,
  ContractType,
  JobType,
  JobLevel,
} from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { goToTop, wait, formatSalaryAmount } from "../../../../../@1hand/utils";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import {
  GenericModalData,
  GenericModalComponent,
} from "../../../../../@1hand/components/generic-modal/generic-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { ComboOption } from "../../../components/multi-select-combobox/multi-select-combobox.component";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-companies-list-page",
  templateUrl: "./job-offers-list-page.component.html",
  styleUrls: ["./job-offers-list-page.component.scss"],
})
export class JobOffersListPageComponent implements OnInit {
  formatSalaryAmount = formatSalaryAmount;

  isLoading = false;
  hasError = false;
  errorMessage = "";

  items: ModuleObject[] = [];
  totalResults = 0;

  page = 1;
  totalPages = 1;
  pageSize = 6;

  // Keyword search
  keywordSearch = "";

  // Selected filter values
  selectedCategories: string[] = [];
  selectedLocations: string[] = [];
  selectedContractTypes: string[] = [];
  selectedExperience: string[] = [];
  selectedPostedDate: string[] = [];
  selectedWorkModes: string[] = [];
  selectedSalary: string[] = [];
  selectedCompanies: string[] = [];
  selectedSkills: string[] = [];

  // Sort (single-select)
  selectedSort: string[] = ["recent"];

  // Expanded card (accordion)
  expandedJobId: string | null = null;

  isFavorite(job: any) {
    return !!job?.isFavorite;
  }

  hasApplied(job: any) {
    return job.hasApplied;
  }

  // ── Option arrays (matching template data-options) ────────

  categoryOptions: ComboOption[] = [
    { value: "Engineering", label: "Engineering" },
    { value: "Artificial Intelligence", label: "Artificial Intelligence" },
    { value: "Cybersecurity", label: "Cybersecurity" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Data", label: "Data" },
    { value: "Operations", label: "Operations" },
    { value: "Customer Success", label: "Customer Success" },
    { value: "Human Resources", label: "Human Resources" },
  ];

  locationOptions: ComboOption[] = [
    { value: "Remote", label: "Remote" },
    { value: "Paris", label: "Paris" },
    { value: "Berlin", label: "Berlin" },
    { value: "London", label: "London" },
    { value: "Albania", label: "Albania" },
    { value: "New York", label: "New York" },
    { value: "Zurich", label: "Zurich" },
    { value: "Lyon", label: "Lyon" },
    { value: "Switzerland", label: "Switzerland" },
  ];

  contractTypeOptions: ComboOption[] = [
    { value: "FULL_TIME", label: "Full-time" },
    { value: "PART_TIME", label: "Part-time" },
    { value: "CONTRACT", label: "Contract" },
    { value: "INTERNSHIP", label: "Internship" },
    { value: "FREELANCE", label: "Freelance" },
    { value: "TEMPORARY", label: "Temporary" },
  ];

  experienceOptions: ComboOption[] = [
    { value: "Entry", label: "Entry level" },
    { value: "Mid", label: "Mid level" },
    { value: "Senior", label: "Senior level" },
    { value: "Lead", label: "Lead / Manager" },
    { value: "Director", label: "Director" },
  ];

  postedDateOptions: ComboOption[] = [
    { value: "1", label: "Last 24 hours" },
    { value: "7", label: "Last 7 days" },
    { value: "14", label: "Last 14 days" },
    { value: "30", label: "Last 30 days" },
  ];

  workModeOptions: ComboOption[] = [
    { value: "REMOTE", label: "Remote" },
    { value: "HYBRID", label: "Hybrid" },
    { value: "ONSITE", label: "On-site" },
  ];

  salaryOptions: ComboOption[] = [
    { value: "40", label: " 40k+ XAF" },
    { value: "60", label: " 60k+ XAF" },
    { value: "80", label: " 80k+ XAF" },
    { value: "100", label: "100k+ XAF" },
    { value: "120", label: "120k+ XAF" },
  ];

  companyOptions: ComboOption[] = [];

  skillOptions: ComboOption[] = [
    { value: "React", label: "React" },
    { value: "Node.js", label: "Node.js" },
    { value: "Python", label: "Python" },
    { value: "ML", label: "Machine Learning" },
    { value: "Kubernetes", label: "Kubernetes" },
    { value: "SQL", label: "SQL" },
    { value: "Figma", label: "Figma" },
    { value: "DevSecOps", label: "DevSecOps" },
    { value: "User research", label: "User research" },
    { value: "CRM", label: "CRM" },
  ];

  sortOptions: ComboOption[] = [
    { value: "recent", label: "Ranked: most recent" },
    { value: "match", label: "Ranked: best match" },
    { value: "salary-high", label: "Salary: high to low" },
    { value: "salary-low", label: "Salary: low to high" },
  ];

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get isCandidate(): boolean {
    return this.authService.isCandidate();
  }

  get sortLabel(): string {
    const val = this.selectedSort[0] || "recent";
    const opt = this.sortOptions.find((o) => o.value === val);
    return opt ? opt.label : "Ranked: most recent";
  }

  constructor(
    private jobOfferService: JobOffersService,
    private transloco: TranslocoService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private dialog: MatDialog,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params["keyword"]) {
        this.keywordSearch = params["keyword"];
      }
      if (params["location"]) {
        this.selectedLocations = [params["location"]];
      }
      if (params["category"]) {
        this.selectedCategories = [params["category"]];
      }
      this.loadItems();
    });
  }

  // ── Filter change handlers ─────────────────────────

  onFilterChange(filterKey: string, values: string[]): void {
    // Only update state — search fires on button click via applyFilters()
    const propertyMap: Record<string, string> = {
      categories: "selectedCategories",
      locations: "selectedLocations",
      contractTypes: "selectedContractTypes",
      experience: "selectedExperience",
      postedDate: "selectedPostedDate",
      workModes: "selectedWorkModes",
      salary: "selectedSalary",
      companies: "selectedCompanies",
      skills: "selectedSkills",
    };
    const prop = propertyMap[filterKey];
    if (prop) {
      (this as any)[prop] = values;
    }
  }

  onSortChange(values: string[]): void {
    this.selectedSort = values.length > 0 ? values : ["recent"];
    this.page = 1;
    this.loadItems(1);
  }

  applyFilters(): void {
    this.page = 1;
    this.loadItems(1);
  }

  resetAllFilters(): void {
    this.keywordSearch = "";
    this.selectedCategories = [];
    this.selectedLocations = [];
    this.selectedContractTypes = [];
    this.selectedExperience = [];
    this.selectedPostedDate = [];
    this.selectedWorkModes = [];
    this.selectedSalary = [];
    this.selectedCompanies = [];
    this.selectedSkills = [];
    this.selectedSort = ["recent"];
    this.page = 1;
    this.expandedJobId = null;

    // Clear the URL too — otherwise the stale ?keyword=/&location=/&category=
    // from the initial navigation stays in the address bar and comes back
    // on refresh or if the link is shared, even though the filters below
    // have visibly been reset.
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });

    this.loadItems(1);
  }

  // ── Active chips ───────────────────────────────────

  get activeChips(): string[] {
    const chips: string[] = [];

    if (this.keywordSearch) {
      chips.push(`Keyword: ${this.keywordSearch}`);
    }

    const addLabels = (values: string[], options: ComboOption[]) => {
      values.forEach((v) => {
        const opt = options.find((o) => o.value === v);
        if (opt) chips.push(opt.label);
      });
    };

    addLabels(this.selectedCategories, this.categoryOptions);
    addLabels(this.selectedLocations, this.locationOptions);
    addLabels(this.selectedContractTypes, this.contractTypeOptions);
    addLabels(this.selectedExperience, this.experienceOptions);
    addLabels(this.selectedPostedDate, this.postedDateOptions);
    addLabels(this.selectedWorkModes, this.workModeOptions);
    addLabels(this.selectedSalary, this.salaryOptions);
    addLabels(this.selectedCompanies, this.companyOptions);
    addLabels(this.selectedSkills, this.skillOptions);

    return chips;
  }

  // ── Card expand / collapse ─────────────────────────

  toggleExpand(jobId: string): void {
    this.expandedJobId = this.expandedJobId === jobId ? null : jobId;
  }

  // ── Apply / bookmark ───────────────────────────────

  applyNow(jobId: string): void {
    this.router.navigate(["/apply", jobId]);
  }

  onAddToFavorite(item: ModuleObject): void {
    if (!item?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("joboffers.jobDetails.addToFavorites"),
      content: this.transloco.translate(
        "joboffers.jobDetails.addToFavoritesConfirm",
        { title: item.title },
      ),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("joboffers.jobDetails.cancel"),
          value: false,
          color: undefined,
        },
        {
          id: "confirm",
          label: this.transloco.translate("joboffers.jobDetails.confirm"),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    const sub = dialogRef.componentInstance.action.subscribe(
      (result: string) => {
        if (result === "confirm") {
          if (!this.candidateId) {
            dialogRef.close();
            sub.unsubscribe();
            this.dialog.open(GenericModalComponent, {
              width: "400px",
              data: {
                title: this.transloco.translate("joboffers.jobDetails.accessDeniedTitle"),
                content: this.transloco.translate("joboffers.jobDetails.onlyCandidatesCanFavorite"),
                type: "danger",
                actions: [
                  {
                    id: "ok",
                    label: this.transloco.translate("general.ok"),
                    value: true,
                    color: "primary",
                  },
                ],
              } as GenericModalData,
            });
            return;
          }

          this.jobOfferService
            .addToFavorites(item.id, this.candidateId)
            .subscribe({
              next: () => {
                dialogRef.close();
                sub.unsubscribe();
                goToTop();
                this.loadItems();
              },
              error: (error: unknown) => {
                console.error("Error adding to favorites:", error);
              },
            });
        } else {
          dialogRef.close();
          sub.unsubscribe();
        }
      },
    );
  }

  // ── Share search link ──────────────────────────────

  copySearchLink(): void {
    const url = window.location.href;
    navigator.clipboard.writeText(url).catch(() => {});
  }

  // ── Data loading ───────────────────────────────────

  loadItems(page = 1): void {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    const queryParams: Record<string, unknown> = {
      page,
      limit: this.pageSize,
      status: "ACTIVE",
    };

    if (this.keywordSearch) {
      queryParams["keyword"] = this.keywordSearch;
    }
    if (this.selectedContractTypes.length > 0) {
      queryParams["contractType"] = this.selectedContractTypes.join(",");
    }
    if (this.selectedLocations.length > 0) {
      queryParams["location"] = this.selectedLocations.join(",");
    }
    if (this.selectedWorkModes.length > 0) {
      queryParams["jobType"] = this.selectedWorkModes.join(",");
    }
    if (this.selectedExperience.length > 0) {
      queryParams["experienceLevel"] = this.selectedExperience.join(",");
    }
    if (this.selectedPostedDate.length > 0) {
      queryParams["postedDate"] = this.selectedPostedDate.join(",");
    }
    if (this.selectedCategories.length > 0) {
      queryParams["category"] = this.selectedCategories.join(",");
    }
    if (this.selectedCompanies.length > 0) {
      queryParams["companyId"] = this.selectedCompanies.join(",");
    }
    if (this.selectedSkills.length > 0) {
      queryParams["tags"] = this.selectedSkills;
    }
    if (this.selectedSalary.length > 0) {
      const range = this.selectedSalary[0];
      queryParams["minSalary"] = range;
    }

    // Sort parameter
    const sortVal = this.selectedSort[0] || "recent";
    if (sortVal === "salary-high") {
      queryParams["sort"] = "salary:desc";
    } else if (sortVal === "salary-low") {
      queryParams["sort"] = "salary:asc";
    } else {
      queryParams["sort"] = "recent";
    }

    this.jobOfferService.selectMany(queryParams).subscribe({
      next: async (res: any) => {
        await wait();
        this.items = res.data ?? [];
        this.totalResults = res.total ?? 0;
        const limit = res.limit ?? this.pageSize;
        this.totalPages = Math.max(1, Math.ceil(this.totalResults / limit));

        // Populate company options from results
        const companyNames = new Map<string, string>();
        this.items.forEach((item) => {
          if (item.company?.id && item.company?.name) {
            companyNames.set(item.company.id, item.company.name);
          }
        });
        if (companyNames.size > 0) {
          this.companyOptions = Array.from(companyNames.entries()).map(
            ([value, label]) => ({ value, label }),
          );
        }

        this.isLoading = false;
      },
      error: (error: any) => {
        console.error("Error loading jobs:", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  // ── Pagination ─────────────────────────────────────

  onPageChange(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.loadItems(newPage);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // ── Display helpers ────────────────────────────────

  getCompanyInitials(job: ModuleObject): string {
    const name = job.company?.name;
    if (!name) return "??";
    return name
      .split(/[\s-]+/)
      .filter((_, i, arr) => i < 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");
  }

  getJobColor(job: ModuleObject): Record<string, boolean> {
    const colors = [
      "bg-blue",
      "bg-coral",
      "bg-emerald-500",
      "bg-violet-600",
      "bg-orange-500",
      "bg-indigo-600",
      "bg-cyan-600",
      "bg-pink-600",
      "bg-teal-600",
      "bg-slate-900",
    ];
    const hash = (job.id ?? "")
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), 0);
    const colorClass = colors[hash % colors.length];
    return { [colorClass]: true };
  }

  getTimeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return this.transloco.translate("jobs.time.justNow");
    if (diffMins < 60)
      return this.transloco.translate("jobs.time.minutesAgo", {
        count: diffMins,
      });
    if (diffHours < 24)
      return this.transloco.translate("jobs.time.hoursAgo", {
        count: diffHours,
      });
    if (diffDays < 7)
      return this.transloco.translate("jobs.time.daysAgo", { count: diffDays });
    if (diffDays < 30)
      return this.transloco.translate("jobs.time.weeksAgo", {
        count: Math.floor(diffDays / 7),
      });
    return this.transloco.translate("jobs.time.monthsAgo", {
      count: Math.floor(diffDays / 30),
    });
  }

  getJobTags(job: ModuleObject): string[] {
    if (!job.tags || !Array.isArray(job.tags)) return [];
    return job.tags
      .map((t: any) => t?.tag?.name ?? t?.name ?? "")
      .filter(Boolean);
  }

  getJobTypeLabel(jobType: string): string {
    const key = `jobs.enums.jobType.${jobType}`;
    const translated = this.transloco.translate(key);
    return translated !== key ? translated : jobType;
  }

  getContractTypeLabel(contractType: string): string {
    const key = `jobs.enums.contractType.${contractType}`;
    const translated = this.transloco.translate(key);
    return translated !== key ? translated : contractType;
  }

  getJobLevelLabel(jobLevel: string): string {
    const key = `jobs.enums.jobLevel.${jobLevel}`;
    const translated = this.transloco.translate(key);
    return translated !== key ? translated : jobLevel;
  }

  goBack(): void {
    this.location.back();
  }
}
