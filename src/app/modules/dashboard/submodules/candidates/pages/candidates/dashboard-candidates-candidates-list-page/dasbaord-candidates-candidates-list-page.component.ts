import { Component } from "@angular/core";
import { CandidatesService } from "@modules/candidates/candidates.service";
import { TranslocoService } from "@ngneat/transloco";

import { Candidate as ModuleObject } from "@modules/candidates/candidates.types";
import { JobFilterCriteria } from "@modules/home/components/top-filters/top-filters.component";
import { goToTop, wait } from "../../../../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-candidates-list-page",
  templateUrl: "./dasbaord-candidates-candidates-list-page.component.html",
  styleUrls: ["./dasbaord-candidates-candidates-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DasbaordCandidatesCandidatesListPageComponent {
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

  constructor(
    private service: CandidatesService,
    private transloco: TranslocoService,
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

    this.service.selectMany(queryParams).subscribe({
      next: async (res) => {
        await wait();
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
}
