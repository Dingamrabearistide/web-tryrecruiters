import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { ApplicationsService as Service } from "@modules/applications/applications.service";
import { CandidatesService } from "@modules/candidates/candidates.service";
import { TranslocoService } from "@ngneat/transloco";
import { Location } from "@angular/common";
import {
  Application,
  ApplicationStatusEnum,
} from "@modules/applications/applications.types";
import { wait } from "../../../../../../../@1hand/utils";
import { Interview } from "@modules/interview/interview.types";
import { InterviewsService } from "@modules/interview/interviews.service";
import { environment } from "@env/environment";
import { AuthService } from "@modules/auth/auth.service";
import { BillingsService } from "../../../../../../../@1hand/modules/billings/billings.service";
import { BillingUserPlan } from "../../../../../../../@1hand/modules/billings/billings.types";

@Component({
  standalone: false,

  selector: "app-applications-detail-page",
  templateUrl: "./dashboard-employers-applications-details-page.component.html",
})
export class DashboardEmployersApplicationsDetailsPageComponent
  implements OnInit
{
  item!: Application;
  interviews: Interview[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = "";
  statusUpdateError = "";
  isDownloadingResume = false;
  history: any[] = [];
  isLoadingHistory = false;
  subscription: BillingUserPlan | null = null;
  canScheduleInterview = true;
  scheduleInterviewBlockedReason: string | null = null;

  get recruiterId() {
    const user = this.authService.getUser();
    return user && this.authService.isRecruiter() ? user.id : null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service,
    private candidatesService: CandidatesService,
    private transloco: TranslocoService,
    private location: Location,
    private interviewService: InterviewsService,
    private http: HttpClient,
    private billingsService: BillingsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadItem();
    this.loadSubscription();
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const paramItemIdName = "applicationId";
      const itemId = params.get(paramItemIdName);

      if (!itemId) {
        throw new Error(`No query param id ${paramItemIdName}`);
      }

      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = "";

      this.service.selectById(itemId).subscribe({
        next: (response) => {
          // wait();

          this.item = response;

          // Fetch full candidate profile (API may return partial candidate)
          this.loadCandidateProfile();

          // this.isLoading = false;
          // this.hasError = false;
          // this.errorMessage = "";

          this.loadIterviews();
          this.loadHistory(itemId);
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

  private loadCandidateProfile(): void {
    const candidateId = this.item?.candidate?.id;
    if (!candidateId) return;

    this.candidatesService.selectById(candidateId).subscribe({
      next: (fullCandidate) => {
        if (this.item) {
          this.item = { ...this.item, candidate: fullCandidate };
        }
      },
      error: () => {
        // Silently fail — partial candidate data is still available
      },
    });
  }

  private loadIterviews(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.interviewService
      .selectMany({ applicationId: this.item.id })
      .subscribe({
        next: (response) => {
          wait();

          this.interviews = response.data;

          this.isLoading = false;
          this.hasError = false;
          this.errorMessage = "";
        },
        error: (error) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            error?.error.message ??
            this.transloco.translate("general.genericError");
        },
      });
  }

  private loadHistory(applicationId: string): void {
    this.isLoadingHistory = true;
    this.service.getHistory(applicationId).subscribe({
      next: (history) => {
        this.history = history || [];
        this.isLoadingHistory = false;
      },
      error: () => {
        this.isLoadingHistory = false;
      },
    });
  }

  handleEdit(application: Application): void {
    if (application?.id) {
      this.router.navigate(["../edit", application.id], {
        relativeTo: this.route,
      });
    }
  }

  handleDelete(application: Application): void {
    // Implement delete logic here, possibly using a confirmation dialog
    console.log("Delete application:", application?.id);
    // TODO: Implement actual delete functionality
  }

  handleUpdateStatus(event: {
    ModuleObject: Application;
    status: ApplicationStatusEnum;
  }): void {
    this.statusUpdateError = "";

    this.service
      .update(event.ModuleObject.id, {
        id: event.ModuleObject.id,
        status: event.status,
      })
      .subscribe({
      next: (response) => {
        this.item = { ...this.item, ...response };
        this.loadHistory(this.item.id);
      },
      error: (error) => {
        this.statusUpdateError =
          error?.status === 403
            ? this.transloco.translate("applications.errors.statusUpdateForbidden")
            : error?.error?.message ||
              this.transloco.translate("applications.errors.statusUpdateFailed");
      },
    });
  }

  handleViewItem(application: Application): void {
    // Already on the details page, so this might not be needed
    console.log("View application:", application?.id);
  }

  handleDownloadResume(resumeUrl: string): void {
    if (!resumeUrl || this.isDownloadingResume) {
      return;
    }

    this.isDownloadingResume = true;

    const fullUrl = this.getFullUrl(resumeUrl);

    this.http.get(fullUrl, { responseType: "blob" }).subscribe({
      next: (blob: Blob) => {
        this.isDownloadingResume = false;

        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = this.getFilenameFromUrl(resumeUrl) || "CV.pdf";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        window.URL.revokeObjectURL(blobUrl);
      },
      error: (error: any) => {
        this.isDownloadingResume = false;
        console.error("Error downloading resume:", error);

        window.open(fullUrl, "_blank");
      },
    });
  }

  protected getFullUrl(url?: string): string {
    if (!url) return "";
    const trimmed = url.trim();
    const isAbsolute = /^https?:\/\//i.test(trimmed);
    if (isAbsolute) return trimmed;

    let clean = trimmed
      .replace(/^undefined\/?/, "")
      .replace(/\/undefined\/?/g, "/");

    const rawBase = environment.apiUrl;
    const base =
      rawBase && rawBase !== "undefined" ? rawBase.replace(/\/$/, "") : "";

    const path = clean.startsWith("/") ? clean : `/${clean}`;

    return base ? `${base}${path}` : path;
  }

  private getFilenameFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.substring(pathname.lastIndexOf("/") + 1);
      return filename || null;
    } catch (error) {
      return null;
    }
  }

  handleScheduleInterview(event: {
    application: Application;
    interviewData: any;
  }): void {
    console.log("Schedule interview for application:", event.application.id);
    console.log("Interview data:", event.interviewData);

    // TODO: Implement actual interview scheduling functionality
    // This would typically involve:
    // 1. Saving the interview details to the backend
    // 2. Sending an email to the candidate with the meeting link
    // 3. Possibly creating a calendar event

    // For now, we'll just show a success message
    alert(
      `Entretien programmé avec succès pour ${event.application.candidate?.firstName} ${event.application.candidate?.lastName}!\n\nLien Google Meet: ${event.interviewData.meetLink}`
    );
  }

  handleBack(): void {
    this.location.back();
  }

  handleInterviewCreated(): void {
    // Re-check constraints after a new interview is scheduled
    this.interviewService
      .selectMany({ applicationId: this.item?.id })
      .subscribe({
        next: (response) => {
          this.interviews = response.data;
          this.checkInterviewConstraints();
        },
        error: () => {},
      });
  }

  private loadSubscription(): void {
    this.billingsService.getCurrentPlan().subscribe({
      next: (plan) => {
        this.subscription = plan;
        this.checkInterviewConstraints();
      },
      error: () => {
        // Billing check failed — allow scheduling anyway (fail open)
        this.canScheduleInterview = true;
        this.scheduleInterviewBlockedReason = null;
      },
    });
  }

  private checkInterviewConstraints(): void {
    this.canScheduleInterview = true;
    this.scheduleInterviewBlockedReason = null;

    if (!this.subscription || this.subscription.status !== "ACTIVE") {
      // No active plan — still allow scheduling (fail open)
      return;
    }

    const perApplicationMax = 2;
    const applicationInterviewsCount = this.interviews?.length || 0;
    if (applicationInterviewsCount >= perApplicationMax) {
      this.canScheduleInterview = false;
      this.scheduleInterviewBlockedReason = this.transloco.translate(
        "interviews.perApplicationLimitReached",
        { current: applicationInterviewsCount, max: perApplicationMax }
      );
    }
  }
}
