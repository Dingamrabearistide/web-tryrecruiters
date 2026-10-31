import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardCandidatesComponent } from "./dashboard-candidates.component";
import { DashboardCandidatesLayoutComponent } from "./layout/dashboard-candidates-layout.component";
import { DashboardEmployersSettingsPageComponent } from "../employers/pages/settings/dashboard-employers-settings-page/dashboard-employers-settings-page.component";
import { DashboardEmployersSubscriptionsListPageComponent } from "../employers/pages/subscriptions/dashboard-employers-subscriptions-list-page/dashboard-employers-subscriptions-list-page.component";
import { DasbaordCandidatesCandidatesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/candidates/dashboard-candidates-candidates-list-page/dasbaord-candidates-candidates-list-page.component";
import { DashbaordCandidatesCandidatesDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/candidates/dashboard-candidates-candidates-details-page/dashbaord-candidates-candidates-details-page.component";
import { DashboardCandidatesCompaniesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/companies/dashboard-candidate-companies-list-page/dashboard-candidates-companies-list-page.component";
import { DashboardCandidatesCompaniesDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/companies/dashboard-candidates-companies-details-page/dashboard-candidates-companies-details-page.component";
import { DashboardCandidatesJobOffersDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/job-offers/dashboard-candidates-job-offers-details-page/dashboard-candidates-job-offers-details-page.component";
import { DashboardCandidatesJobOffersListPageComponent } from "@modules/dashboard/submodules/candidates/pages/job-offers/dashboard-candidates-job-offers-list-page/dashboard-candidates-job-offers-list-page.component";
import { DashboardCandidatesApplicationsDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/applications/dashboard-candidates-application-details-page/dashboard-candidates-applications-details-page.component";
import { DashboardCandidatesApplicationsListPageComponent } from "@modules/dashboard/submodules/candidates/pages/applications/dashboard-candidates-applications-list-page/dashboard-candidates-applications-list-page.component";
import { DashboardCandidatesFavoritesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/favorites/dashboard-candidates-favorites-list-page/dashboard-candidates-favorites-list-page.component";
import { DashboardCandidatesFavoritesDetailsPageComponent } from "@modules/dashboard/submodules/candidates/pages/favorites/dashboard candidates-favorites-details-page/dashboard-candidates-favorites-details-page.component";
import { DashboardCandidatesUsersProfilePageComponent } from "@modules/dashboard/submodules/candidates/pages/users/dashboard-candidates-users-profile-page/dashboard-candidates-users-profile-page.component";
import { DashboardCandidateResumesListPageComponent } from "@modules/dashboard/submodules/candidates/pages/resumes/dashboard-candidate-resumes-list-page/dashboard-candidate-resumes-list-page.component";
import { DashboardCandidatesInterviewsListPageComponent } from "./pages/interviews/dashboard-candidates-interviews-list-page/dashboard-candidates-interviews-list-page.component";
import { DashboardCandidatesInterviewsDetailsPageComponent } from "./pages/interviews/dashboard-candidates-interviews-details-page/dashboard-candidates-interviews-details-page.component";
import { DashboardCandidateResumeCreatePageComponent } from "./pages/resumes/dashboard-candidate-resume-create-page/dashboard-candidate-resume-create-page.component";

const routes: Routes = [
  {
    path: ":employerId",
    component: DashboardCandidatesLayoutComponent,
    children: [
      {
        path: "",
        component: DashboardCandidatesComponent,
      },
      {
        path: "companies",
        children: [
          {
            path: "list",
            component: DashboardCandidatesCompaniesListPageComponent,
          },
          {
            path: ":companyId",
            component: DashboardCandidatesCompaniesDetailsPageComponent,
          },
        ],
      },
      {
        path: "job-offers",
        children: [
          {
            path: "list",
            component: DashboardCandidatesJobOffersListPageComponent,
          },

          {
            path: ":jobOffersId",
            component: DashboardCandidatesJobOffersDetailsPageComponent,
          },
        ],
      },
      {
        path: "applications",
        children: [
          {
            path: "list",
            component: DashboardCandidatesApplicationsListPageComponent,
          },

          {
            path: ":applicationId",
            component: DashboardCandidatesApplicationsDetailsPageComponent,
          },
        ],
      },
      {
        path: "subscriptions",
        children: [
          {
            path: "list",
            component: DashboardEmployersSubscriptionsListPageComponent,
          },
        ],
      },
      {
        path: "settings",
        children: [
          {
            path: "",
            component: DashboardEmployersSettingsPageComponent,
          },
        ],
      },

      {
        path: "profile",
        children: [
          {
            path: "account",
            component: DashboardCandidatesUsersProfilePageComponent,
          },
        ],
      },
      {
        path: "users",
        children: [
          {
            path: "list",
            component: DasbaordCandidatesCandidatesListPageComponent,
          },
          {
            path: ":id",
            component: DashbaordCandidatesCandidatesDetailsPageComponent,
          },
        ],
      },
      {
        path: "favorites",
        children: [
          {
            path: "list",
            component: DashboardCandidatesFavoritesListPageComponent,
          },
          {
            path: ":id",
            component: DashboardCandidatesFavoritesDetailsPageComponent,
          },
        ],
      },
      {
        path: "resumes",
        children: [
          {
            path: "list",
            component: DashboardCandidateResumesListPageComponent,
          },
          {
            path: "create",
            component: DashboardCandidateResumeCreatePageComponent,
          },
        ],
      },
      {
        path: "interviews",
        children: [
          {
            path: "list",
            component: DashboardCandidatesInterviewsListPageComponent,
          },
          {
            path: ":interviewId",
            component: DashboardCandidatesInterviewsDetailsPageComponent,
          },
        ],
      },
    ],
  },
  // { path: "", component: DashboardHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardCandidatesRoutingModule {}
