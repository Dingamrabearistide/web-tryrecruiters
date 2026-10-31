import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { Company as ModuleObject } from "@modules/compagnies/companies.types";
import { TranslocoService } from "@ngneat/transloco";
import { goToTop, wait } from "../../../../../@1hand/utils";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-companies-list-page",
  templateUrl: "./companies-list-page.component.html",
  styleUrls: ["./companies-list-page.component.scss"],
})
export class CompaniesListPageComponent implements OnInit {
  isLoading = false;
  hasError = false;
  errorMessage = "";

  items: ModuleObject[] = [];

  page = 1;
  totalPages = 1;
  pageSize = 6;
  totalResults = 0;

  // View mode
  listView = false;

  // Search & filters
  searchTerm = "";
  selectedIndustry = "all";
  selectedLocation = "all";
  selectedSize = "all";
  selectedSort = "jobs";

  // Stats for hero section
  stats = {
    registeredCompanies: 97354,
    activeRecruiters: 24800,
    openPositions: 175324,
  };

  // Filter options (matching template data)
  industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Marketing",
    "Cybersecurity",
  ];

  locationOptions = [
    "Remote",
    "Paris",
    "London",
    "Berlin",
    "Zurich",
    "Albania",
  ];

  sizeOptions = [
    { value: "1-50", label: "1-50" },
    { value: "51-250", label: "51-250" },
    { value: "251-1000", label: "251-1000" },
    { value: "1000+", label: "1000+" },
  ];

  // Gradient colors for company cards (matches template company data)
  companyGradients = [
    { from: "#7c3aed", to: "#241449" },    // violet-600 to ink (NexarTrust)
    { from: "#149df2", to: "#0b79d0" },    // blue to blue2 (Super Test 2)
    { from: "#0f172a", to: "#64748b" },    // slate-900 to slate-700 (CyberSecure)
    { from: "#f97316", to: "#ff5148" },    // orange-500 to coral (PixelWorks)
    { from: "#059669", to: "#0d9488" },    // emerald-600 to teal-600 (Insight Labs)
    { from: "#4f46e5", to: "#149df2" },    // indigo-600 to blue (GrowthBird)
    { from: "#0891b2", to: "#149df2" },    // cyan-600 to blue (SecureOps)
    { from: "#db2777", to: "#ff5148" },    // pink-600 to coral (PeopleLoop)
    { from: "#0d9488", to: "#059669" },    // teal-600 to emerald-600 (TalentFlow)
  ];

  constructor(
    private service: CompaniesService,
    private transloco: TranslocoService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  goBack(): void {
    this.location.back();
  }

  loadItems(page = 1) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    const queryParams: any = { page, limit: this.pageSize };

    if (this.searchTerm) {
      queryParams.search = this.searchTerm;
    }
    if (this.selectedIndustry && this.selectedIndustry !== "all") {
      queryParams.industry = this.selectedIndustry;
    }
    if (this.selectedLocation && this.selectedLocation !== "all") {
      queryParams.city = this.selectedLocation;
    }
    if (this.selectedSize && this.selectedSize !== "all") {
      queryParams.companySize = this.selectedSize;
    }

    this.service.selectMany(queryParams).subscribe({
      next: async (res) => {
        await wait();
        this.items = res.data;
        this.totalResults = res.total;
        this.totalPages = Math.max(1, Math.ceil(res.total / res.limit));

        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Error", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadItems(1);
  }

  resetFilters(): void {
    this.searchTerm = "";
    this.selectedIndustry = "all";
    this.selectedLocation = "all";
    this.selectedSize = "all";
    this.selectedSort = "jobs";
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.listView = !this.listView;
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.loadItems(newPage);
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["./", item.id], { relativeTo: this.route });
  }

  /** Returns ngStyle object with CSS linear-gradient for card backgrounds */
  getGradientStyle(index: number): { [key: string]: string } {
    const i = index % this.companyGradients.length;
    const grad = this.companyGradients[i];
    return {
      background: `linear-gradient(to bottom right, ${grad.from}, ${grad.to})`,
    };
  }

  /** Returns ngStyle object with CSS linear-gradient for list initials badge */
  getGradient(index: number): { [key: string]: string } {
    const i = index % this.companyGradients.length;
    const grad = this.companyGradients[i];
    return {
      background: `linear-gradient(to bottom right, ${grad.from}, ${grad.to})`,
    };
  }

  /** Extract company initials from name */
  getInitials(company: ModuleObject): string {
    if (!company.name) return "";
    return company.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  /** Generate page numbers array for pagination */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.page;

    // Show max 5 pages around current page
    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
