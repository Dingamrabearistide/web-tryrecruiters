import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import { BaseCreatePageComponent } from "../../../../@1hand/pages/base-create-page/base-create-page.component";
import { CandidatesService } from "../../candidates.service";
import { Candidate, UpdateCandidateDto } from "../../candidates.types";

@Component({
  standalone: false,

  selector: "app-candidates-create-page",
  template: `
    <div class="container mx-auto px-4 py-6">
      <div class="mb-6">
        <div class="flex items-center gap-4 mb-4">
          <button
            (click)="handleBack()"
            class="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <i class="fas fa-arrow-left"></i>
            Retour
          </button>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Nouveau candidat</h1>
        <p class="text-gray-600">Créez un nouveau profil candidat</p>
      </div>

      <div class="bg-white rounded-lg shadow-sm p-6">
        <app-candidates-form
          [errorMessage]="errorMessage"
          [isLoading]="isLoading"
          (submitForm)="onSubmit($event)"
        ></app-candidates-form>
      </div>
    </div>
  `,
  styleUrls: ["./candidates-create-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesCreatePageComponent extends BaseCreatePageComponent<
  Candidate,
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

  protected onInitParams(): void {
    // Aucune initialisation spécifique nécessaire pour la création
  }

  protected buildPayload(formData: any): UpdateCandidateDto {
    return {
      id: "", // Sera généré par le backend
      accountId: "", // Sera généré par le backend
      bio: formData.bio || undefined,
      profession: formData.profession || undefined,
      placeOfBirth: formData.placeOfBirth || undefined,
      nationality: formData.nationality || undefined,
      resumeUrl: formData.resumeUrl || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
      archived: false,
      notes: undefined,
      // Informations du compte
      email: formData.email,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phoneNumber: formData.phoneNumber || undefined,
      gender: formData.gender || undefined,
      city: formData.city || undefined,
      region: formData.region || undefined,
      birthDate: formData.birthday || undefined,
    };
  }

  protected getItemLabel(item: Candidate): string {
    return item ? `${item.firstName} ${item.lastName}` : "Candidat";
  }
}
