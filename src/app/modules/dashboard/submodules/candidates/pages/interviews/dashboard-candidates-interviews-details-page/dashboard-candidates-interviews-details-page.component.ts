import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  InterviewStatus,
  Interview as ModuleObject,
  CandidateInterviewResponse,
} from "@modules/interview/interview.types";
import { InterviewsService as Service } from "@modules/interview/interviews.service";
import { TranslocoService } from "@ngneat/transloco";
import { getFullPhotoUrl, wait } from "../../../../../../../@1hand/utils";
import { environment } from "@env/environment";

@Component({
  standalone: false,

  selector: "app-dashboard-candidates-interviews-details-page",
  templateUrl: "./dashboard-candidates-interviews-details-page.component.html",
  styleUrls: [
    "./dashboard-candidates-interviews-details-page.component.scss",
    "../../../../../../../../styles/legacy-styles.css",
  ],
})
export class DashboardCandidatesInterviewsDetailsPageComponent implements OnInit {
  item!: ModuleObject;
  isLoading = false;
  hasError = false;
  errorMessage = "";
  photoUrl!: string;

  CandidateInterviewResponse = CandidateInterviewResponse;
  InterviewStatus = InterviewStatus;
  isResponding = false;
  respondMessage = "";
  respondError = "";
  respondConflict = false;
  history: any[] = [];
  isLoadingHistory = false;

  get companyLogo() {
    return `${environment.apiUrl}${this.item.application.jobOffer.company.logoFile.url}`;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service,
    private transloco: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.loadItem();
    this.photoUrl = getFullPhotoUrl(this.item.candidate.photo);
    console.log("photo  coresp", this.item);
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const paramItemIdName = "interviewId";
      const itemId = params.get(paramItemIdName);

      if (!itemId) {
        throw new Error(`No query param id ${paramItemIdName}`);
      }

      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = "";

      this.service.selectById(itemId).subscribe({
        next: (response) => {
          wait();

          this.item = response;

          this.isLoading = false;
          this.hasError = false;
          this.errorMessage = "";
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

  private loadHistory(interviewId: string): void {
    this.isLoadingHistory = true;
    this.service.getHistory(interviewId).subscribe({
      next: (history) => {
        this.history = history || [];
        this.isLoadingHistory = false;
      },
      error: () => {
        this.isLoadingHistory = false;
      },
    });
  }

  badgeClass(status: InterviewStatus | undefined) {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        return "bg-blue-50 text-blue-500 ring-blue-100";
      case InterviewStatus.COMPLETED:
        return "bg-green-50 text-green-500 ring-green-100";
      case InterviewStatus.CANCELED:
        return "bg-red-50 text-red-500 ring-red-100";
      default:
        return "bg-gray-50 text-gray-500 ring-gray-100";
    }
  }

  formatDate(date: string, tz: string) {
    return new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: tz,
    }).format(new Date(date));
  }

  handleBack() {
    // Relative, not an absolute path: the details route sits as a sibling
    // of "list" under whatever dynamic prefix this page is mounted at, and
    // the old hardcoded absolute path was missing "/list" entirely, which
    // matched no route and fell through to the dashboard root instead.
    this.router.navigate(["../list"], { relativeTo: this.route });
  }
  copyMeet() {
    if (this.item.meetUrl) {
      navigator.clipboard.writeText(this.item.meetUrl);
    }
  }

  /** Candidate confirms or declines an interview invitation. scheduledAt
   * (and location, for in-person) must echo back exactly what's currently
   * displayed — if the recruiter changed either in the meantime, the
   * backend returns 409 and we reload so the candidate re-decides against
   * the up-to-date details instead of silently mismatching. */
  respondToInterview(
    response: CandidateInterviewResponse.CONFIRMED | CandidateInterviewResponse.DECLINED,
  ): void {
    if (this.isResponding || !this.item?.id) return;

    this.isResponding = true;
    this.respondError = "";
    this.respondConflict = false;

    this.service
      .respond({
        interviewId: this.item.id,
        response,
        scheduledAt: this.item.scheduledAt,
        location: this.item.location,
        message: this.respondMessage || undefined,
      })
      .subscribe({
        next: (updated) => {
          this.isResponding = false;
          this.item = updated;
          this.respondMessage = "";
          this.loadHistory(this.item.id!);
        },
        error: (error) => {
          this.isResponding = false;
          if (error?.status === 409) {
            this.respondConflict = true;
            this.respondError = this.transloco.translate(
              "interviews.respond.conflict",
            );
            // Reload the interview so the candidate sees the recruiter's
            // latest date/location before trying again.
            this.loadItem();
          } else {
            this.respondError =
              error?.error?.message ||
              this.transloco.translate("interviews.respond.error");
          }
        },
      });
  }
}
