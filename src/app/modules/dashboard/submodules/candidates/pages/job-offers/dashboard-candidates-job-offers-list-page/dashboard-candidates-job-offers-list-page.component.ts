import { Component, OnInit } from "@angular/core";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { TranslocoService } from "@ngneat/transloco";
import { JobOffer as ModuleObject } from "@modules/job-offers/job-offers.types";

import { MatDialog } from "@angular/material/dialog";

import { AuthService } from "@modules/auth/auth.service";
import { JobFilterCriteria } from "@modules/home/components/top-filters/top-filters.component";
import { ActivatedRoute, Router } from "@angular/router";
import { goToTop, wait } from "../../../../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-companies-list-page",
  templateUrl: "./dashboard-candidates-job-offers-list-page.component.html",
  styleUrls: ["./dashboard-candidates-job-offers-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesJobOffersListPageComponent implements OnInit {
  isLoading = false;
  hasError = false;
  errorMessage = "";

  items: ModuleObject[] = [];

  page = 1;
  totalPages = 10;

  showAdvancedFilters = false;
  displayMode: "list" | "grid" = "grid";
  isSmallScreen = false;

  selectedTags: string[] = ["Design", "Marketing"];
  sort: string = "latest";

  MOBILE_BREAKPOINT: number = 768;

  filters = {
    location: "",
    industry: "",
    companySize: "",
    searchTerm: "",
  };

  // Filtres du composant TopFiltersComponent
  currentFilters: JobFilterCriteria = {};

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  constructor(
    private jobOfferService: JobOffersService,
    private transloco: TranslocoService,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(page = 1) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    // Construire les paramètres de requête avec les filtres
    // Backend filtre automatiquement sur ACTIVE pour les candidats
    // Backend récupère automatiquement l'userId du token JWT pour isFavorite
    const queryParams: any = { page };

    if (this.currentFilters.category) {
      queryParams.category = this.currentFilters.category;
    }
    if (this.currentFilters.location) {
      queryParams.location = this.currentFilters.location;
    }
    if (this.currentFilters.experienceLevel) {
      queryParams.experienceLevel = this.currentFilters.experienceLevel;
    }
    if (this.currentFilters.postedDate) {
      queryParams.postedDate = this.currentFilters.postedDate;
    }
    if (this.currentFilters.searchQuery) {
      queryParams.search = this.currentFilters.searchQuery;
    }

    this.jobOfferService.selectMany(queryParams).subscribe({
      next: async (res) => {
        await wait();

        // Backend retourne déjà uniquement les offres ACTIVE
        this.items = res.data || [];
        this.totalPages = res.total || 0;

        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Erreur", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  addToFavorites(item: ModuleObject): void {
    if (!item?.id) {
      return;
    }

    const isCurrentlyFavorite = item.favoritedBy?.some(
      (fav: any) => fav.accountId === this.authService.getAccountId()
    ) ?? false;

    const titleKey = isCurrentlyFavorite
      ? "joboffers.jobDetails.removeFromFavorites"
      : "joboffers.jobDetails.addToFavorites";
    const contentKey = isCurrentlyFavorite
      ? "joboffers.jobDetails.removeFromFavoritesConfirm"
      : "joboffers.jobDetails.addToFavoritesConfirm";

    const modalData: GenericModalData = {
      title: this.transloco.translate(titleKey),
      content: this.transloco.translate(contentKey, { title: item.title }),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("joboffers.jobDetails.cancel"),
          value: false,
          color: undefined,
        },
        {
          id: "confirm",
          label: this.transloco.translate("joboffers.jobDetails.confirm"),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open<GenericModalComponent, GenericModalData>(
      GenericModalComponent,
      { width: "400px", data: modalData },
    );

    const sub = dialogRef.componentInstance!.action.subscribe((result: any) => {
      if (result === "confirm") {
        if (!this.candidateId) {
          return;
        }
        this.jobOfferService
          .addToFavorites(item.id, this.candidateId, !isCurrentlyFavorite)
          .subscribe({
            next: () => {
              dialogRef.close();
              sub.unsubscribe();
              this.loadItems(this.page);
            },
            error: (error) => {
              console.error("Error toggling favorite:", error);
            },
          });
      } else {
        dialogRef.close();
        sub.unsubscribe();
      }
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadItems(page);
  }

  setdisplayMode(mode: "grid" | "list") {
    this.displayMode = mode;
  }

  toggleDisplayMode(mode: "list" | "grid"): void {
    if (!this.isSmallScreen) {
      this.displayMode = mode;
    }
  }

  onTagRemoved(tag: any) {
    this.selectedTags = this.selectedTags.filter((t) => t !== tag);
  }

  onSortChanged(sort: string) {
    this.sort = sort;
    // Appliquer le tri ici si besoin
  }

  // Méthode pour gérer les changements de filtres du TopFiltersComponent
  onFiltersChanged(filters: JobFilterCriteria) {
    this.currentFilters = filters;
    this.page = 1; // Réinitialiser à la première page
    this.loadItems(1);
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }
}
