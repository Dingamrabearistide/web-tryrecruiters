import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { Company } from "@modules/compagnies/companies.types";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { paramsDto } from "@modules/job-offers/job-offers.types";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-companies-details-page",
  template: `
    <div *transloco="let t; read: 'companies'">
      <button class="m-2 bg-primary app-primary" (click)="handleBack()">
        <i class="fas fa-chevron-left mr-1 text-white"></i>
        {{ t("common.previous") }}
      </button>

      <div *ngIf="isLoading" class="grid grid-rows-[1fr] h-[400px]">
        <div class="w-full text-center h-full">
          <app-loader></app-loader>
        </div>
      </div>

      <div *ngIf="!isLoading && hasError" class="w-full">
        <app-generic-error [message]="errorMessage"></app-generic-error>
      </div>

      <div *ngIf="!isLoading && !hasError && item">
        <app-companies-details
          [item]="item"
          [jobOffers]="jobOffers"
        ></app-companies-details>
      </div>
    </div>
  `,
})
export class DashboardEmployersCompaniesDetailPageComponent implements OnInit {
  item: Company = {} as Company;
  jobOffers: any[] = [];
  relatedCompanies: Company[] | Partial<Company>[] = [];
  isLoading = true;
  hasError = false;
  errorMessage = "";
  currentCompanyId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private companiesService: CompaniesService,
    private jobOffersService: JobOffersService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  handleCreateJobOffer(): void {
    if (this.item?.id) {
      this.router.navigate([`/employers/job-offers/create`], {
        queryParams: { companyId: this.item.id },
      });
    }
  }

  handleEdit(): void {
    if (this.currentCompanyId) {
      this.router.navigate([
        "/employers/companies",
        this.currentCompanyId,
        "edit",
      ]);
    }
  }

  handleDelete(): void {
    // if (
    //   !this.currentCompanyId ||
    //   !confirm("Êtes-vous sûr de vouloir supprimer cette entreprise ?")
    // ) {
    //   return;
    // }
    // this.isLoading = true;
    // this.companiesService
    //   .deleteItem(this.currentCompanyId)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     catchError((err) => {
    //       this.handleError(
    //         "Erreur lors de la suppression de l'entreprise.",
    //         err
    //       );
    //       return [];
    //     }),
    //     finalize(() => {
    //       this.isLoading = false;
    //       this.cdr.detectChanges();
    //     })
    //   )
    //   .subscribe(() => {
    //     this.router.navigate(["/employers/companies"]);
    //   });
  }

  handleWebsiteClick(): void {
    if (this.item?.website) {
      const url = this.item.website.startsWith("http")
        ? this.item.website
        : `https://${this.item.website}`;
      window.open(url, "_blank");
    }
  }

  handlePhoneClick(): void {
    if (this.item?.phoneNumber) {
      window.location.href = `tel:${this.item.phoneNumber}`;
    }
  }

  handleEmailClick(): void {
    if (this.item?.email) {
      window.location.href = `mailto:${this.item.email}`;
    }
  }

  handleBack(): void {
    this.location.back();
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const companyId = params.get("companyId");
      console.log("Company ID from route:", companyId);
      this.currentCompanyId = companyId;

      if (!companyId) {
        this.hasError = true;
        this.errorMessage = "Aucun identifiant d'entreprise trouvé dans l'URL.";
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      this.clearErrorState();

      this.companiesService.selectById(companyId).subscribe({
        next: (response) => {
          if (response) {
            this.item = response;
            console.log("Company data loaded:", this.item);
            this.loadRelatedCompanies();
            this.loadJobOffers();
          } else {
            this.handleError("Détails de l'entreprise non trouvés.");
          }
        },
        error: (err) => {
          this.handleError(
            "Erreur lors du chargement des détails de l'entreprise.",
            err,
          );
        },
        complete: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    });
  }

  private loadRelatedCompanies(): void {
    if (!this.item) return;

    const params: paramsDto = {
      limit: 6,
      page: 1,
      keyword: this.item?.organizationType || this.item?.city || "",
    };

    this.companiesService.selectMany(params).subscribe({
      next: (response: any) => {
        if (response?.data) {
          this.relatedCompanies = response.data;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error("Error fetching related companies:", err);
      },
    });
  }

  private loadJobOffers(): void {
    if (!this.item?.id) return;

    this.jobOffersService
      .selectMany({
        companyId: this.item.id,
      })
      .subscribe({
        next: (response) => {
          if (response?.data) {
            this.jobOffers = response.data;
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error("Error fetching job offers:", err);
        },
      });
  }

  private formatLocation(city?: string, country?: string): string {
    if (!city && !country) return "N/A";
    if (city && country) return `${city}, ${country}`;
    return city || country || "N/A";
  }

  private handleError(message: string, error?: any): void {
    this.hasError = true;
    this.errorMessage = message;
    if (error) console.error(message, error);
    this.cdr.detectChanges();
  }

  private clearErrorState(): void {
    this.hasError = false;
    this.errorMessage = "";
  }
}
