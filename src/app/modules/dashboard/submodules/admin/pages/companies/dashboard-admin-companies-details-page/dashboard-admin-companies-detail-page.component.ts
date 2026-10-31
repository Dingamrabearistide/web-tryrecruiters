import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { Company } from "@modules/compagnies/companies.types";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { paramsDto, JobOffer } from "@modules/job-offers/job-offers.types";
import { UsersService } from "@modules/users/users.service";
import { User } from "@modules/users/users.type";
import { BaseParamsQuery } from "../../../../../../../@1hand/base.type";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-companies-details-page",
  templateUrl: "./dashboard-admin-companies-detail-page.component.html",
})
export class DashboardAdminCompaniesDetailPageComponent implements OnInit {
  item: Company = {} as Company;
  jobOffers: any[] = [];
  relatedCompanies: Company[] | Partial<Company>[] = [];
  isLoading = true;
  hasError = false;
  errorMessage = "";
  currentCompanyId: string | null = null;

  // Data properties for datatables
  companyJobOffers: JobOffer[] = [];
  companyRecruiters: User[] = [];

  // Loading states for each data type
  jobOffersLoading = false;
  recruitersLoading = false;

  // Error states for each data type
  jobOffersHasError = false;
  recruitersHasError = false;

  // Error messages for each data type
  jobOffersErrorMessage = "";
  recruitersErrorMessage = "";

  // Pagination properties
  jobOffersPagination = { page: 1, limit: 10, total: 0 };
  recruitersPagination = { page: 1, limit: 10, total: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companiesService: CompaniesService,
    private jobOffersService: JobOffersService,
    private usersService: UsersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  handleCreateJobOffer(): void {
    if (this.item?.id) {
      this.router.navigate([`/employers/job-offers/create`], {
        queryParams: { companyId: this.item.id },
      });
    }
  }

  handleEdit(): void {
    if (this.currentCompanyId) {
      this.router.navigate([
        "/employers/companies",
        this.currentCompanyId,
        "edit",
      ]);
    }
  }

  handleDelete(): void {
    // if (
    //   !this.currentCompanyId ||
    //   !confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")
    // ) {
    //   return;
    // }
    // this.isLoading = true;
    // this.companiesService
    //   .deleteItem(this.currentCompanyId)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     catchError((err) => {
    //       this.handleError(
    //         "Erreur lors de la suppression de l'entreprise.",
    //         err
    //       );
    //       return [];
    //     }),
    //     finalize(() => {
    //       this.isLoading = false;
    //       this.cdr.detectChanges();
    //     })
    //   )
    //   .subscribe(() => {
    //     this.router.navigate(["/employers/companies"]);
    //   });
  }

  handleWebsiteClick(): void {
    if (this.item?.website) {
      const url = this.item.website.startsWith("http")
        ? this.item.website
        : `https://${this.item.website}`;
      window.open(url, "_blank");
    }
  }

  handlePhoneClick(): void {
    if (this.item?.phoneNumber) {
      window.location.href = `tel:${this.item.phoneNumber}`;
    }
  }

  handleEmailClick(): void {
    if (this.item?.email) {
      window.location.href = `mailto:${this.item.email}`;
    }
  }

  handleBack(): void {
    this.location.back();
  }

  // Navigation methods for detail pages
  navigateToJobOfferDetail(jobOffer: any): void {
    const employerId = this.route.snapshot.paramMap.get("employerId");
    const jobOfferId = jobOffer?.id || jobOffer;
    this.router.navigate([
      "/dashboard/admin",
      employerId,
      "job-offers",
      jobOfferId,
    ]);
  }

  navigateToUserDetail(user: any): void {
    const employerId = this.route.snapshot.paramMap.get("employerId");
    const userId = user?.id || user;
    this.router.navigate(["/dashboard/admin", employerId, "users", userId]);
  }

  // Computed properties for total pages
  get jobOffersTotalPages(): number {
    return Math.ceil(
      this.jobOffersPagination.total / this.jobOffersPagination.limit,
    );
  }

  get recruitersTotalPages(): number {
    return Math.ceil(
      this.recruitersPagination.total / this.recruitersPagination.limit,
    );
  }

  // Pagination handlers
  onJobOffersPageChange(page: number): void {
    if (this.currentCompanyId) {
      this.loadCompanyJobOffers(this.currentCompanyId, page);
    }
  }

  onRecruitersPageChange(page: number): void {
    if (this.currentCompanyId) {
      this.loadCompanyRecruiters(this.currentCompanyId, page);
    }
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const companyId = params.get("companyId");
      console.log("Company ID from route:", companyId);
      this.currentCompanyId = companyId;

      if (!companyId) {
        this.hasError = true;
        this.errorMessage = "Aucun identifiant d'entreprise trouvé dans l'URL.";
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      this.clearErrorState();

      this.companiesService.selectById(companyId).subscribe({
        next: (response) => {
          if (response) {
            this.item = response;
            this.loadRelatedCompanies();
          } else {
            this.handleError("Détails de l'entreprise non trouvés.");
          }
        },
        error: (err) => {
          this.handleError(
            "Erreur lors du chargement des détails de l'entreprise.",
            err,
          );
        },
        complete: () => {
          this.isLoading = false;
          this.loadCompanyRelatedData();
          this.cdr.detectChanges();
        },
      });
    });
  }

  private loadRelatedCompanies(): void {
    if (!this.item) return;

    const params: paramsDto = {
      limit: 6,
      page: 1,
      keyword: this.item?.organizationType || this.item?.city || "",
    };

    this.companiesService.selectMany(params).subscribe({
      next: (response: any) => {
        if (response?.data) {
          this.relatedCompanies = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error("Error fetching related companies:", err);
      },
    });
  }

  private loadJobOffers(): void {
    if (!this.item?.id) return;

    this.jobOffersService
      .selectMany({
        // companyId: this.item.id,
      })
      .subscribe({
        next: (response) => {
          if (response?.data) {
            this.jobOffers = response.data;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error("Error fetching job offers:", err);
        },
      });
  }

  private formatLocation(city?: string, country?: string): string {
    if (!city && !country) return "N/A";
    if (city && country) return `${city}, ${country}`;
    return city || country || "N/A";
  }

  private handleError(message: string, error?: any): void {
    this.hasError = true;
    this.errorMessage = message;
    if (error) console.error(message, error);
    this.cdr.detectChanges();
  }

  private clearErrorState(): void {
    this.hasError = false;
    this.errorMessage = "";
  }

  private loadCompanyRelatedData(): void {
    if (!this.currentCompanyId) return;

    // Load company job offers and recruiters
    this.loadCompanyJobOffers(this.currentCompanyId);
    this.loadCompanyRecruiters(this.currentCompanyId);
  }

  private loadCompanyJobOffers(companyId: string, page: number = 1): void {
    this.jobOffersLoading = true;
    this.jobOffersHasError = false;
    this.jobOffersErrorMessage = "";

    this.jobOffersService
      .selectMany({
        page: page,
        limit: this.jobOffersPagination.limit,
        companyId,
        // Note: Add companyId filter if supported by the API
      })
      .subscribe({
        next: (response) => {
          this.companyJobOffers = response.data || [];
          this.jobOffersPagination.total = response.total || 0;
          this.jobOffersPagination.page = page;
          this.jobOffersHasError = false;
        },
        error: (err) => {
          console.error("Error loading company job offers:", err);
          this.companyJobOffers = [];
          this.jobOffersHasError = true;
          this.jobOffersErrorMessage =
            "Erreur lors du chargement des offres d'emploi.";
        },
        complete: () => {
          this.jobOffersLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private loadCompanyRecruiters(companyId: string, page: number = 1): void {
    this.recruitersLoading = true;
    this.recruitersHasError = false;
    this.recruitersErrorMessage = "";

    const params: BaseParamsQuery = {
      page: page,
      limit: this.recruitersPagination.limit,
      // Note: Add companyId filter if supported by the API
    };

    this.usersService.selectMany(params as any).subscribe({
      next: (response) => {
        this.companyRecruiters = response.data || [];
        this.recruitersPagination.total = response.total || 0;
        this.recruitersPagination.page = page;
        this.recruitersHasError = false;
      },
      error: (err) => {
        console.error("Error loading company recruiters:", err);
        this.companyRecruiters = [];
        this.recruitersHasError = true;
        this.recruitersErrorMessage =
          "Erreur lors du chargement des recruteurs.";
      },
      complete: () => {
        this.recruitersLoading = false;
        this.cdr.detectChanges();
      },
    });
  }
}
