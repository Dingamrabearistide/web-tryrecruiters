import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";
import {
  GenericFormComponent,
  FieldConfig,
} from "../../../../@1hand/components/generic-form/generic-form.component";

interface AccountSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

@Component({
  selector: "app-account-settings",
  standalone: true,
  imports: [CommonModule, TranslocoModule, GenericFormComponent],
  template: `
    <div
      *transloco="let t"
      class="bg-white rounded-lg  border border-gray-200 p-6"
    >
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          {{ t("settings.account.title") }}
        </h2>
        <p class="text-gray-600">
          {{ t("settings.account.description") }}
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
export class AccountSettingsComponent implements OnInit {
  @Input() isLoading = false;
  @Input() settings: AccountSettings = {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
  };
  @Output() accountSettingsUpdate = new EventEmitter<AccountSettings>();

  fieldConfigs: FieldConfig[] = [];
  defaultValues: any = {};

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.fieldConfigs = [
      {
        name: "emailNotifications",
        label: "account.emailNotifications",
        type: "checkbox",
        size: { md: 12 },
      },
      {
        name: "smsNotifications",
        label: "account.smsNotifications",
        type: "checkbox",
        size: { md: 12 },
      },
      {
        name: "marketingEmails",
        label: "account.marketingEmails",
        type: "checkbox",
        size: { md: 12 },
      },
    ];

    this.defaultValues = {
      emailNotifications: this.settings.emailNotifications,
      smsNotifications: this.settings.smsNotifications,
      marketingEmails: this.settings.marketingEmails,
    };
  }

  onSubmit(formData: AccountSettings) {
    this.accountSettingsUpdate.emit(formData);
  }
}
