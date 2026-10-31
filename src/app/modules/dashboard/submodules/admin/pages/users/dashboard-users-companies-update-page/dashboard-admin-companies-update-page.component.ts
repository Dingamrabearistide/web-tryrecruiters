import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Company as ModuleObject,
  CompanyFormData as FormData,
  ModuleRoot,
  UpdateCompanyDto as ModuleObjectUpdateDto,
} from "@modules/compagnies/companies.types";
import { TranslocoService } from "@ngneat/transloco";
import { CompaniesService as Service } from "@modules/compagnies/companies.service";
import { BaseUpdatePageComponent } from "../../../../../../../@1hand/pages/base-update-page/base-update-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-companies-update-page",
  templateUrl: "./dashboard-admin-companies-update-page.component.html",
  styleUrls: ["./dashboard-admin-companies-update-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminCompaniesUpdatePageComponent extends BaseUpdatePageComponent<
  ModuleObjectUpdateDto,
  ModuleObject
> {
  moduleName = ModuleRoot;
  employerId!: string;

  constructor(
    protected override service: Service,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(service, dialog, transloco, router, route);
  }

  override ngOnInit(): void {
    super.ngOnInit();

    // Init params parent route
    this.route.parent?.parent?.paramMap.subscribe((params) => {
      const employerId = params.get("employerId");
      if (!employerId) {
        this.router.navigate(["../"]);
        return;
      }
      this.employerId = employerId;
    });
  }

  override getItemIdParamName() {
    return "companyId";
  }

  override buildPayload(formData: FormData): ModuleObjectUpdateDto {
    return {
      ...formData,
      recruiterId: this.employerId,
    };
  }

  override getItemLabel(item: ModuleObject): string {
    return item.name;
  }
}
