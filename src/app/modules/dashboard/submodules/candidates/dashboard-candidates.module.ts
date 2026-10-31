import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
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
  loader as ResumesLoader,
  ResumesModule,
} from "@modules/resumes/resumes.module";
import { Translation, TRANSLOCO_SCOPE } from "@ngneat/transloco";
import { GenericErrorComponent } from "../../../../@1hand/components/generic-error/generic-error.component";
import { HistoryTimelineComponent } from "../../../../@1hand/components/history-timeline/history-timeline.component";
import { CoreModule } from "../../../core/core.module";
import { SharedModule } from "../../../shared/shared.module";
import { DashboardNavbarComponent } from "../../layout/dashboard-navbar/dashboard-navbar.component";

import {
  loader as EmployerLoader,
  EmployersModule,
} from "@modules/employers/employers.module";

import {
  loader as CandidatesLoader,
  CandidatesModule,
} from "@modules/candidates/candidates.module";
import { DashboardCandidatesApplicationsDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/applications/dashboard-candidates-application-details-page/dashboard-candidates-applications-details-page.component";
import { DashboardCandidatesApplicationsListPageComponent } from "@modules/dashboard/submodules/candidates/pages/applications/dashboard-candidates-applications-list-page/dashboard-candidates-applications-list-page.component";
import { DashbaordCandidatesCandidatesDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/candidates/dashboard-candidates-candidates-details-page/dashbaord-candidates-candidates-details-page.component";
import { DasbaordCandidatesCandidatesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/candidates/dashboard-candidates-candidates-list-page/dasbaord-candidates-candidates-list-page.component";
import { DashboardCandidatesCompaniesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/companies/dashboard-candidate-companies-list-page/dashboard-candidates-companies-list-page.component";
import { DashboardCandidatesCompaniesDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/companies/dashboard-candidates-companies-details-page/dashboard-candidates-companies-details-page.component";
import { DashboardCandidatesFavoritesDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/favorites/dashboard candidates-favorites-details-page/dashboard-candidates-favorites-details-page.component";
import { DashboardCandidatesFavoritesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/favorites/dashboard-candidates-favorites-list-page/dashboard-candidates-favorites-list-page.component";
import { DashboardCandidatesJobOffersDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/job-offers/dashboard-candidates-job-offers-details-page/dashboard-candidates-job-offers-details-page.component";
import { DashboardCandidatesJobOffersListPageComponent } from "@modules/dashboard/submodules/candidates/pages/job-offers/dashboard-candidates-job-offers-list-page/dashboard-candidates-job-offers-list-page.component";
import { DashboardCandidateResumesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/resumes/dashboard-candidate-resumes-list-page/dashboard-candidate-resumes-list-page.component";
import { DashboardCandidatesUsersProfilePageComponent } from "@modules/dashboard/submodules/candidates/pages/users/dashboard-candidates-users-profile-page/dashboard-candidates-users-profile-page.component";
import { InterviewModule } from "@modules/interview/interview.module";
import { UsersModule } from "@modules/users/users.module";
import { GenericFormComponent } from "../../../../@1hand/components/generic-form/generic-form.component";
import { GenericModalComponent } from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { SupportedLanguages } from "../../../../transloco-loader";
import { DashboardCandidatesRoutingModule } from "./dashboard-candidates-routing.module";
import { DashboardCandidatesComponent } from "./dashboard-candidates.component";
import { DashboardCandidatesLayoutComponent } from "./layout/dashboard-candidates-layout.component";
import { DashboardCandidatesInterviewsDetailsPageComponent } from "./pages/interviews/dashboard-candidates-interviews-details-page/dashboard-candidates-interviews-details-page.component";
import { DashboardCandidatesInterviewsListPageComponent } from "./pages/interviews/dashboard-candidates-interviews-list-page/dashboard-candidates-interviews-list-page.component";
import { DashboardCandidateResumeCreatePageComponent } from "./pages/resumes/dashboard-candidate-resume-create-page/dashboard-candidate-resume-create-page.component";
import { DashboardCandidateResumeUpdatePageComponent } from "./pages/resumes/dashboard-candidate-resume-update-page/dashboard-candidate-resume-update-page.component";

// Dashboard Components
import { DashboardStatsCardsComponent } from "./components/dashboard-stats-cards/dashboard-stats-cards.component";
import { RecentApplicationsComponent } from "./components/recent-applications/recent-applications.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

@NgModule({
  declarations: [
    // Layout
    DashboardCandidatesLayoutComponent,
    DashboardCandidatesComponent,

    //pages
    // applications
    DashboardCandidatesApplicationsListPageComponent,
    DashboardCandidatesApplicationsDetailsPageComponent,

    // candidates
    DasbaordCandidatesCandidatesListPageComponent,
    DashbaordCandidatesCandidatesDetailsPageComponent,

    //companies
    DashboardCandidatesCompaniesListPageComponent,
    DashboardCandidatesCompaniesDetailsPageComponent,

    //favorites
    DashboardCandidatesFavoritesListPageComponent,
    DashboardCandidatesFavoritesDetailsPageComponent,

    //job offers
    DashboardCandidatesJobOffersListPageComponent,
    DashboardCandidatesJobOffersDetailsPageComponent,

    //users
    DashboardCandidatesUsersProfilePageComponent,

    //resumes
    DashboardCandidateResumesListPageComponent,
    DashboardCandidateResumeCreatePageComponent,
    DashboardCandidateResumeUpdatePageComponent,

    DashboardCandidatesInterviewsListPageComponent,
    DashboardCandidatesInterviewsDetailsPageComponent,

    // Dashboard Components
    DashboardStatsCardsComponent,
    RecentApplicationsComponent,
  ],
  imports: [
    CommonModule,
    DashboardCandidatesRoutingModule,
    CoreModule,
    SharedModule,
    HistoryTimelineComponent,

    CompagniesModule,
    JobOfferModule,
    ResumesModule,
    ApplicationsModule,
    EmployersModule,
    UsersModule,
    CandidatesModule,
    InterviewModule,

    // StandAlone component
    DashboardNavbarComponent,
    GenericErrorComponent,
    GenericFormComponent,
    GenericModalComponent,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "dashboardcandidates",
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
        scope: "resumes",
        loader: ResumesLoader,
      },
    },
  ],
})
export class DashboardCandidatesModule {}
