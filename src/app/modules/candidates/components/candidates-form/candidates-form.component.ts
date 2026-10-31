import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Validators } from "@angular/forms";
import { FieldConfig } from "../../../../@1hand/components/generic-form/generic-form.component";
import { Candidate } from "../../candidates.types";

@Component({
  standalone: false,

  selector: "app-candidates-form",
  template: `
    <app-generic-form
      [fieldConfigurations]="fieldConfigurations"
      [defaultValues]="defaultValues"
      [errorMessage]="errorMessage"
      [isLoading]="isLoading"
      [showActionButton]="showActionButton"
      (submitForm)="handleSubmit($event)"
    ></app-generic-form>
  `,
  styleUrls: ["./candidates-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesFormComponent {
  @Input() isLoading = false;
  @Input() defaultValues?: Candidate = {} as Candidate;
  @Input() errorMessage?: string;
  @Input() showActionButton = true;

  @Output() submitForm = new EventEmitter<Candidate>();

  fieldConfigurations: FieldConfig[] = [];

  ngOnInit(): void {
    this.fieldConfigurations = [
      // Informations personnelles
      {
        name: "firstName",
        label: "form.firstName",
        placeholder: "form.firstName",
        type: "string",
        required: true,
        fieldset: "form.sections.personalInfo",
        size: { xs: 12, md: 6 },
        validation: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
        errorMessages: {
          required: "form.errors.fields.firstName.required",
          minlength: "form.errors.fields.firstName.minlength",
          maxlength: "form.errors.fields.firstName.maxlength",
        },
      },
      {
        name: "lastName",
        label: "form.lastName",
        placeholder: "form.lastName",
        type: "string",
        required: true,
        fieldset: "form.sections.personalInfo",
        size: { xs: 12, md: 6 },
        validation: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
        errorMessages: {
          required: "form.errors.fields.lastName.required",
          minlength: "form.errors.fields.lastName.minlength",
          maxlength: "form.errors.fields.lastName.maxlength",
        },
      },
      {
        name: "email",
        label: "form.email",
        placeholder: "form.email",
        type: "string",
        required: true,
        fieldset: "form.sections.personalInfo",
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.email],
        errorMessages: {
          required: "form.errors.fields.email.required",
          email: "form.errors.fields.email.invalid",
        },
      },
      {
        name: "phoneNumber",
        label: "form.phoneNumber",
        placeholder: "form.phoneNumber",
        type: "string",
        fieldset: "form.sections.personalInfo",
        size: { xs: 12, md: 6 },
        validation: [Validators.minLength(10), Validators.maxLength(20)],
        errorMessages: {
          minlength: "form.errors.fields.phoneNumber.minlength",
          maxlength: "form.errors.fields.phoneNumber.maxlength",
        },
      },
      {
        name: "gender",
        label: "form.gender",
        placeholder: "form.gender",
        type: "select",
        multiple: false,
        fieldset: "form.sections.personalInfo",
        size: { xs: 12, md: 4 },
        options: [
          { value: "MALE", label: "enums.gender.MALE" },
          { value: "FEMALE", label: "enums.gender.FEMALE" },
          { value: "OTHER", label: "enums.gender.OTHER" },
        ],
      },
      {
        name: "city",
        label: "form.city",
        placeholder: "form.city",
        type: "string",
        fieldset: "form.sections.personalInfo",
        size: { xs: 12, md: 4 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.city.maxlength",
        },
      },
      {
        name: "region",
        label: "form.region",
        placeholder: "form.region",
        type: "string",
        fieldset: "form.sections.personalInfo",
        size: { xs: 12, md: 4 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.region.maxlength",
        },
      },

      // Informations professionnelles
      {
        name: "profession",
        label: "form.profession",
        placeholder: "form.profession",
        type: "string",
        fieldset: "form.sections.professionalInfo",
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(255)],
        errorMessages: {
          maxlength: "form.errors.fields.profession.maxlength",
        },
      },
      {
        name: "bio",
        label: "form.bio",
        placeholder: "form.bio",
        type: "string",
        multiline: true,
        rows: 4,
        fieldset: "form.sections.professionalInfo",
        size: { xs: 12 },
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          maxlength: "form.errors.fields.bio.maxlength",
        },
      },
      {
        name: "nationality",
        label: "form.nationality",
        placeholder: "form.nationality",
        type: "string",
        fieldset: "form.sections.professionalInfo",
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.nationality.maxlength",
        },
      },
      {
        name: "placeOfBirth",
        label: "form.placeOfBirth",
        placeholder: "form.placeOfBirth",
        type: "string",
        fieldset: "form.sections.professionalInfo",
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(255)],
        errorMessages: {
          maxlength: "form.errors.fields.placeOfBirth.maxlength",
        },
      },
      {
        name: "resumeUrl",
        label: "form.resumeUrl",
        placeholder: "form.resumeUrl",
        type: "string",
        fieldset: "form.sections.professionalInfo",
        size: { xs: 12 },
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          maxlength: "form.errors.fields.resumeUrl.maxlength",
        },
      },
    ];
  }

  handleSubmit(data: Candidate) {
    this.submitForm.emit(data);
  }
}
