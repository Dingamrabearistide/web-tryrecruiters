import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CompaniesService as Service } from "@modules/compagnies/companies.service";
import {
  Company as ModuleObject,
  CompanyDto as ModuleObjectCreateDto,
  CompanyFormData as ModuleFormData,
  ModuleRoot,
} from "@modules/compagnies/companies.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseCreatePageComponent } from "../../../../../../../@1hand/pages/base-create-page/base-create-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-company-form-page",
  templateUrl: "./dashboard-employers-company-create-page.component.html",
})
export class DashboardEmployersCompanyCreatePageComponent
  extends BaseCreatePageComponent<ModuleObjectCreateDto, ModuleObject>
  implements OnInit
{
  moduleName = ModuleRoot;
  employerId!: string;

  // defaultValues: FormData = {
  //   name: "One Hand Business",
  //   email: "contact@onehandbiz.com",
  //   description:
  //     "Entreprise spécialisée dans les solutions numériques innovantes.",
  //   website: "https://www.onehandbiz.com",
  //   phoneNumber: "+237690000000",
  //   city: "Douala",
  //   region: "Littoral",
  //   country: "Cameroun",
  //   addressLine1: "Bonamoussadi, Rue des écoles",
  //   addressLine2: "Immeuble B, 2e étage",
  // };

  constructor(
    protected override service: Service,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(service, dialog, transloco, router, route);
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
  }

  override buildPayload(formData: ModuleFormData): ModuleObjectCreateDto {
    const { logoFile, ...rest } = formData;
    return {
      ...rest,
      ...(formData.logoFile ? { logoFileId: formData.logoFile.id } : {}),
      phoneNumber: formData.phoneNumber,
      accountId: this.employerId,
      createdById: this.employerId,
    };
  }

  override getItemLabel(item: ModuleObject): string {
    return item.name;
  }
}
