import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin } from "rxjs";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { ApplicationsService } from "@modules/applications/applications.service";
import { Application } from "@modules/applications/applications.types";
import { InterviewsService } from "@modules/interview/interviews.service";
import { Interview } from "@modules/interview/interview.types";
import { TranslocoService } from "@ngneat/transloco";
import { wait } from "../../../../../../../@1hand/utils";
import { BaseParamsQuery } from "../../../../../../../@1hand/base.type";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-jobs-offers-details-page",
  templateUrl: "./dashboard-admin-job-offers-details-page.component.html",
})
export class DashboardAdminJobOffersDetailsPageComponent implements OnInit {
  item!: JobOffer;
  company: any | null = null;

  isLoading = true;
  hasError = false;
  errorMessage = "";
  currentCompanyId: string | null = null;

  // Data properties for related entities
  jobOfferApplications: Application[] = [];
  jobOfferInterviews: Interview[] = [];

  // Loading states for each data type
  applicationsLoading = false;
  interviewsLoading = false;

  // Error states for each data type
  applicationsHasError = false;
  interviewsHasError = false;

  // Error messages for each data type
  applicationsErrorMessage = "";
  interviewsErrorMessage = "";

  // Pagination properties
  applicationsPagination = { page: 1, limit: 10, total: 0 };
  interviewsPagination = { page: 1, limit: 10, total: 0 };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: JobOffersService,
    private companiesService: CompaniesService,
    private applicationsService: ApplicationsService,
    private interviewsService: InterviewsService,
    private cdr: ChangeDetectorRef,
    private transloco: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  handleBack(): void {
    this.router.navigate(["../list"], { relativeTo: this.route });
  }

  // private loadJob(): void {
  //   this.route.paramMap.subscribe((params) => {
  //     const jobId = params.get("jobOffersId");
  //     console.log("job ID from route:", jobId);
  //     this.currentCompanyId = jobId;

  //     if (!jobId) {
  //       this.hasError = true;
  //       this.errorMessage = this.transloco.translate(
  //         "job-offers.pages.jobOffers.noJobIdFound"
  //       );
  //       this.isLoading = false;
  //       return;
  //     }

  //     this.isLoading = true;
  //     this.clearErrorState();
  //   });
  // }

  handleViewCompany(): void {
    if (this.item?.companyId) {
      this.router.navigate([`/employers/companies/${this.item.companyId}`]);
    }
  }

  handleEdit(): void {
    if (this.currentCompanyId) {
      this.router.navigate([
        "/employers/job-offers",
        this.currentCompanyId,
        "edit",
      ]);
    }
  }

  handleDelete(): void {
    // if (
    //   !this.currentCompanyId ||
    //   !confirm(
    //     this.transloco.translate("job-offers.pages.jobOffers.confirmDeleteJob")
    //   )
    // ) {
    //   return;
    // }
    // this.isLoading = true;
    // this.jobOffersService
    //   .deleteItem(this.job?.id as string)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     catchError((err) => {
    //       this.handleError(
    //         this.transloco.translate(
    //           "job-offers.pages.jobOffers.errorDeletingJob"
    //         ),
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
    //     this.router.navigate(["/employers/job-offers"]);
    //   });
  }

  // Navigation methods for detail pages
  navigateToApplicationDetail(application: any): void {
    const employerId = this.route.snapshot.paramMap.get("employerId");
    const applicationId = application?.id || application;
    this.router.navigate([
      "/dashboard/admin",
      employerId,
      "applications",
      applicationId,
    ]);
  }

  navigateToInterviewDetail(interview: any): void {
    const employerId = this.route.snapshot.paramMap.get("employerId");
    const interviewId = interview?.id || interview;
    this.router.navigate([
      "/dashboard/admin",
      employerId,
      "interviews",
      interviewId,
    ]);
  }

  // Computed properties for total pages
  get applicationsTotalPages(): number {
    return Math.ceil(
      this.applicationsPagination.total / this.applicationsPagination.limit,
    );
  }

  get interviewsTotalPages(): number {
    return Math.ceil(
      this.interviewsPagination.total / this.interviewsPagination.limit,
    );
  }

  // Pagination handlers
  onApplicationsPageChange(page: number): void {
    if (this.item?.id) {
      this.loadJobOfferApplications(this.item.id, page);
    }
  }

  onInterviewsPageChange(page: number): void {
    this.loadInterviewsForApplications(this.jobOfferApplications);
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const paramItemIdName = "jobOffersId";
      const itemId = params.get(paramItemIdName);

      if (!itemId) {
        throw new Error(`No query param id ${paramItemIdName}`);
      }

      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = "";

      this.service.selectById(itemId).subscribe({
        next: async (response) => {
          await wait();

          this.item = response;

          this.isLoading = false;
          this.hasError = false;
          this.errorMessage = "";

          // Load related data after main item is loaded
          this.loadJobOfferRelatedData();
        },
        error: (error) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            error?.error.message ??
            this.transloco.translate("general.genericError");
        },
      });
    });
  }

  private loadJobOfferRelatedData(): void {
    if (!this.item?.id) return;
    this.loadJobOfferApplications(this.item.id);
  }

  private loadJobOfferApplications(jobOfferId: string, page: number = 1): void {
    this.applicationsLoading = true;
    this.applicationsHasError = false;
    this.applicationsErrorMessage = "";

    const params: BaseParamsQuery = {
      page: page,
      limit: this.applicationsPagination.limit,
      jobOfferId,
    };

    this.applicationsService.selectMany(params as any).subscribe({
      next: (response) => {
        this.jobOfferApplications = response.data || [];
        this.applicationsPagination.total = response.total || 0;
        this.applicationsPagination.page = page;
        this.applicationsHasError = false;
        this.loadInterviewsForApplications(this.jobOfferApplications);
      },
      error: (err) => {
        console.error("Error loading job offer applications:", err);
        this.jobOfferApplications = [];
        this.applicationsHasError = true;
        this.applicationsErrorMessage =
          "Erreur lors du chargement des candidatures.";
      },
      complete: () => {
        this.applicationsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private loadInterviewsForApplications(applications: Application[]): void {
    if (!applications.length) {
      this.jobOfferInterviews = [];
      this.interviewsPagination.total = 0;
      this.cdr.detectChanges();
      return;
    }

    this.interviewsLoading = true;
    this.interviewsHasError = false;
    this.interviewsErrorMessage = "";

    const requests = applications.map((app) =>
      this.interviewsService.selectMany({
        page: 1,
        limit: this.interviewsPagination.limit,
        applicationId: app.id,
      } as any)
    );

    forkJoin(requests).subscribe({
      next: (responses) => {
        this.jobOfferInterviews = responses.flatMap((r) => r.data || []);
        this.interviewsPagination.total = this.jobOfferInterviews.length;
        this.interviewsHasError = false;
      },
      error: (err) => {
        console.error("Error loading interviews:", err);
        this.jobOfferInterviews = [];
        this.interviewsHasError = true;
        this.interviewsErrorMessage = "Erreur lors du chargement des entretiens.";
      },
      complete: () => {
        this.interviewsLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  // private handleError(message: string, error?: any): void {
  //   this.hasError = true;
  //   this.errorMessage = message;
  //   if (error) console.error(message, error);
  //   this.cdr.detectChanges();
  // }

  private clearErrorState(): void {
    this.hasError = false;
    this.errorMessage = "";
  }
}
