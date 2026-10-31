import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { Validators } from "@angular/forms";
import { FieldConfig } from "../../../../@1hand/components/generic-form/generic-form.component";
import {
  Application,
  ApplicationFormData,
  ApplicationStatusEnum,
} from "../../applications.types";

@Component({
  standalone: false,

  selector: "app-applications-form",
  templateUrl: "./applications-form.component.html",
  styleUrls: ["./applications-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ApplicationsFormComponent implements OnInit {
  @Input() isLoading = false;
  @Input() defaultValues?: ApplicationFormData = {} as ApplicationFormData;
  @Input() jobOffers?: any[] = [];
  @Input() candidates?: any[] = [];
  @Input() resumes?: any[] = [];

  @Output() onSubmit: EventEmitter<ApplicationFormData> = new EventEmitter();

  genericFormConfig: FieldConfig[] = [];

  ngOnInit(): void {
    this.genericFormConfig = [
      {
        name: "jobOfferId",
        label: "form.jobOffer",
        placeholder: "form.selectJobOffer",
        type: "select",
        required: true,
        size: { xs: 12, md: 6 },
        options:
          this.jobOffers?.map((job) => ({
            value: job.id,
            label: job.title,
          })) || [],
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.jobOfferId.required",
        },
      },
      {
        name: "candidateId",
        label: "form.candidate",
        placeholder: "form.selectCandidate",
        type: "select",
        required: true,
        size: { xs: 12, md: 6 },
        options:
          this.candidates?.map((candidate) => ({
            value: candidate.id,
            label: `${candidate.firstName} ${candidate.lastName}`,
          })) || [],
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.candidateId.required",
        },
      },
      {
        name: "resumeId",
        label: "form.resume",
        placeholder: "form.selectResume",
        type: "select",
        required: false,
        size: { xs: 12, md: 6 },
        options:
          this.resumes?.map((resume) => ({
            value: resume.id,
            label: resume.fileName,
          })) || [],
        validation: [],
        errorMessages: {},
      },
      {
        name: "status",
        label: "form.status",
        placeholder: "form.selectStatus",
        type: "select",
        required: false,
        size: { xs: 12, md: 6 },
        options: Object.values(ApplicationStatusEnum).map((status) => ({
          value: status,
          label: `status.${status}`,
        })),
        validation: [],
        errorMessages: {},
      },
      {
        name: "message",
        label: "form.message",
        placeholder: "form.messagePlaceholder",
        type: "string",
        multiline: true,
        rows: 5,
        required: false,
        size: { xs: 12 },
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          maxlength: "form.errors.fields.message.maxlength",
        },
      },
    ];
  }

  handleSubmit(data: ApplicationFormData) {
    this.onSubmit.emit(data);
  }
}
