import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ApplicationsModule } from "@modules/applications/applications.module";
import {
  CompagniesModule,
  loader as CompaniesLoader,
} from "@modules/compagnies/compagnies.module";
import {
  JobOfferModule,
  loader as JobOffersLoader,
} from "@modules/job-offers/job-offers.module";
import {
  InterviewModule,
  loader as InterviewsLoader,
} from "@modules/interview/interview.module";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { GenericErrorComponent } from "../../../../@1hand/components/generic-error/generic-error.component";
import { HistoryTimelineComponent } from "../../../../@1hand/components/history-timeline/history-timeline.component";
import { CoreModule } from "../../../core/core.module";
import { SharedModule } from "../../../shared/shared.module";
import { DashboardNavbarComponent } from "../../layout/dashboard-navbar/dashboard-navbar.component";
import { ChartFinanceComponent } from "../../components/chart-finance/chart-finance.component";
import { EmployersRoutingModule } from "./employers-routing.module";
import { EmployersDashboardComponent } from "./layout/employers-dashboard.component";

import {
  EmployersModule,
  loader as EmployerLoader,
} from "@modules/employers/employers.module";

import { loader as CandidatesLoader, CandidatesSharedModule } from "@modules/candidates/candidates.module";
import { FormsModule } from "@angular/forms";
import { SupportedLanguages } from "../../../../transloco-loader";
import { MatDialogModule } from "@angular/material/dialog";
import { DashboardEmployerInterviewsListPageComponent } from "./pages/interviews/dashboard-employer-interviews-list-page/dashboard-employer-interviews-list-page.component";
import { DashboardEmployersInterviewsDetailsPageComponent } from "./pages/interviews/dashboard-employers-interviews-details-page/dashboard-employers-interviews-details-page.component";
import { DashboardEmployersHomeComponent } from "./pages/dashboard-employers-home/dashboard-employers-home.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

@NgModule({
  declarations: [
    // Layout
    EmployersDashboardComponent,

    // Pages
    DashboardEmployersHomeComponent,
    DashboardEmployerInterviewsListPageComponent,
    DashboardEmployersInterviewsDetailsPageComponent,
    // Components
    ChartFinanceComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    EmployersRoutingModule,
    HistoryTimelineComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CompagniesModule,
    JobOfferModule,
    InterviewModule,
    ApplicationsModule,
    EmployersModule,
    CoreModule,
    SharedModule,
    MatDialogModule,
    JobOfferModule,
    CompagniesModule,
    TranslocoModule,
    CandidatesSharedModule,
    // StandAlone components
    DashboardNavbarComponent,
    GenericErrorComponent,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "dashboardemployers",
        loader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "employers",
        loader: EmployerLoader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "companies",
        loader: CompaniesLoader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "joboffers",
        loader: JobOffersLoader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "candidates",
        loader: CandidatesLoader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "interviews",
        loader: InterviewsLoader,
      },
    },
  ],
})
export class DashboardEmployersModule {}
