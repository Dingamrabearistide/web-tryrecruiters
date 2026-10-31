import { Component } from "@angular/core";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { TranslocoService } from "@ngneat/transloco";
import { ActivatedRoute } from "@angular/router";
import { JobOffer as ModuleObject } from "@modules/job-offers/job-offers.types";
import { MatDialog } from "@angular/material/dialog";
import { goToTop, wait, formatSalaryAmount } from "../../../../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";
import { Location } from "@angular/common";
import { Company } from "@modules/compagnies/companies.types";
import { AuthService } from "@modules/auth/auth.service";

@Component({
  standalone: false,

  selector: "app-job-offers-details-page",
  templateUrl: "./dashboard-candidates-favorites-details-page.component.html",
  styleUrls: ["./dashboard-candidates-favorites-details-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesFavoritesDetailsPageComponent {
  formatSalaryAmount = formatSalaryAmount;

  isLoading = false;
  hasError = false;
  errorMessage = "";

  items: ModuleObject[] = [];
  item!: ModuleObject;

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

  get candiateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  constructor(
    private jobOfferService: JobOffersService,
    private transloco: TranslocoService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private location: Location,
    private authService: AuthService
  ) {}

  get company() {
    return this.item?.company as Company;
  }

  handleBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      console.log("params", params);
      const id = params.get("slug");

      if (id) {
        this.loadItem(id);
        this.loadItems();
      } else {
        console.error("Aucun ID fourni dans les paramètres de la route.");
      }
    });
  }

  loadItem(id: string) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.jobOfferService.selectById(id).subscribe({
      next: async (res) => {
        await wait();
        console.log("response: ", res);
        this.item = res;

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

  loadItems(page = 1) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.jobOfferService.selectMany({ page, limit: 3 }).subscribe({
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

  addToFavorites(): void {
    if (!this.item?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("joboffers.jobDetails.addToFavorites"),
      content: this.transloco.translate(
        "joboffers.jobDetails.addToFavoritesConfirm",
        { title: this.item.title }
      ),
      actions: [
        {
          label: this.transloco.translate("joboffers.jobDetails.cancel"),
          value: false,
          color: undefined,
        },
        {
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

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        if (!this.candiateId) {
          alert("only candidate can add job offers to favorites");
          return;
        }
        this.jobOfferService
          .addToFavorites(this.item.id, this.candiateId)
          .subscribe({
            next: (response) => {
              if (response.success) {
                // Update the item's bookmark status
                this.item.isbookmarked = true;
                console.log("Offre ajoutée aux favoris avec succès");
              } else {
                console.error("Échec de l'ajout aux favoris");
              }
            },
            error: (error) => {
              console.error("Erreur lors de l'ajout aux favoris:", error);
            },
          });
      }
    });
  }

  applyToJob(): void {
    if (!this.item?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("joboffers.jobDetails.applyFor", {
        title: this.item.title,
      }),
      html: `
        <div class="gap-4">
          <p class="text-gray-600 mb-4">${this.transloco.translate(
            "joboffers.jobDetails.applyFormDescription"
          )}</p>
          <!-- Espace réservé pour le formulaire de candidature -->
          <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p class="text-gray-500">${this.transloco.translate(
              "joboffers.jobDetails.applicationFormPlaceholder"
            )}</p>
          </div>
        </div>
      `,
      actions: [
        {
          label: this.transloco.translate("joboffers.jobDetails.cancel"),
          value: false,
          color: undefined,
        },
        {
          label: this.transloco.translate(
            "joboffers.jobDetails.sendApplication"
          ),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "600px",
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        // Ici vous pourrez ajouter la logique pour envoyer la candidature
        console.log("Candidature envoyée pour l'offre:", this.item.title);
      }
    });
  }
}
