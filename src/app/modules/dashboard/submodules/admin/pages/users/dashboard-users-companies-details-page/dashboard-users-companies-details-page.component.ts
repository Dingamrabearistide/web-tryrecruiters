import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "@modules/users/users.service";
import { User, UserRole } from "@modules/users/users.type";
import { TranslocoService } from "@ngneat/transloco";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { InterviewsService } from "@modules/interview/interviews.service";
import { ApplicationsService } from "@modules/applications/applications.service";
import { Company } from "@modules/compagnies/companies.types";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { Interview } from "@modules/interview/interview.types";
import { Application } from "@modules/applications/applications.types";
import { forkJoin } from "rxjs";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-users-details-page",
  templateUrl: "./dashboard-users-companies-details-page.component.html",
})
export class DashboardUsersCompaniesDetailsPageComponent implements OnInit {
  item: User = {} as User;
  isLoading = true;
  hasError = false;
  errorMessage = "";
  currentUserId: string | null = null;

  // Data properties for different user roles
  userCompanies: Company[] = [];
  userJobOffers: JobOffer[] = [];
  userInterviews: Interview[] = [];
  userApplications: Application[] = [];

  // Loading states for each data type
  companiesLoading = false;
  jobOffersLoading = false;
  interviewsLoading = false;
  applicationsLoading = false;

  // Error states for each data type
  companiesHasError = false;
  jobOffersHasError = false;
  interviewsHasError = false;
  applicationsHasError = false;

  // Error messages for each data type
  companiesErrorMessage = "";
  jobOffersErrorMessage = "";
  interviewsErrorMessage = "";
  applicationsErrorMessage = "";

  // Pagination properties
  companiesPagination = { page: 1, limit: 10, total: 0 };
  jobOffersPagination = { page: 1, limit: 10, total: 0 };
  interviewsPagination = { page: 1, limit: 10, total: 0 };
  applicationsPagination = { page: 1, limit: 10, total: 0 };

  // UserRole enum for template access
  UserRole = UserRole;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private jobOffersService: JobOffersService,
    private interviewsService: InterviewsService,
    private applicationsService: ApplicationsService,
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  handleEdit(): void {
    if (this.currentUserId) {
      this.router.navigate(["/admin/users", this.currentUserId, "edit"]);
    }
  }

  handleDelete(): void {
    if (
      !this.currentUserId ||
      !confirm(this.transloco.translate("users.delete.confirm"))
    ) {
      return;
    }

    this.isLoading = true;
    this.usersService.delete(this.currentUserId).subscribe({
      next: () => {
        this.router.navigate(["/admin/users"]);
      },
      error: (err: any) => {
        this.handleError(this.transloco.translate("users.delete.error"), err);
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleActivate(): void {
    // Implementation for activating user
    console.log("Activate user:", this.item.id);
  }

  handleDeactivate(): void {
    // Implementation for deactivating user
    console.log("Deactivate user:", this.item.id);
  }

  handleBack(): void {
    this.location.back();
  }

  // Navigation methods for detail pages
  navigateToCompanyDetail(company: any): void {
    const employerId = this.getEmployerId();
    const companyId = company?.id || company;
    this.router.navigate([
      "/dashboard/admin",
      employerId,
      "companies",
      companyId,
    ]);
  }

  navigateToJobOfferDetail(jobOffer: any): void {
    const employerId = this.getEmployerId();
    const jobOfferId = jobOffer?.id || jobOffer;
    this.router.navigate([
      "/dashboard/admin",
      employerId,
      "job-offers",
      jobOfferId,
    ]);
  }

  navigateToInterviewDetail(interview: any): void {
    const employerId = this.getEmployerId();
    const interviewId = interview?.id || interview;
    this.router.navigate([
      "/dashboard/admin",
      employerId,
      "interviews",
      interviewId,
    ]);
  }

  navigateToApplicationDetail(application: any): void {
    const employerId = this.getEmployerId();
    const applicationId = application?.id || application;
    this.router.navigate([
      "/dashboard/admin",
      employerId,
      "applications",
      applicationId,
    ]);
  }

  /** Walks up the route snapshot tree to find the :employerId param. */
  private getEmployerId(): string | null {
    let snapshot = this.route.snapshot;
    while (snapshot) {
      const id = snapshot.paramMap.get("employerId");
      if (id) return id;
      if (!snapshot.parent) break;
      snapshot = snapshot.parent;
    }
    return null;
  }

  // Computed properties for total pages
  get companiesTotalPages(): number {
    return Math.ceil(
      this.companiesPagination.total / this.companiesPagination.limit
    );
  }

  get jobOffersTotalPages(): number {
    return Math.ceil(
      this.jobOffersPagination.total / this.jobOffersPagination.limit
    );
  }

  get interviewsTotalPages(): number {
    return Math.ceil(
      this.interviewsPagination.total / this.interviewsPagination.limit
    );
  }

  get applicationsTotalPages(): number {
    return Math.ceil(
      this.applicationsPagination.total / this.applicationsPagination.limit
    );
  }

  // Pagination handlers
  onCompaniesPageChange(page: number): void {
    if (this.currentUserId) {
      this.loadUserCompanies(this.currentUserId, page);
    }
  }

  onJobOffersPageChange(page: number): void {
    if (this.currentUserId) {
      this.loadUserJobOffers(this.currentUserId, page);
    }
  }

  onInterviewsPageChange(page: number): void {
    if (this.currentUserId) {
      this.loadUserInterviews(this.currentUserId, page);
    }
  }

  onApplicationsPageChange(page: number): void {
    if (this.currentUserId) {
      this.loadUserApplications(this.currentUserId, page);
    }
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get("id") || params.get("userId");
      console.log("User ID from route:", userId);
      this.currentUserId = userId;

      if (!userId) {
        this.hasError = true;
        this.errorMessage = this.transloco.translate(
          "users.errors.noUserIdInUrl"
        );
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      this.clearErrorState();

      this.usersService.selectById(userId).subscribe({
        next: (response: User) => {
          if (response) {
            this.item = response;
            console.log("User data loaded:", this.item);
          } else {
            this.handleError(
              this.transloco.translate("users.errors.userNotFound")
            );
          }
        },
        error: (err: any) => {
          this.handleError(
            this.transloco.translate("users.errors.loadingError"),
            err
          );
        },
        complete: () => {
          this.isLoading = false;
          this.loadUserRelatedData();
          this.cdr.detectChanges();
        },
      });
    });
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

  private loadUserRelatedData(): void {
    if (!this.item || !this.item.id || !this.item.role) {
      return;
    }

    const userId = this.item.id;
    const userRole = this.item.role;

    // Load data based on user role
    switch (userRole) {
      case UserRole.RECRUITER:
        this.loadRecruiterData(userId);
        break;
      case UserRole.CANDIDATE:
        this.loadCandidateData(userId);
        break;
      case UserRole.ADMIN:
        this.loadAdminData(userId);
        break;
      default:
        console.log("Unknown user role:", userRole);
    }
  }

  private loadRecruiterData(userId: string): void {
    // For recruiters, load companies, job offers, and interviews
    this.loadUserCompanies(userId);
    this.loadUserJobOffers(userId);
    this.loadUserInterviews(userId);
  }

  private loadCandidateData(userId: string): void {
    // For candidates, load applications and interviews
    this.loadUserApplications(userId);
    this.loadUserInterviews(userId);
  }

  private loadAdminData(userId: string): void {
    // For admins, load all data types
    this.loadUserCompanies(userId);
    this.loadUserJobOffers(userId);
    this.loadUserInterviews(userId);
    this.loadUserApplications(userId);
  }

  private loadUserCompanies(userId: string, page: number = 1): void {
    this.companiesLoading = true;
    this.companiesHasError = false;
    this.companiesErrorMessage = "";

    this.companiesService
      .selectMany({
        accountId: userId,
        page: page,
        limit: this.companiesPagination.limit,
      })
      .subscribe({
        next: (response) => {
          this.userCompanies = response.data || [];
          this.companiesPagination.total = response.total || 0;
          this.companiesPagination.page = page;
          this.companiesHasError = false;
        },
        error: (err) => {
          console.error("Error loading user companies:", err);
          this.userCompanies = [];
          this.companiesHasError = true;
          this.companiesErrorMessage = this.transloco.translate(
            "companies.errors.loadingError"
          );
        },
        complete: () => {
          this.companiesLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private loadUserJobOffers(userId: string, page: number = 1): void {
    this.jobOffersLoading = true;
    this.jobOffersHasError = false;
    this.jobOffersErrorMessage = "";

    this.jobOffersService
      .selectManyPublic({
        createdById: userId,
        page: page,
        limit: this.jobOffersPagination.limit,
      })
      .subscribe({
        next: (response) => {
          this.userJobOffers = response.data || [];
          this.jobOffersPagination.total = response.total || 0;
          this.jobOffersPagination.page = page;
          this.jobOffersHasError = false;
        },
        error: (err) => {
          console.error("Error loading user job offers:", err);
          this.userJobOffers = [];
          this.jobOffersHasError = true;
          this.jobOffersErrorMessage = this.transloco.translate(
            "jobOffers.errors.loadingError"
          );
        },
        complete: () => {
          this.jobOffersLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private loadUserInterviews(userId: string, page: number = 1): void {
    this.interviewsLoading = true;
    this.interviewsHasError = false;
    this.interviewsErrorMessage = "";

    this.interviewsService
      .selectMany({
        recruiterId: userId,
        page: page,
        limit: this.interviewsPagination.limit,
      })
      .subscribe({
        next: (response) => {
          this.userInterviews = response.data || [];
          this.interviewsPagination.total = response.total || 0;
          this.interviewsPagination.page = page;
          this.interviewsHasError = false;
        },
        error: (err) => {
          console.error("Error loading user interviews:", err);
          this.userInterviews = [];
          this.interviewsHasError = true;
          this.interviewsErrorMessage = this.transloco.translate(
            "interviews.errors.loadingError"
          );
        },
        complete: () => {
          this.interviewsLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  private loadUserApplications(userId: string, page: number = 1): void {
    this.applicationsLoading = true;
    this.applicationsHasError = false;
    this.applicationsErrorMessage = "";

    this.applicationsService
      .selectMany({
        candidateId: userId,
        page: page,
        limit: this.applicationsPagination.limit,
      })
      .subscribe({
        next: (response) => {
          this.userApplications = response.data || [];
          this.applicationsPagination.total = response.total || 0;
          this.applicationsPagination.page = page;
          this.applicationsHasError = false;
        },
        error: (err) => {
          console.error("Error loading user applications:", err);
          this.userApplications = [];
          this.applicationsHasError = true;
          this.applicationsErrorMessage = this.transloco.translate(
            "applications.errors.loadingError"
          );
        },
        complete: () => {
          this.applicationsLoading = false;
          this.cdr.detectChanges();
        },
      });
  }
}
