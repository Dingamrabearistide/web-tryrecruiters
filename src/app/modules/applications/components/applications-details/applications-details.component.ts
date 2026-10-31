import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  ApplicationStatusEnum,
  Application as ModuleObject,
} from "@modules/applications/applications.types";
import { AuthService } from "@modules/auth/auth.service";
import { InterviewsService } from "@modules/interview/interviews.service";
import { Interview } from "@modules/interview/interview.types";
import { environment } from "@env/environment";
import { formatSalaryAmount } from "../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";

@Component({
  standalone: false,

  selector: "app-applications-details",
  templateUrl: "./applications-details.component.html",
  styleUrls: [
    "./applications-details.component.scss",
    "../../../../../styles/legacy-styles.css",
  ],
})
export class ApplicationsDetailsComponent implements OnChanges {
  @ViewChild("profileModalTemplate") profileModalTemplate!: TemplateRef<any>;

  formatSalaryAmount = formatSalaryAmount;

  @Input() item: ModuleObject | null = null;
  @Input() element!: TemplateRef<any>;
  @Input() canScheduleInterview: boolean = true;
  @Input() scheduleInterviewBlockedReason: string | null = null;

  @Output() edit = new EventEmitter<ModuleObject>();
  @Output() delete = new EventEmitter<ModuleObject>();
  @Output() updateStatus = new EventEmitter<{
    ModuleObject: ModuleObject;
    status: ApplicationStatusEnum;
  }>();
  @Output() viewItem = new EventEmitter<ModuleObject>();
  @Output() downloadResume = new EventEmitter<string>();
  @Output() scheduleInterview = new EventEmitter<{
    application: ModuleObject;
    interviewData: any;
  }>();
  @Output() interviewCreated = new EventEmitter<void>();

  ModuleObjectStatusEnum = ApplicationStatusEnum;
  showInterviewForm = false;
  isSchedulingInterview = false;
  interviews: Interview[] = [];

  get recruiterId() {
    const user = this.authService.getUser();
    return user && this.authService.isRecruiter() ? user.id : null;
  }

  get isCandidate() {
    return this.authService.isCandidate();
  }

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private interviewsService: InterviewsService,
    private router: Router,
    // view container used when opening TemplateRef-based dialogs so the
    // embedded view can be properly created in the correct context
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes["item"] && this.item && this.item.id) {
      this.loadInterviews();
      console.log(this.item);
    }
  }

  loadInterviews(): void {
    if (!this.item?.id) return;
    this.interviewsService
      .selectMany({ applicationId: this.item.id, limit: 50 })
      .subscribe({
        next: (res) => {
          this.interviews = res.data || [];
          this.interviewCreated.emit();
        },
        error: (err) => {
          console.error("Cannot load interviews for application", err);
          this.interviews = [];
        },
      });
  }

  onSeeMoreProfile(): void {
    if (!this.item || !this.profileModalTemplate) return;

    const modalData: GenericModalData = {
      title: ``,
      template: this.profileModalTemplate,
      actions: [{ id: "ok", label: "Ok", value: "ok", color: "primary" }],
    };

    const ref = this.dialog.open(GenericModalComponent, {
      width: "90vw",
      maxWidth: "1000px",
      maxHeight: "90vh",
      panelClass: "profile-modal-panel",
      data: modalData,
    });

    ref.afterOpened().subscribe(() => {
      setTimeout(() => {
        const dialogContainer = document.querySelector(
          ".profile-modal-panel .mat-mdc-dialog-content, .profile-modal-panel .mat-dialog-content",
        );
        if (dialogContainer) {
          dialogContainer.scrollTop = 0;
        }
      }, 100);
    });

    const sub = ref.componentInstance.action.subscribe(() => {
      ref.close();
      sub.unsubscribe();
    });
  }

  getCandidatePhotoUrl(): string {
    const photo = this.item?.candidate?.photo;
    return this.getFullPhotoUrl(photo);
  }

  onEdit(): void {
    if (this.item) {
      this.edit.emit(this.item);
    }
  }

  onDelete(): void {
    if (this.item) {
      this.delete.emit(this.item);
    }
  }

  onUpdateStatus(status: ApplicationStatusEnum): void {
    if (this.item) {
      this.updateStatus.emit({
        ModuleObject: this.item,
        status: status,
      });
    }
  }

  onViewItem(): void {
    if (this.item?.id) {
      this.viewItem.emit(this.item);
    }
  }

  onAcceptApplication(): void {
    this.onUpdateStatus(ApplicationStatusEnum.ACCEPTED);
  }

  onRejectApplication(): void {
    this.onUpdateStatus(ApplicationStatusEnum.REJECTED);
  }

  onMarkReviewed(): void {
    this.onUpdateStatus(ApplicationStatusEnum.REVIEWED);
  }

  onWithdrawApplication(): void {
    this.onUpdateStatus(ApplicationStatusEnum.CANCELED);
  }

  /** Recruiter/admin can move a pending or reviewed application forward;
   * once it's in a terminal state (accepted/rejected/canceled) the backend
   * no longer allows further transitions. */
  get canRecruiterActOnApplication(): boolean {
    return (
      this.item?.status === ApplicationStatusEnum.PENDING ||
      this.item?.status === ApplicationStatusEnum.REVIEWED
    );
  }

  /** Candidate can only withdraw (CANCELED), and only before the
   * application has reached a terminal state. */
  get canCandidateWithdraw(): boolean {
    return (
      this.item?.status === ApplicationStatusEnum.PENDING ||
      this.item?.status === ApplicationStatusEnum.REVIEWED
    );
  }

  onScheduleInterview(): void {
    this.showInterviewForm = true;
  }

  onInterviewSubmit(interviewData: any): void {
    if (!this.item) return;

    this.isSchedulingInterview = true;

    this.scheduleInterview.emit({
      application: this.item,
      interviewData: interviewData,
    });

    setTimeout(() => {
      this.isSchedulingInterview = false;
      this.showInterviewForm = false;
      this.loadInterviews();
    }, 1000);
  }

  onCancelInterviewForm(): void {
    this.showInterviewForm = false;
  }

  protected getFullPhotoUrl(photo?: string): string {
    if (!photo) return "";
    const trimmed = photo.trim();
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

  getResumeUrl(): string {
    const resume = this.item?.resume;
    if (!resume?.resumeFile?.url) {
      return "";
    }
    return this.getFullPhotoUrl(resume.resumeFile.url);
  }

  hasResume(): boolean {
    return !!this.item?.resume?.resumeFile?.url;
  }

  hasInterviews(): boolean {
    return this.interviews && this.interviews.length > 0;
  }

  onDownloadResume(): void {
    const resumeUrl = this.getResumeUrl();
    if (!resumeUrl) {
      return;
    }

    window.open(resumeUrl, "_blank");

    // fetch(resumeUrl)
    //   .then((response) => response.blob())
    //   .then((blob) => {
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement("a");
    //     a.href = url;
    //     a.download =
    //       this.item?.candidate?.resumes?.[0]?.resumeFile?.originalName ||
    //       this.item?.candidate?.resumes?.[0]?.name ||
    //       "cv.pdf";
    //     document.body.appendChild(a);

    //     a.click();
    //     document.body.removeChild(a);
    //     window.URL.revokeObjectURL(url);
    //   })
    //   .catch((error) => {
    //     console.error("Erreur lors du téléchargement du CV:", error);
    //   });
  }

  // onInterviewSubmit(interviewData: any): void {
  //   if (!this.item) return;

  //   this.isSchedulingInterview = true;

  //   // Émettre l'événement avec les données de l'interview
  //   this.scheduleInterview.emit({
  //     application: this.item,
  //     interviewData: interviewData,
  //   });

  //   // Simuler un délai pour l'envoi
  //   setTimeout(() => {
  //     this.isSchedulingInterview = false;
  //     this.showInterviewForm = false;
  //   }, 1000);
  // }

  // onCancelInterviewForm(): void {
  //   this.showInterviewForm = false;
  // }
}
