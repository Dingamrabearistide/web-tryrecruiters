import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Validators } from "@angular/forms";
import { TranslocoModule } from "@ngneat/transloco";
import {
  GenericFormComponent,
  FieldConfig,
} from "../../../../@1hand/components/generic-form/generic-form.component";

interface PasswordChangeDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

@Component({
  selector: "app-password-settings",
  standalone: true,
  imports: [CommonModule, TranslocoModule, GenericFormComponent],
  template: `
    <div
      *transloco="let t"
      class="bg-white rounded-lg  border border-gray-200 p-6"
    >
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          {{ t("settings.password.title") }}
        </h2>
        <p class="text-gray-600">
          {{ t("settings.password.description") }}
        </p>
      </div>

      <app-generic-form
        [fieldConfigurations]="fieldConfigs"
        [defaultValues]="defaultValues"
        [isLoading]="isLoading"
        [transationNamespace]="'settings'"
        (submitForm)="onSubmit($event)"
      ></app-generic-form>
    </div>
  `,
})
export class PasswordSettingsComponent implements OnInit {
  @Input() isLoading = false;
  @Output() passwordChange = new EventEmitter<PasswordChangeDto>();

  fieldConfigs: FieldConfig[] = [];
  defaultValues: any = {};

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.fieldConfigs = [
      {
        name: "currentPassword",
        label: "password.currentPassword",
        type: "password",
        required: true,
        size: { md: 12 },
      },
      {
        name: "newPassword",
        label: "password.newPassword",
        type: "password",
        required: true,
        // Backend requires a minimum of 6 characters only (400 otherwise) —
        // keep this in sync, no extra complexity rules the API doesn't enforce.
        validation: [Validators.minLength(6)],
        size: { md: 6 },
      },
      {
        name: "confirmPassword",
        label: "password.confirmPassword",
        type: "password",
        required: true,
        validation: [Validators.minLength(6)],
        size: { md: 6 },
      },
    ];

    this.defaultValues = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  }

  onSubmit(formData: PasswordChangeDto) {
    this.passwordChange.emit(formData);
  }
}
