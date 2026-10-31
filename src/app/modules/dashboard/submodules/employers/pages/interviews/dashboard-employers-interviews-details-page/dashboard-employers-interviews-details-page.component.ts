import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  InterviewStatus,
  InterviewType,
  Interview as ModuleObject,
  UpdateInterviewDto,
} from "@modules/interview/interview.types";
import { TranslocoService } from "@ngneat/transloco";
import { getFullPhotoUrl, wait, formatSalaryAmount, blockInvalidNumberKeys } from "../../../../../../../@1hand/utils";
import { InterviewsService as Service } from "@modules/interview/interviews.service";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-interviews-details-page",
  templateUrl: "./dashboard-employers-interviews-details-page.component.html",
  styleUrls: ["./dashboard-employers-interviews-details-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardEmployersInterviewsDetailsPageComponent {
  formatSalaryAmount = formatSalaryAmount;
  blockInvalidNumberKeys = blockInvalidNumberKeys;

  item!: ModuleObject;
  isLoading = false;
  hasError = false;
  errorMessage = "";
  photoUrl!: string;

  InterviewStatus = InterviewStatus;
  InterviewType = InterviewType;
  isCanceling = false;
  cancelError = "";
  history: any[] = [];
  isLoadingHistory = false;

  isEditing = false;
  isSaving = false;
  editError = "";
  editForm: {
    scheduledAt: string;
    durationMin: number;
    type: InterviewType;
    meetUrl: string;
    location: string;
    timezone: string;
    notes: string;
  } = {
    scheduledAt: "",
    durationMin: 30,
    type: InterviewType.DAILY_VIDEO_CALL,
    meetUrl: "",
    location: "",
    timezone: "",
    notes: "",
  };
  isMarkingCompleted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadItem();
    this.photoUrl = getFullPhotoUrl(this.item.candidate.photo);
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

  copyMeet() {
    if (this.item.meetUrl) {
      navigator.clipboard.writeText(this.item.meetUrl);
    }
  }
  handleBack() {
    // Relative, not an absolute path: the details route sits as a sibling
    // of "list" under whatever dynamic prefix this page is mounted at, and
    // the old hardcoded absolute path was missing "/list" entirely, which
    // matched no route and fell through to the dashboard root instead.
    this.router.navigate(["../list"], { relativeTo: this.route });
  }

  private toDatetimeLocal(isoDate: string): string {
    const d = new Date(isoDate);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  startEdit(): void {
    this.editError = "";
    this.editForm = {
      scheduledAt: this.toDatetimeLocal(this.item.scheduledAt),
      durationMin: this.item.durationMin,
      type: this.item.type,
      meetUrl: this.item.meetUrl || "",
      location: this.item.location || "",
      timezone: this.item.timezone || "",
      notes: this.item.notes || "",
    };
    this.isEditing = true;
  }

  cancelEditForm(): void {
    this.isEditing = false;
    this.editError = "";
  }

  /** Builds the update payload for the current type, matching the same
   * per-type field rules the backend enforces when creating an interview:
   * location only for IN_PERSON, meetUrl required otherwise. */
  saveEdit(): void {
    if (this.isSaving || !this.item?.id) return;

    const isInPerson = this.editForm.type === InterviewType.IN_PERSON;

    const payload: UpdateInterviewDto = {
      scheduledAt: new Date(this.editForm.scheduledAt).toISOString(),
      durationMin: this.editForm.durationMin,
      type: this.editForm.type,
      timezone: this.editForm.timezone || undefined,
      notes: this.editForm.notes || undefined,
      status: InterviewStatus.RESCHEDULED,
    };

    if (isInPerson) {
      payload.location = this.editForm.location;
    } else {
      payload.meetUrl = this.editForm.meetUrl;
    }

    this.isSaving = true;
    this.editError = "";

    this.service.update(this.item.id, payload).subscribe({
      next: (updated) => {
        this.isSaving = false;
        this.isEditing = false;
        this.item = updated;
        this.loadHistory(this.item.id!);
      },
      error: (error) => {
        this.isSaving = false;
        if (error?.status === 409) {
          this.editError = this.transloco.translate("interviews.cancel.conflict");
          this.loadItem();
        } else {
          this.editError =
            error?.error?.message ||
            this.transloco.translate("interviews.edit.error");
        }
      },
    });
  }

  markCompleted(): void {
    if (this.isMarkingCompleted || !this.item?.id) return;
    if (!confirm(this.transloco.translate("interviews.markCompleted.confirmMessage"))) return;

    this.isMarkingCompleted = true;
    this.service.update(this.item.id, { status: InterviewStatus.COMPLETED }).subscribe({
      next: (updated) => {
        this.isMarkingCompleted = false;
        this.item = updated;
        this.loadHistory(this.item.id!);
      },
      error: (error) => {
        this.isMarkingCompleted = false;
        if (error?.status === 409) {
          this.cancelError = this.transloco.translate("interviews.cancel.conflict");
          this.loadItem();
        } else {
          this.cancelError =
            error?.error?.message ||
            this.transloco.translate("interviews.markCompleted.error");
        }
      },
    });
  }

  onCancelClick(): void {
    if (confirm(this.transloco.translate("interviews.cancel.confirmMessage"))) {
      this.cancelInterview();
    }
  }

  /** 409 means someone else (another recruiter, or the candidate's own
   * response) changed this interview in the meantime — reload it instead
   * of silently failing, so the recruiter retries against current data. */
  cancelInterview(): void {
    if (this.isCanceling || !this.item?.id) return;

    this.isCanceling = true;
    this.cancelError = "";

    this.service.cancel(this.item.id).subscribe({
      next: (updated) => {
        this.isCanceling = false;
        this.item = updated;
        this.loadHistory(this.item.id!);
      },
      error: (error) => {
        this.isCanceling = false;
        if (error?.status === 409) {
          this.cancelError = this.transloco.translate("interviews.cancel.conflict");
          this.loadItem();
        } else {
          this.cancelError =
            error?.error?.message ||
            this.transloco.translate("interviews.cancel.error");
        }
      },
    });
  }
}
