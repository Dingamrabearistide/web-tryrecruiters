import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { JobOffer as ModuleObject } from "@modules/job-offers/job-offers.types";
import { ApplicationsButtonComponent } from "@modules/applications/components/applications-button/applications-button.component";
import { ApplicationsService } from "@modules/applications/applications.service";
import { Resume } from "@modules/resumes/resumes.types";
import { formatSalaryAmount } from "../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-job-offers-item-list",
  templateUrl: "./job-offers-item-list.component.html",
})
export class JobOffersItemListComponent implements OnInit {
  @Input() item!: ModuleObject;
  @Input() canPostulate!: boolean;

  formatSalaryAmount = formatSalaryAmount;
  @Input() userResumes: Resume[] = [];

  @Output("onView") onView$: EventEmitter<ModuleObject> = new EventEmitter();
  @Output("onAddToFavorite") onAddToFavorite$: EventEmitter<ModuleObject> =
    new EventEmitter();

  @ViewChild("applicationButton")
  applicationButton!: ApplicationsButtonComponent;

  showFull = false;
  logoError = false;
  private candidateApplications: Set<string> = new Set();

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  get isInFavorite() {
    return (
      this.item.favoritedBy?.some(
        (fav) => fav.accountId === this.candidateId,
      ) ?? false
    );
  }

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get isCandidate() {
    return this.authService.isCandidate();
  }

  get hasApplied() {
    if (!this.candidateId) {
      return false;
    }
    if (this.item?.applications && Array.isArray(this.item.applications)) {
      return this.item.applications.some(
        (application) => application.accountId === this.candidateId,
      );
    }
    return this.candidateApplications.has(this.item?.id);
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private transloco: TranslocoService,
    private applicationsService: ApplicationsService,
  ) {}

  ngOnInit(): void {
    this.loadCandidateApplications();
  }

  private loadCandidateApplications(): void {
    if (this.candidateId && this.isCandidate) {
      this.applicationsService.selectMany({ page: 1, limit: 1000 }).subscribe({
        next: (res) => {
          if (res?.data) {
            res.data.forEach((application: any) => {
              if (application.jobOfferId) {
                this.candidateApplications.add(application.jobOfferId);
              }
            });
          }
        },
        error: (error) => {
          console.error("Error loading candidate applications:", error);
        },
      });
    }
  }

  openApplicationModal(): void {
    // Déclencher l'ouverture de la modal via le composant applications-button
    if (this.applicationButton) {
      this.applicationButton.addItem();
    }
  }

  redirectToLogin(): void {
    // Rediriger vers la page de connexion avec l'URL de retour
    this.router.navigate(["/auth/login"], {
      queryParams: {
        returnUrl: `/job-offers/${this.item.id}?apply=true`,
      },
    });
  }

  redirectToRegisterCandidate(): void {
    this.router.navigate(["/auth/register"], {
      queryParams: {
        type: "candidate",
        returnUrl: `/job-offers/${this.item.id}?apply=true`,
      },
    });
  }

  onApplicationSubmitted(application: any): void {
    // Gérer la soumission réussie de la candidature
    console.log("Application submitted successfully:", application);
    // Optionnel: afficher une notification de succès
    // Optionnel: rafraîchir les données si nécessaire
  }

  openFavoriteModal(): void {
    //
  }

  onView(item: ModuleObject) {
    this.onView$.emit(item);
  }

  onLogoError(): void {
    this.logoError = true;
  }

  getInitials(): string {
    const name = this.item?.company?.name || '';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w: string) => w[0].toUpperCase())
      .join('');
  }

  onAddToFavorite(item: ModuleObject) {
    if (!item?.id) return;
    console.log("Attempting to add job offer to favorites:", item);
    // Protect against non-candidates triggering favorites
    if (!this.isCandidate) {
      const infoModal: GenericModalData = {
        title:
          this.transloco.translate("joboffers.jobDetails.addToFavorites") ||
          "Favorites",
        content:
          this.transloco.translate("joboffers.jobDetails.loginRequired") ||
          "You must be logged in as a candidate to add job offers to your favorites.",
        actions: [
          {
            id: "ok",
            label: this.transloco.translate("general.ok") || "OK",
            value: true,
            color: "primary",
          },
        ],
      };

      const infoRef = this.dialog.open(GenericModalComponent, {
        width: "400px",
        data: infoModal,
      });

      const sub = infoRef.componentInstance.action.subscribe(() => {
        infoRef.close();
        sub.unsubscribe();
      });

      return;
    }

    this.onAddToFavorite$.emit(item);
  }
}
