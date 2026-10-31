import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import {
  InterviewFormData as ModuleFormData,
  InterviewType,
} from "@modules/interview/interview.types";
import { TranslocoService } from "@ngneat/transloco";
import { Application } from "@modules/applications/applications.types";

@Component({
  standalone: false,

  selector: "app-interview-form",
  templateUrl: "./interview-form.component.html",
})
export class InterviewFormComponent implements OnInit, AfterViewInit {
  @ViewChild("interviewForm") form!: NgForm;

  @Input() isLoading = false;
  @Input() defaultValues?: FormData = {} as FormData;
  @Input() item!: Application;

  @Output() onSubmit: EventEmitter<ModuleFormData> = new EventEmitter();
  @Output() formReady: EventEmitter<any> = new EventEmitter();
  @Output() validityChange: EventEmitter<boolean> = new EventEmitter();

  InterviewType = InterviewType;

  selectedInterviewType: InterviewType = InterviewType.GOOGLE_MEET;
  userTimezone: string = "UTC";
  defaultMessage: string = "";
  minScheduledAt: string = "";
  scheduledAtPastError = false;

  constructor(private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.minScheduledAt = this.computeMinScheduledAt();

    const firstName = this.item.candidate?.firstName || "";
    const lastName = this.item.candidate?.lastName || "";
    const jobTitle = this.item.jobOffer.title;
    const resumeName = this.item.resume?.name;

    this.defaultMessage = this.transloco.translate(
      "interviews.notification.interviewInvitation.body",
      {
        firstName,
        lastName,
        jobTitle,
        resumeName,
      },
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.form) {
        this.formReady.emit(this);
        this.validityChange.emit(this.isFormValid());
        const el = (this.form as any).form;
        if (el && el.valueChanges) {
          el.valueChanges.subscribe(() =>
            this.validityChange.emit(this.isFormValid()),
          );
        }
      }
    });
  }

  private isFormValid(): boolean {
    return !!this.form?.valid && !this.scheduledAtPastError;
  }

  onScheduledAtChange(value: string): void {
    this.scheduledAtPastError = !!value && value < this.minScheduledAt;
    this.validityChange.emit(this.isFormValid());
  }

  handleSubmit(formData: any): void {
    const cleanedData = { ...formData };

    if (cleanedData.durationMin) {
      cleanedData.durationMin = Number(cleanedData.durationMin);
    }

    this.onSubmit.emit(cleanedData as ModuleFormData);
  }

  submit() {
    if (this.form && this.isFormValid()) {
      this.handleSubmit(this.form.value);
    }
  }

  private computeMinScheduledAt(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }
}
