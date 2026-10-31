import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { BreakpointObserver } from "@angular/cdk/layout";
import { goToTop, wait } from "../../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../@1hand/components/generic-modal/generic-modal.component";
import { CandidatesService } from "../../../../candidates/candidates.service";
import { Candidate as ModuleObject } from "../../../../candidates/candidates.types";
import { InterviewsService } from "../../../../interview/interviews.service";
import {
  CreateInterviewDto,
  InterviewType,
} from "../../../../interview/interview.types";
import { AuthService } from "@modules/auth/auth.service";
import { environment } from "@env/environment";

@Component({
  standalone: false,

  selector: "app-candidates-details-page",
  templateUrl: "./candidates-details-page.component.html",
  styleUrls: ["./candidates-details-page.component.scss", "../../../../../../styles/legacy-styles.css"],
})
export class CandidatesDetailsPageComponent implements OnInit {
  @ViewChild("callFormTemplate") callFormTemplate!: TemplateRef<any>;

  // State variables
  isLoading = false;
  hasError = false;
  errorMessage = "";

  // Data
  candidate!: ModuleObject;
  showMoreStates: { [key: string]: boolean } = {};
  scheduleCallForm!: FormGroup;
  isSchedulingCall = false;

  // Tab and responsive state
  activeTab = 'overview';
  isDesktop = false;
  sidebarImageError = false;
  tabs = [
    { id: 'overview', icon: 'fa-solid fa-circle-info', label: 'overview' },
    { id: 'experience', icon: 'fa-solid fa-briefcase', label: 'experience' },
    { id: 'skills', icon: 'fa-solid fa-code', label: 'skills' },
    { id: 'portfolio', icon: 'fa-solid fa-folder-open', label: 'portfolio' },
  ];

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private transloco: TranslocoService,
    private candidatesService: CandidatesService,
    private interviewsService: InterviewsService,
    private authService: AuthService,
    private location: Location,
    private breakpointObserver: BreakpointObserver,
  ) {
    this.scheduleCallForm = this.fb.group({
      scheduledAt: ["", Validators.required],
      durationMin: ["30", [Validators.required, Validators.min(15)]],
      notes: [""],
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (id) {
        this.loadCandidate(id);
      } else {
        console.error("Aucun ID fourni dans les paramètres de la route.");
      }
    });

    this.breakpointObserver.observe('(min-width: 1024px)').subscribe(result => {
      this.isDesktop = result.matches;
    });
  }

  goBack(): void {
    this.location.back();
  }

  loadCandidate(id: string): void {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.candidatesService.selectById(id).subscribe({
      next: async (res) => {
        await wait();
        console.log("response: ", res);
        this.candidate = {
          ...res,
        };
        this.sidebarImageError = false;

        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Erreur", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  toggleDetails(key: string): void {
    this.showMoreStates[key] = !this.showMoreStates[key];
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/images/no-avatar.svg';
  }

  getCandidateInitials(): string {
    const first = this.candidate?.firstName?.charAt(0) ?? '';
    const last = this.candidate?.lastName?.charAt(0) ?? '';
    return (first + last).toUpperCase();
  }

  /** Total years of experience computed from the duration of each entry —
   * matches the calculation used on the candidates list page. Using
   * `experiences.length` (the number of past roles) instead would show a
   * different, incorrect number here than what the list already displays
   * for the same candidate. */
  getExperienceYears(): number {
    if (!this.candidate?.experiences || !this.candidate.experiences.length) {
      return 0;
    }
    let totalMonths = 0;
    for (const exp of this.candidate.experiences) {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : new Date();
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }
    }
    return Math.round(totalMonths / 12);
  }

  getSkillLevelLabel(level?: string): string {
    switch (level) {
      case 'EXPERT': return this.transloco.translate('candidateDetails.expert');
      case 'ADVANCED': return this.transloco.translate('candidateDetails.advanced');
      case 'INTERMEDIATE': return this.transloco.translate('candidateDetails.intermediate');
      case 'BEGINNER': return this.transloco.translate('candidateDetails.beginner');
      default: return '';
    }
  }

  getSkillLevelPercent(level?: string): number {
    switch (level) {
      case 'EXPERT': return 95;
      case 'ADVANCED': return 80;
      case 'INTERMEDIATE': return 60;
      case 'BEGINNER': return 40;
      default: return 50;
    }
  }

  getLanguageLevelLabel(level: string): string {
    switch (level) {
      case 'NATIVE': return this.transloco.translate('candidateDetails.native');
      case 'PROFESSIONAL': return this.transloco.translate('candidateDetails.professional');
      case 'INTERMEDIATE': return this.transloco.translate('candidateDetails.intermediate');
      case 'BEGINNER': return this.transloco.translate('candidateDetails.beginner');
      default: return level;
    }
  }

  openCallModal(): void {
    if (!this.candidate?.id) {
      return;
    }

    // Check if user is logged in
    const recruiter = this.authService.getUser();
    if (!recruiter?.id) {
      // This shouldn't happen due to the guard, but just in case
      this.router.navigate(["/auth/login"], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate(
        "candidates.candidateDetails.scheduleCall",
      ),
      content: this.transloco.translate(
        "candidates.candidateDetails.scheduleCall",
      ),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("candidates.candidateDetails.cancel"),
          value: "cancel",
          color: undefined,
        },
        {
          id: "confirm",
          label: this.transloco.translate(
            "candidates.candidateDetails.confirm",
          ),
          value: "confirm",
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "500px",
      data: modalData,
    });

    const sub = dialogRef.componentInstance.action.subscribe((result) => {
      if (result === "confirm") {
        this.showScheduleCallForm();
      }
      sub.unsubscribe();
    });
  }

  private showScheduleCallForm(): void {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "600px",
      data: {
        title: this.transloco.translate(
          "candidates.candidateDetails.scheduleCall",
        ),
        content: "Use the form below to schedule a video call",
      },
    });

    // For simplicity, we'll create the interview immediately with default settings
    this.scheduleCall();
  }

  private scheduleCall(): void {
    const recruiter = this.authService.getUser();

    if (!recruiter?.id || !this.candidate?.id) {
      this.errorMessage = "Missing required information to schedule a call";
      this.hasError = true;
      return;
    }

    this.isSchedulingCall = true;

    // Create interview with default settings - will use Daily.co video
    const interviewData: CreateInterviewDto = {
      applicationId: "", // No specific application, direct call
      recruiterId: recruiter.id,
      candidateId: this.candidate.id,
      scheduledAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      durationMin: 30,
      type: InterviewType.DAILY_VIDEO_CALL,
      meetUrl: "", // Will be generated by backend
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      notes: `Direct call with ${this.candidate.firstName} ${this.candidate.lastName}`,
    };

    this.interviewsService.create(interviewData).subscribe({
      next: async (interview) => {
        await wait();
        this.isSchedulingCall = false;

        // Show success message
        const successModal: GenericModalData = {
          title: this.transloco.translate("success"),
          content: `Call scheduled successfully with ${this.candidate.firstName} ${this.candidate.lastName}!`,
          actions: [
            {
              id: "ok",
              label: "OK",
              value: "ok",
              color: "primary",
            },
          ],
        };

        const resultDialog = this.dialog.open(GenericModalComponent, {
          width: "400px",
          data: successModal,
        });

        resultDialog.componentInstance.action.subscribe(() => {
          resultDialog.close();
        });
      },
      error: (error) => {
        this.isSchedulingCall = false;
        console.error("Error scheduling call:", error);

        this.errorMessage =
          error?.error?.message || "Failed to schedule call. Please try again.";
        this.hasError = true;

        // Show error message
        const errorModal: GenericModalData = {
          title: this.transloco.translate("error"),
          content: this.errorMessage,
          actions: [
            {
              label: "Close",
              value: "close",
              color: undefined,
            },
          ],
        };

        this.dialog.open(GenericModalComponent, {
          width: "400px",
          data: errorModal,
        });
      },
    });
  }
}
