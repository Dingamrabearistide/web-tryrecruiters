import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { SupportedLanguages } from "../../transloco-loader";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { compagniesRoutingModule } from "./compagnies.routing";
import { CompaniesListItemComponent } from "./components/companies-list-item/companies-list-item.component";
import { CompaniesFormComponent } from "./components/companies-form/companies-form.component";
import { CompanySuccessModalComponent } from "./components/company-success-modal/company-success-modal.component";
import {
  CompaniesDetailsPageComponent,
  CompaniesListPageComponent,
} from "@modules/home/pages";
import { JobOfferModule } from "@modules/job-offers/job-offers.module";
import { CompaniesListComponent } from "./components/companies-list/companies-list.component";
import { DashboardEmployersCompaniesListPageComponent } from "@modules/dashboard/submodules/employers/pages/companies/dashboard-employers-companies-list-page/dashboard-employers-companies-list-page.component";
import { DashboardEmployersCompaniesDetailPageComponent } from "@modules/dashboard/submodules/employers/pages/companies/dashboard-employers-companies-detail-page/dashboard-employers-companies-detail-page.component";
import { DashboardEmployersCompaniesUpdatePageComponent } from "@modules/dashboard/submodules/employers/pages/companies/dashboard-employers-companies-update-page/dashboard-employers-companies-update-page.component";
import { DashboardEmployersCompanyCreatePageComponent } from "@modules/dashboard/submodules/employers/pages/companies/dashboard-employers-companies-create-page/dashboard-employers-company-create-page.component";
import { CompaniesDatatableComponent } from "./components/companies-datatable/companies-datatable.component";
import { CompaniesDetailsComponent } from "./components/companies-details/companies-details.component";
import { ReadMoreComponent } from "../../@1hand/components/read-more/read-more.component";
import { CountrySelectComponent } from "../../@1hand/components/country-select/country-select.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

const toExport = [
  CompaniesListComponent,
  CompaniesListItemComponent,
  CompaniesFormComponent,
  CompanySuccessModalComponent,
  // CompaniesDetailComponent,
  CompaniesDetailsComponent,
  CompaniesDatatableComponent,

  // Pages
  CompaniesDetailsPageComponent,
  CompaniesListPageComponent,

  // Employer Dashboard
  DashboardEmployersCompaniesListPageComponent,
  DashboardEmployersCompaniesDetailPageComponent,
  DashboardEmployersCompaniesUpdatePageComponent,
  DashboardEmployersCompanyCreatePageComponent,
];

@NgModule({
  declarations: [toExport],
  imports: [
    CommonModule,
    RouterModule,
    compagniesRoutingModule,
    CoreModule,
    SharedModule,
    // standalone component used in companies details
    ReadMoreComponent,
    // standalone component used in the companies filter (country dropdown)
    CountrySelectComponent,
    FormsModule,
    TranslocoModule,
    JobOfferModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "companies",
        loader,
      },
    },
  ],
  exports: [toExport],
})
export class CompagniesModule {}
