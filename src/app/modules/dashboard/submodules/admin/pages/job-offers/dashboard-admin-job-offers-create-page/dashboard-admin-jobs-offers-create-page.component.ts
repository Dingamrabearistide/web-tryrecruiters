import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { JobOffersService as Service } from "@modules/job-offers/job-offers.service";
import {
  CreateJobOfferDto as ModuleObjectCreateDto,
  JobOffer as ModuleObject,
  JobOfferFormData as FormData,
} from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseCreatePageComponent } from "../../../../../../../@1hand/pages/base-create-page/base-create-page.component";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { Company } from "@modules/compagnies/companies.types";
import { wait } from "../../../../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-jobs-offers-create-page",
  templateUrl: "./dashboard-admin-jobs-offers-create-page.component.html",
})
export class DashboardAdminJobsOffersCreatePageComponent
  extends BaseCreatePageComponent<ModuleObjectCreateDto, ModuleObject>
  implements OnInit
{
  moduleName = "joboffers";
  employerId!: string;
  companyId!: string;

  companies: Company[] = [];

  errorMessageInit = "";
  isLoadingInit = false;
  hasErrorInit = false;

  constructor(
    protected override service: Service,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    private companiesService: CompaniesService,
  ) {
    super(service, dialog, transloco, router, route);
  }

  override ngOnInit(): void {
    this.loadCompanies();

    this.onInitParams();
  }

  override onInitParams(): void {
    this.route.parent?.parent?.paramMap.subscribe((params) => {
      const employerId = params.get("employerId");
      if (!employerId) {
        this.router.navigate(["../"]);
        return;
      }
      this.employerId = employerId;
    });

    // this.route.paramMap.subscribe((params) => {
    //   const companyId = params.get("companyId");
    //   if (!companyId) {
    //     this.router.navigate(["../"]);
    //     return;
    //   }
    //   this.companyId = companyId;
    // });
  }

  override buildPayload(formData: FormData): ModuleObjectCreateDto {
    return {
      ...formData,
      companyId: formData.company.id,
      recruiterId: this.employerId,
      expiresAt: new Date(formData.expiresAt!).toISOString(),
    };
  }

  override getItemLabel(item: ModuleObject): string {
    return item.title;
  }

  loadCompanies() {
    this.errorMessageInit = "";
    this.isLoadingInit = true;
    this.hasErrorInit = false;

    this.companiesService.selectMany({ page: 1 }).subscribe({
      next: async (res) => {
        await wait();

        this.errorMessageInit = "";
        this.isLoadingInit = false;
        this.hasErrorInit = false;

        this.companies = res.data;
      },
      error: (error) => {
        this.errorMessageInit =
          error?.error?.message ||
          this.transloco.translate("general.genericError");
        this.isLoadingInit = false;
        this.hasErrorInit = true;
      },
    });
  }
}
