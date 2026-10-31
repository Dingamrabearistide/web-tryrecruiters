import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { SupportedLanguages } from "../../transloco-loader";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { ApplicationsRoutingModule } from "./applications.routing";
import { ApplicationsService } from "./applications.service";

// Components
import { ApplicationsDatatableComponent } from "./components/applications-datatable/applications-datatable.component";
import { ApplicationsFormComponent } from "./components/applications-form/applications-form.component";

// Dashboard Components
import { CandidatesModule } from "@modules/candidates/candidates.module";
import { DashboardEmployersApplicationsDetailsPageComponent } from "@modules/dashboard/submodules/employers/pages/applications/dashboard-employers-application-details-page/dashboard-employers-applications-details-page.component";
import { DashboardEmployersApplicationsListPageComponent } from "@modules/dashboard/submodules/employers/pages/applications/dashboard-employers-applications-list-page/dashboard-employers-applications-list-page.component";
import { JobOfferModule } from "@modules/job-offers/job-offers.module";
import { InterviewModule } from "../interview/interview.module";
import { ReadMoreComponent } from "../../@1hand/components/read-more/read-more.component";
import { ApplicationsDetailsComponent } from "./components/applications-details/applications-details.component";
import { HistoryTimelineComponent } from "../../@1hand/components/history-timeline/history-timeline.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

// const toExport = [];

@NgModule({
  declarations: [
    // ...toExport,
    // Core Components
    ApplicationsDatatableComponent,
    ApplicationsFormComponent,
    ApplicationsDetailsComponent,

    // Dashboard Components
    DashboardEmployersApplicationsListPageComponent,
    DashboardEmployersApplicationsDetailsPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    TranslocoModule,
    ApplicationsRoutingModule,
    CoreModule,
    SharedModule,
    CandidatesModule,
    JobOfferModule,
    InterviewModule,
    ReadMoreComponent,
    HistoryTimelineComponent,
  ],
  providers: [
    ApplicationsService,
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "applications",
        loader,
      },
    },
  ],
  exports: [
    // ...toExport,
    // Core Components
    ApplicationsDatatableComponent,
    ApplicationsFormComponent,

    // Dashboard Components
    DashboardEmployersApplicationsListPageComponent,
    DashboardEmployersApplicationsDetailsPageComponent,
    ApplicationsDetailsComponent,
  ],
})
export class ApplicationsModule {}
