import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";
import { NotificationChannel } from "@modules/auth/auth.types";
import {
  GenericFormComponent,
  FieldConfig,
} from "../../../../@1hand/components/generic-form/generic-form.component";

interface TwoFactorSettings {
  enabled: boolean;
  method: NotificationChannel;
}

@Component({
  selector: "app-two-factor-settings",
  standalone: true,
  imports: [CommonModule, TranslocoModule, GenericFormComponent],
  template: `
    <div
      *transloco="let t"
      class="bg-white rounded-lg  border border-gray-200 p-6"
    >
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-2">
          {{ t("settings.twoFactor.title") }}
        </h2>
        <p class="text-gray-600">
          {{ t("settings.twoFactor.description") }}
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
export class TwoFactorSettingsComponent implements OnInit {
  @Input() isLoading = false;
  @Input() settings: TwoFactorSettings = {
    enabled: false,
    method: NotificationChannel.EMAIL,
  };
  @Output() twoFactorUpdate = new EventEmitter<TwoFactorSettings>();

  fieldConfigs: FieldConfig[] = [];
  defaultValues: any = {};

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.fieldConfigs = [
      {
        name: "enabled",
        label: "twoFactor.enabled",
        type: "checkbox",
        size: { md: 12 },
      },
      // {
      //   name: "method",
      //   label: "twoFactor.method",
      //   type: "select",
      //   options: [
      //     {
      //       value: NotificationChannel.EMAIL,
      //       label: "twoFactor.methodOptions.email",
      //     },
      //     {
      //       value: NotificationChannel.SMS,
      //       label: "twoFactor.methodOptions.sms",
      //     },
      //     {
      //       value: NotificationChannel.WHATSAPP,
      //       label: "twoFactor.methodOptions.whatsapp",
      //     },
      //   ],
      //   size: { md: 12 },
      // },
    ];

    this.defaultValues = {
      enabled: this.settings.enabled,
      method: this.settings.method,
    };
  }

  onSubmit(formData: TwoFactorSettings) {
    this.twoFactorUpdate.emit(formData);
  }
}
