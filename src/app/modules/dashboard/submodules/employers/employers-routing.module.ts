import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DashboardEmployersApplicationsListPageComponent } from "./pages/applications/dashboard-employers-applications-list-page/dashboard-employers-applications-list-page.component";

import { EmployersComponent } from "./employers.component";
import { DashboardEmployersCompaniesDetailPageComponent } from "./pages/companies/dashboard-employers-companies-detail-page/dashboard-employers-companies-detail-page.component";
import { DashboardEmployersCompaniesListPageComponent } from "./pages/companies/dashboard-employers-companies-list-page/dashboard-employers-companies-list-page.component";
import { DashboardEmployersCompaniesUpdatePageComponent } from "./pages/companies/dashboard-employers-companies-update-page/dashboard-employers-companies-update-page.component";
import { DashboardEmployerJobOffersListPageComponent } from "./pages/job-offers/dashboard-employer-job-offers-list-page/dashboard-employer-job-offers-list-page.component";
import { DashboardEmployerInterviewsListPageComponent } from "./pages/interviews/dashboard-employer-interviews-list-page/dashboard-employer-interviews-list-page.component";
import { DashboardEmployersSettingsPageComponent } from "./pages/settings/dashboard-employers-settings-page/dashboard-employers-settings-page.component";


import { EmployersDashboardComponent } from "./layout/employers-dashboard.component";
import { DashboardEmployersApplicationsDetailsPageComponent } from "./pages/applications/dashboard-employers-application-details-page/dashboard-employers-applications-details-page.component";
import { DashboardEmployersCompanyCreatePageComponent } from "./pages/companies/dashboard-employers-companies-create-page/dashboard-employers-company-create-page.component";
import { DashboardEmployerJobsOffersCreatePageComponent } from "./pages/job-offers/dashboard-employer-job-offers-create-page/dashboard-employer-jobs-offers-create-page.component";
import { DashboardEmployerJobOffersUpdatePageComponent } from "./pages/job-offers/dashboard-employer-job-offers-update-page/dashboard-employer-job-offers-update-page.component";
import { DashboardEmployersJobOffersDetailsPageComponent } from "./pages/job-offers/dashboard-employer-job-offer-details/dashboard-employers-job-offers-details-page.component";
import { CandidatesListPageComponent } from "@modules/candidates/pages/candidates-list-page/candidates-list-page.component";
import { CandidatesDetailsPageComponent } from "@modules/candidates/pages/candidates-details-page/candidates-details-page.component";
import { CandidatesUpdatePageComponent } from "@modules/candidates/pages/candidates-update-page/candidates-update-page.component";
import { CandidatesCreatePageComponent } from "@modules/candidates/pages/candidates-create-page/candidates-create-page.component";
import { DashboardEmployersInterviewsDetailsPageComponent } from "./pages/interviews/dashboard-employers-interviews-details-page/dashboard-employers-interviews-details-page.component";
import { DashboardEmployersHomeComponent } from "./pages/dashboard-employers-home/dashboard-employers-home.component";
import { billingAccessGuard } from "../../../../@1hand/modules/billings/access/billing-access.guard";
import { PROJECT_BILLING_ACCESS_CONFIG } from "../../../../@1hand/modules/billings/access/billing-access.config";


const routes: Routes = [
  {
    path: ":employerId",
    component: EmployersDashboardComponent,
    children: [
      {
        path: "",
        component: DashboardEmployersHomeComponent, //EmployersComponent,
      },
      {
        path: "companies",
        children: [
          {
            path: "create",
            component: DashboardEmployersCompanyCreatePageComponent,
            canActivate: [billingAccessGuard(PROJECT_BILLING_ACCESS_CONFIG)],
          },
          {
            path: "list",
            component: DashboardEmployersCompaniesListPageComponent,
          },
          {
            path: ":companyId",
            component: DashboardEmployersCompaniesDetailPageComponent,
          },
          {
            path: "edit/:companyId",
            component: DashboardEmployersCompaniesUpdatePageComponent,
          },
        ],
      },
      {
        path: "job-offers",
        children: [
          {
            path: "create",
            component: DashboardEmployerJobsOffersCreatePageComponent,
            canActivate: [billingAccessGuard(PROJECT_BILLING_ACCESS_CONFIG)],
          },
          {
            path: "list",
            component: DashboardEmployerJobOffersListPageComponent,
          },

          {
            path: ":jobOffersId",
            component: DashboardEmployersJobOffersDetailsPageComponent,
          },
          {
            path: "edit/:jobOffersId",
            component: DashboardEmployerJobOffersUpdatePageComponent,
          },
        ],
      },
      {
        path: "applications",
        children: [
          {
            path: "list",
            component: DashboardEmployersApplicationsListPageComponent,
          },

          {
            path: ":applicationId",
            component: DashboardEmployersApplicationsDetailsPageComponent,
          },
        ],
      },
      {
        path: "interviews",
        children: [
          {
            path: "list",
            component: DashboardEmployerInterviewsListPageComponent,
          },
          {
            path: "create",
            component: DashboardEmployerInterviewsListPageComponent,
            canActivate: [billingAccessGuard(PROJECT_BILLING_ACCESS_CONFIG)],
          },
          {
            path: ":interviewId",
            component: DashboardEmployersInterviewsDetailsPageComponent,
          },
        ],
      },
      // {
      //   path: "categories",
      //   children: [
      //     {
      //       path: "list",
      //       component: CategoriesListPageComponent,
      //     },
      //     {
      //       path: "create",
      //       component: DashboardEmployersCategoryUpdatePageComponent,
      //     },
      //     {
      //       path: "edit/:id",
      //       component: DashboardEmployersCategoryUpdatePageComponent,
      //     },
      //   ],
      // },
      // {
      //   path: "users",
      //   children: [
      //     {
      //       path: "list",
      //       component: UsersListComponent,
      //     },
      //     {
      //       path: ":id",
      //       component: UsersDetailsComponent,
      //     },
      //   ],
      // },
      {
        path: "billings",
        loadChildren: () =>
          import("../../../../@1hand/modules/billings/billings.module").then(
            (m) => m.BillingsModule,
          ),
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
        path: "users",
        children: [
          {
            path: "create",
            component: CandidatesCreatePageComponent,
          },
          {
            path: "list",
            component: CandidatesListPageComponent,
          },
          {
            path: ":id",
            component: CandidatesDetailsPageComponent,
          },
          {
            path: "edit/:id",
            component: CandidatesUpdatePageComponent,
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
export class EmployersRoutingModule {}
