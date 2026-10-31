import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "app-danger-zone",
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div
      *transloco="let t"
      class="bg-white rounded-lg  border border-red-200 p-6"
    >
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-red-900 mb-2">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          {{ t("settings.danger.title") }}
        </h2>
        <p class="text-red-600">
          {{ t("settings.danger.description") }}
        </p>
      </div>

      <div class="space-y-4">
        <!-- Close Account Section -->
        <div class="border border-red-200 rounded-lg p-4 bg-red-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h3 class="text-base font-medium text-red-900 mb-1">
                {{ t("settings.closeAccount.title") }}
              </h3>
              <p class="text-sm text-red-700 mb-4">
                {{ t("settings.closeAccount.description") }}
              </p>

              <div class="bg-red-100 border border-red-200 rounded-md p-3 mb-4">
                <div class="flex">
                  <i
                    class="fas fa-exclamation-triangle text-red-500 mt-0.5 mr-2"
                  ></i>
                  <div class="text-sm text-red-700">
                    <p class="font-medium mb-1">
                      {{ t("settings.closeAccount.warning.title") }}
                    </p>
                    <ul class="list-disc list-inside space-y-1">
                      <li>{{ t("settings.closeAccount.warning.point1") }}</li>
                      <li>{{ t("settings.closeAccount.warning.point2") }}</li>
                      <li>{{ t("settings.closeAccount.warning.point3") }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button
              (click)="onCloseAccount()"
              [disabled]="isClosingAccount"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <i
                *ngIf="isClosingAccount"
                class="fas fa-spinner fa-spin mr-2"
              ></i>
              <i *ngIf="!isClosingAccount" class="fas fa-trash mr-2"></i>
              {{ t("settings.closeAccount.button") }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DangerZoneComponent {
  @Input() isClosingAccount = false;
  @Output() closeAccount = new EventEmitter<void>();

  onCloseAccount() {
    this.closeAccount.emit();
  }
}
