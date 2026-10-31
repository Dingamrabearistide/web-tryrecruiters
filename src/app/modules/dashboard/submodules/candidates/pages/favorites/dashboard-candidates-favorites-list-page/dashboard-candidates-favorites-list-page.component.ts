import { Component, OnInit } from "@angular/core";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { JobOffer as ModuleObject } from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { JobFilterCriteria } from "@modules/home/components/top-filters/top-filters.component";
import { goToTop, wait } from "../../../../../../../@1hand/utils";
import { AuthService } from "@modules/auth/auth.service";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Route, Router } from "@angular/router";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-companies-list-page",
  templateUrl: "./dashboard-candidates-favorites-list-page.component.html",
  styleUrls: ["./dashboard-candidates-favorites-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesFavoritesListPageComponent implements OnInit {
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
    private authService: AuthService,
    private dialog: MatDialog,
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

    // Backend récupère automatiquement l'userId du token JWT
    queryParams.isFavorite = true;

    this.jobOfferService.selectMany(queryParams).subscribe({
      next: async (res) => {
        await wait();
        console.log("response: ", res);
        this.items = res.data;
        this.totalPages = res.total / res.limit;

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

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadItems(newPage);
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

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    const sub = dialogRef.componentInstance.action.subscribe((result) => {
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
  handleView(item: ModuleObject) {
    this.router.navigate(["job-offers", item.id], {
      relativeTo: this.route.parent?.parent,
    });
  }
}
