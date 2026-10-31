import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { TranslocoService } from "@ngneat/transloco";
import { goToTop, wait } from "../../../../../@1hand/utils";
import { ActivatedRoute, Router } from "@angular/router";
import { JobOffer as ModuleObject } from "@modules/job-offers/job-offers.types";
import { MatDialog } from "@angular/material/dialog";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../@1hand/components/generic-modal/generic-modal.component";
import { AuthService } from "@modules/auth/auth.service";
import { ResumesService } from "@modules/resumes/resumes.service";
import { Resume } from "@modules/resumes/resumes.types";
import { Role } from "@modules/auth/auth.types";

@Component({
  standalone: false,

  selector: "app-job-offers-details-page",
  templateUrl: "./job-offers-details-page.component.html",
  styleUrl: "./job-offers-details-page.component.scss",
})
export class JobOffersDetailsPageComponent {
  isLoading = true;
  hasError = false;
  errorMessage = "";

  items: ModuleObject[] = [];
  item!: ModuleObject;
  resumes: Resume[] = [];

  page = 1;
  totalPages = 10;
  displayedItemsCount = 6;
  totalItems = 0;
  private totalFilteredItems = 0;

  showAdvancedFilters = false;
  displayMode: "list" | "grid" = "grid";
  isSmallScreen = false;

  selectedTags: string[] = ["Design", "Marketing"];
  sort: string = "latest";

  itemId!: string;

  MOBILE_BREAKPOINT: number = 768;

  filters = {
    location: "",
    industry: "",
    companySize: "",
    searchTerm: "",
  };
  id!: Role;

  get company() {
    return this.item?.company;
  }

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  get isCandidate() {
    return this.authService.isCandidate();
  }

  goBack(): void {
    this.location.back();
  }

  constructor(
    private jobOfferService: JobOffersService,
    private transloco: TranslocoService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private authService: AuthService,
    private resumesService: ResumesService,
    private router: Router,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const itemId = params.get("slug");

      if (!itemId) {
        console.error("Aucun ID fourni dans les paramètres de la route.");
      } else {
        this.itemId = itemId;
        this.loadItem(this.itemId);

        if (this.candidateId) {
          // throw new Error("No candidate Id for application");
          this.loadResumes(this.candidateId);
        }
      }
    });
    // const userRole = this.authService.getRole();

    // if (userRole === "CANDIDATE") {
    //   this.id = this.authService.getUser()?.candidate?.id as Role;
    //   console.log("candidate", this.authService.getUser());
    // } else {
    //   //  ouvrir une modal pour avertir qu'on ne peux pas metteen fav : il fau se connecter
    //   // return;
    // }
    // console.log(this.id);
    //api.workos.com/user_management/authorize?client_id=client_01K3A541FN8TA3EPPHTD2325AR&provider=authkit&redirect_uri=https%3A%2F%2Fapi.cline.bot%2Fapi%2Fv1%2Fauth%2Fcallback&response_type=code&state=eyJjbGllbnRfdHlwZSI6ImV4dGVuc2lvbiIsImNhbGxiYWNrX3VybCI6InZzY29kZTovL3Nhb3Vkcml6d2FuLmNsYXVkZS1kZXYvYXV0aCJ96U6NBqtWIKCzzlOGqqp9MaPq6ch9EpK8f5rvm8gRByo%3D
    // if (this.id) {
    // } else {
    // }
  }

  loadItem(id: string) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.jobOfferService.selectById(id).subscribe({
      next: async (res) => {
        // await wait();
        // console.log("response: ", res);
        this.item = res;

        // this.isLoading = true;
        // this.hasError = false;
        // this.errorMessage = "";

        this.loadItems();
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

    // Charger plus d'offres pour compenser le filtrage
    const limitToFetch = this.displayedItemsCount + 1;

    this.jobOfferService
      .selectMany({ page, limit: limitToFetch, status: "ACTIVE" })
      .subscribe({
        next: async (res) => {
          await wait();
          console.log("response: ", res);
          // Filtrer pour exclure l'offre actuelle
          const filteredData = res.data.filter(
            (offer) => offer.id !== this.item?.id,
          );

          if (page === 1) {
            this.items = filteredData.slice(0, this.displayedItemsCount);
          } else {
            this.items = [
              ...this.items,
              ...filteredData.slice(0, this.displayedItemsCount),
            ];
          }

          // Calculer le total réel en excluant l'offre actuelle
          this.totalItems =
            res.total -
            (page === 1 && res.data.some((o) => o.id === this.item?.id)
              ? 1
              : 0);
          this.totalFilteredItems = this.totalItems;
          this.totalPages = Math.ceil(
            this.totalItems / this.displayedItemsCount,
          );
          this.page = page;

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

  loadMoreOffers(): void {
    const nextPage = this.page + 1;
    if (nextPage <= this.totalPages) {
      this.loadItems(nextPage);
    }
  }

  get hasMoreOffers(): boolean {
    return this.page < this.totalPages && this.items.length > 0;
  }

  loadResumes(candidateId: string) {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.resumesService.selectMany({ candidateId }).subscribe({
      next: async (res) => {
        // await wait();
        // console.log("response: ", res);
        this.resumes = res.data;

        // this.isLoading = true;
        // this.hasError = false;
        // this.errorMessage = "";
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
    // Basic guard: ensure we have an item
    if (!this.item?.id) {
      return;
    }

    // If current user is not a candidate, show info modal and stop
    if (!this.isCandidate) {
      const infoModal: GenericModalData = {
        title:
          this.transloco.translate("joboffers.jobDetails.addToFavorites") ||
          "Favorites",
        content:
          this.transloco.translate("joboffers.jobDetails.loginRequired") ||
          "You must be logged in as a candidate to add job offers to your favorites.",
        // single OK action for info modal
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

      const subInfo = infoRef.componentInstance.action.subscribe((res) => {
        // close on any action
        infoRef.close();
        subInfo.unsubscribe();
      });

      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("joboffers.jobDetails.addToFavorites"),
      content: this.transloco.translate(
        "joboffers.jobDetails.addToFavoritesConfirm",
        { title: this.item.title },
      ),
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

    // dialogRef.afterClosed()
    const sub = dialogRef.componentInstance.action.subscribe((result) => {
      console.log("clicked");
      if (result === "confirm") {
        const candidateId = this.candidateId;
        if (!candidateId) {
          const infoModal: GenericModalData = {
            title:
              this.transloco.translate("joboffers.jobDetails.addToFavorites") ||
              "Favorites",
            content:
              this.transloco.translate("joboffers.jobDetails.loginRequired") ||
              "You must be logged in as a candidate to add job offers to your favorites.",
            // single OK action for info modal
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

          const subInfo = infoRef.componentInstance.action.subscribe((res) => {
            // close on any action
            infoRef.close();
            subInfo.unsubscribe();
          });

          return;
        }

        this.jobOfferService
          .addToFavorites(this.item.id, candidateId)
          .subscribe({
            next: (response) => {
              // if (response.success) {
              //   // Update the item's bookmark status
              //   // this.item.isbookmarked = true;
              console.log("Offre ajoutée aux favoris avec succès");
              // }
              dialogRef.close();
              sub.unsubscribe();
              this.loadItem(this.item.id);
            },
            error: (error) => {
              console.error("Erreur lors de l'ajout aux favoris:", error);
            },
          });
      } else {
        dialogRef.close();
        sub.unsubscribe();
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
            "joboffers.jobDetails.applyFormDescription",
          )}</p>
          <!-- Espace réservé pour le formulaire de candidature -->
          <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p class="text-gray-500">${this.transloco.translate(
              "joboffers.jobDetails.applicationFormPlaceholder",
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
            "joboffers.jobDetails.sendApplication",
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

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  onAddToFavorite(item: ModuleObject): void {
    if (!item?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("joboffers.jobDetails.addToFavorites"),
      content: this.transloco.translate(
        "joboffers.jobDetails.addToFavoritesConfirm",
        { title: item.title },
      ),
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

    // dialogRef.afterClosed()
    const sub = dialogRef.componentInstance.action.subscribe((result) => {
      console.log("clicked");
      if (result === "confirm") {
        if (!this.candidateId) {
          alert("only candidate can add job offers to favorites");
          return;
        }

        this.jobOfferService
          .addToFavorites(item.id, this.candidateId)
          .subscribe({
            next: (response) => {
              // if (response.success) {
              //   // Update the item's bookmark status
              //   // this.item.isbookmarked = true;
              console.log("Offre ajoutée aux favoris avec succès");
              // }
              dialogRef.close();
              sub.unsubscribe();

              goToTop();
              this.loadItems();
            },
            error: (error) => {
              console.error("Erreur lors de l'ajout aux favoris:", error);
            },
          });
      } else {
        dialogRef.close();
        sub.unsubscribe();
      }
    });
  }
}
