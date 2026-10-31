import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { Company as ModuleObject } from "@modules/compagnies/companies.types";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../@1hand/components/generic-modal/generic-modal.component";
import { goToTop, wait, formatSalaryAmount } from "../../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-companies-details-page",
  templateUrl: "./companies-details-page.component.html",
  styleUrl: "./companies-details-page.component.scss",
})
export class CompaniesDetailsPageComponent implements OnInit {
  formatSalaryAmount = formatSalaryAmount;

  isLoading = false;
  hasError = false;
  errorMessage = "";
  logoError = false;

  item!: ModuleObject;
  jobOffers: JobOffer[] = [];
  relatedCompanies: ModuleObject[] = [];

  // Tabs
  activeTab = "overview";
  tabs = [
    { key: "overview", icon: "fa-solid fa-circle-info", labelKey: "companyDetails.tabs.overview.title" },
    { key: "jobs", icon: "fa-solid fa-briefcase", labelKey: "companyDetails.tabs.jobs.title" },
  ];

  // Gradient colors for job cards
  jobGradients = [
    { from: "#7c3aed", to: "#241449" },
    { from: "#149df2", to: "#0b79d0" },
    { from: "#0f172a", to: "#64748b" },
    { from: "#f97316", to: "#ff5148" },
    { from: "#059669", to: "#0d9488" },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private companiesService: CompaniesService,
    private jobOffersService: JobOffersService,
    private transloco: TranslocoService,
    private dialog: MatDialog,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("slug");

      if (id) {
        this.loadItem(id);
        this.loadJobs(id);
      } else {
        console.error("No ID provided in route parameters.");
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  setActiveTab(tabKey: string): void {
    this.activeTab = tabKey;
  }

  loadItem(id: string) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.companiesService.selectById(id).subscribe({
      next: async (res) => {
        await wait();
        this.item = res;
        this.logoError = false;

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

  loadJobs(companyId: string) {
    this.jobOffersService
      .selectManyPublic({
        page: 1,
        limit: 10,
        companyId: companyId,
        status: "ACTIVE",
      })
      .subscribe({
        next: async (res) => {
          await wait();
          this.jobOffers = res.data;
        },
        error: (error) => {
          console.error("Error loading jobs", error);
        },
      });
  }

  // Accordion: which job offer is currently expanded
  expandedJobId: string | null = null;

  toggleJob(job: JobOffer): void {
    this.expandedJobId = this.expandedJobId === job.id ? null : job.id;
  }

  subscribe(): void {
    if (!this.item?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("companyDetails.follow.title"),
      content: this.transloco.translate("companyDetails.follow.confirm", {
        name: this.item.name,
      }),
      actions: [
        {
          label: this.transloco.translate("companyDetails.follow.cancel"),
          value: false,
          color: undefined,
        },
        {
          label: this.transloco.translate("companyDetails.follow.confirmBtn"),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log("Company followed:", this.item.name);
      }
    });
  }

  share(platform: string): void {
    if (!this.item?.id) return;

    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: this.item.name,
        text: this.item.description || "",
        url: url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        console.log("Link copied to clipboard");
      });
    }
  }

  /** Get company initials for avatar fallback */
  getInitials(): string {
    if (!this.item?.name) return "";
    return this.item.name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  /** Get initials for a job card */
  getJobInitials(job: JobOffer): string {
    if (!job.title) return "";
    return job.title
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  /** Get gradient style for job card */
  getJobGradientStyle(index: number): { [key: string]: string } {
    const i = index % this.jobGradients.length;
    const grad = this.jobGradients[i];
    return {
      background: `linear-gradient(to bottom right, ${grad.from}, ${grad.to})`,
    };
  }

  /** Get relative time from a date string */
  getTimeAgo(dateStr: string | undefined): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return this.transloco.translate("companyDetails.time.today");
    if (diffDays === 1) return this.transloco.translate("companyDetails.time.yesterday");
    if (diffDays < 30) return `${diffDays} ${this.transloco.translate("companyDetails.time.daysAgo")}`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths === 1) return this.transloco.translate("companyDetails.time.lastMonth");
    return `${diffMonths} ${this.transloco.translate("companyDetails.time.monthsAgo")}`;
  }
}
