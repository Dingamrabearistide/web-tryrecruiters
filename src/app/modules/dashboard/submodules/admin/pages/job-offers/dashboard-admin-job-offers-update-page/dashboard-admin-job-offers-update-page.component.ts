import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { JobOffersService as Service } from "@modules/job-offers/job-offers.service";
import {
  JobOfferFormData as FormData,
  JobOffer as ModuleObject,
  UpdateJobOfferDto as ModuleObjectUpdateDto,
  ModuleRoot,
} from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseUpdatePageComponent } from "../../../../../../../@1hand/pages/base-update-page/base-update-page.component";
import { wait } from "../../../../../../../@1hand/utils";
import { Company } from "@modules/compagnies/companies.types";
import { CompaniesService } from "@modules/compagnies/companies.service";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-job-offers-update-page",
  templateUrl: "./dashboard-admin-job-offers-update-page.component.html",
  styleUrls: ["./dashboard-admin-job-offers-update-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminJobOffersUpdatePageComponent extends BaseUpdatePageComponent<
  ModuleObjectUpdateDto,
  ModuleObject
> {
  moduleName = "joboffers";
  employerId!: string;

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
    private readonly companiesService: CompaniesService
  ) {
    super(service, dialog, transloco, router, route);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    this.route.parent?.parent?.paramMap.subscribe((params) => {
      const employerId = params.get("employerId");
      if (!employerId) {
        throw new Error(`Missing Id to load item: ${employerId}`);
      }
      this.employerId = employerId;
      this.loadCompanies();
    });
  }

  override getItemIdParamName() {
    return "jobOffersId";
  }

  override buildPayload(formData: FormData): ModuleObjectUpdateDto {
    return {
      ...formData,
      companyId: formData.company.id,
      recruiterId: this.employerId,
      expiresAt: new Date(formData.expiresAt!).toISOString(),
      salary: formData.salary ? String(formData.salary) : undefined,
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
