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
import { environment } from "@env/environment";
import { formatSalaryAmount } from "../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-job-offers-item-grid",
  templateUrl: "./job-offers-item-grid.component.html",
})
export class JobOffersItemGridComponent implements OnInit {
  @Input() item!: ModuleObject;
  @Input() isFavorite = false;
  @Input() userResumes: Resume[] = [];
  @Input() canPostulate!: boolean;

  formatSalaryAmount = formatSalaryAmount;

  @Output("onView") onView$: EventEmitter<ModuleObject> = new EventEmitter();
  @Output("onAddToFavorite") onAddToFavorite$: EventEmitter<ModuleObject> =
    new EventEmitter();

  @ViewChild("applicationButton")
  applicationButton!: ApplicationsButtonComponent;

  showFull = false;
  showApplicationModal = false;
  logoError = false;
  private candidateApplications: Set<string> = new Set();

  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get isCandidate() {
    return this.authService.isCandidate();
  }

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

  get isPublished(): boolean {
    return !!this.item.isPublished;
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

  redirectToRegisterCandidate(): void {
    this.router.navigate(["/auth/register"], {
      queryParams: {
        type: "candidate",
        returnUrl: `/job-offers/${this.item.id}?apply=true`,
      },
    });
  }

  onAddToFavorite(item: ModuleObject) {
    if (!item?.id) return;

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

  protected getCompanyInitials(name?: string): string {
    if (!name?.trim()) return "?";
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  protected getFullPhotoUrl(photo?: string): string {
    if (!photo) return "";
    const trimmed = photo.trim();
    const isAbsolute = /^https?:\/\//i.test(trimmed);
    if (isAbsolute) return trimmed;

    let clean = trimmed
      .replace(/^undefined\/?/, "")
      .replace(/\/undefined\/?/g, "/");

    const rawBase = environment.apiUrl;
    const base =
      rawBase && rawBase !== "undefined" ? rawBase.replace(/\/$/, "") : "";

    const path = clean.startsWith("/") ? clean : `/${clean}`;

    return base ? `${base}${path}` : path;
  }
}
