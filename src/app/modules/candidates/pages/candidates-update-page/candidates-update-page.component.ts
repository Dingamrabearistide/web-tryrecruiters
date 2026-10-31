import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import { BaseUpdatePageComponent } from "../../../../@1hand/pages/base-update-page/base-update-page.component";
import { CandidatesService } from "../../candidates.service";
import { Candidate, UpdateCandidateDto } from "../../candidates.types";

@Component({
  standalone: false,

  selector: "app-candidates-update-page",
  template: `
    <div
      *transloco="let t; read: 'candidates'"
      class="container mx-auto px-4 py-6"
    >
      <div class="mb-6">
        <div class="flex items-center gap-4 mb-4">
          <button
            (click)="handleBack()"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
            {{ t("actions.back") || "Retour" }}
          </button>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ t("update.title") || "Modifier le candidat" }}
        </h1>
        <p class="text-gray-600">
          {{ t("update.subtitle") || "Modifiez les informations du candidat" }}
        </p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6" *ngIf="!isLoading">
        <app-candidates-form
          [defaultValues]="getFormDefaultValues()"
          [errorMessage]="errorMessage"
          [isLoading]="isLoading"
          (submitForm)="onSubmit($event)"
        ></app-candidates-form>
      </div>

      <div
        class="bg-white rounded-lg shadow-sm p-6 text-center"
        *ngIf="isLoading"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
        ></div>
        <p class="text-gray-600">
          {{ t("candidateDetailsPage.loading") || "Chargement des données..." }}
        </p>
      </div>

      <div
        class="bg-white rounded-lg shadow-sm p-6 text-center"
        *ngIf="hasError"
      >
        <div class="text-red-500 mb-4">
          <i class="fas fa-exclamation-triangle text-2xl"></i>
        </div>
        <p class="text-red-600">{{ errorMessage }}</p>
      </div>
    </div>
  `,
  styleUrls: ["./candidates-update-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesUpdatePageComponent extends BaseUpdatePageComponent<
  UpdateCandidateDto,
  Candidate
> {
  moduleName = "candidates";

  constructor(
    protected override service: CandidatesService,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(service, dialog, transloco, router, route);
  }

  protected buildPayload(formData: any): UpdateCandidateDto {
    return {
      ...this.item,
      bio: formData.bio || undefined,
      profession: formData.profession || undefined,
      placeOfBirth: formData.placeOfBirth || undefined,
      nationality: formData.nationality || undefined,
      resumeUrl: formData.resumeUrl || undefined,
      updatedAt: new Date().toISOString(),
      // Mise à jour des informations du compte
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber || undefined,
      gender: formData.gender || undefined,
      city: formData.city || undefined,
      region: formData.region || undefined,
    };
  }

  protected getItemLabel(item: Candidate): string {
    return item.firstName && item.lastName
      ? `${item.firstName} ${item.lastName}`
      : "Candidat";
  }

  protected getItemIdParamName(): string {
    return "id";
  }

  getFormDefaultValues(): any {
    if (!this.item) return {};

    return {
      // Informations du candidat
      bio: this.item.bio || "",
      profession: this.item.profession || "",
      placeOfBirth: this.item.placeOfBirth || "",
      nationality: this.item.nationality || "",
      resumeUrl: this.item.resumeUrl || "",
      // Informations du compte
      firstName: this.item.firstName || "",
      lastName: this.item.lastName || "",
      email: this.item.email || "",
      phoneNumber: this.item.phoneNumber || "",
      gender: this.item.gender || "",
      city: this.item.city || "",
      region: this.item.region || "",
    };
  }
}
