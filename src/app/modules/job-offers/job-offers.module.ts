import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";

import { DashboardEmployersJobOffersDetailsPageComponent } from "@modules/dashboard/submodules/employers/pages/job-offers/dashboard-employer-job-offer-details/dashboard-employers-job-offers-details-page.component";
import { DashboardEmployerJobsOffersCreatePageComponent } from "@modules/dashboard/submodules/employers/pages/job-offers/dashboard-employer-job-offers-create-page/dashboard-employer-jobs-offers-create-page.component";
import { DashboardEmployerJobOffersListPageComponent } from "@modules/dashboard/submodules/employers/pages/job-offers/dashboard-employer-job-offers-list-page/dashboard-employer-job-offers-list-page.component";
import { DashboardEmployerJobOffersUpdatePageComponent } from "@modules/dashboard/submodules/employers/pages/job-offers/dashboard-employer-job-offers-update-page/dashboard-employer-job-offers-update-page.component";
import { JobOffersListComponent } from "@modules/home/components";
import {
  JobOffersDetailsPageComponent,
  JobOffersListPageComponent,
} from "@modules/home/pages";
import { SupportedLanguages } from "../../transloco-loader";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { DashboardEmployersJobOffersFormComponent } from "./components/dashboard-employers-job-offers-form/dashboard-employers-job-offers-form.component";
import { JobOffersDatatableComponent } from "./components/job-offers-datatable/job-offers-datatable.component";
import { JobOffersDetailComponent } from "./components/job-offers-detail/job-offers-detail.component";
import { JobOffersFormComponent } from "./components/job-offers-form/job-offers-form.component";
import { JobOffersItemGridComponent } from "./components/job-offers-item-grid/job-offers-item-grid.component";
import { JobOffersItemListComponent } from "./components/job-offers-item-list/job-offers-item-list.component";
import { JobsOffersFormComponent } from "./components/jobs-offers-form/jobs-offers-form.component";
import { JobOffersRoutingModule } from "./job-offers.routing";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

const toExport = [
  JobOffersListComponent,
  JobOffersItemGridComponent,
  JobOffersItemListComponent,
  JobsOffersFormComponent,
  DashboardEmployersJobOffersFormComponent,
  JobOffersDetailComponent,
  JobOffersDatatableComponent,
  JobOffersFormComponent,

  // Pages
  JobOffersListPageComponent,
  JobOffersDetailsPageComponent,

  // Dashboard
  DashboardEmployerJobOffersListPageComponent,
  DashboardEmployersJobOffersDetailsPageComponent,
  DashboardEmployerJobOffersUpdatePageComponent,
  DashboardEmployerJobsOffersCreatePageComponent,
];

@NgModule({
  declarations: [toExport],
  imports: [
    CommonModule,
    RouterModule,
    JobOffersRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
    TranslocoModule,
    MatDialogModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "joboffers",
        loader,
      },
    },
  ],
  exports: [toExport],
})
export class JobOfferModule {}
