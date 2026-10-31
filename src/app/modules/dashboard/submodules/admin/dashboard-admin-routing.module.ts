import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CandidatesCreatePageComponent } from "@modules/candidates/pages/candidates-create-page/candidates-create-page.component";
import { CandidatesUpdatePageComponent } from "@modules/candidates/pages/candidates-update-page/candidates-update-page.component";
import { CandidatesDetailsPageComponent } from "@modules/home/pages";
import { DashboardEmployersSettingsPageComponent } from "../employers/pages/settings/dashboard-employers-settings-page/dashboard-employers-settings-page.component";
import { DashboardEmployersSubscriptionsListPageComponent } from "../employers/pages/subscriptions/dashboard-employers-subscriptions-list-page/dashboard-employers-subscriptions-list-page.component";
import { DashboardAdminLayoutComponent } from "./layout/dashboard-admin-layout.component";
import { DashboardAdminComponent } from "./dashboard-admin.component";
import { DashboardAdminApplicationsListPageComponent } from "@modules/dashboard/submodules/admin/pages/applications/dashboard-employers-applications-list-page/dashboard-admin-applications-list-page.component";
import { DashboardAdminApplicationsDetailsPageComponent } from "@modules/dashboard/submodules/admin/pages/applications/dashboard-employers-application-details-page/dashboard-admin-applications-details-page.component";
import { DashboardAdminJobOffersUpdatePageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offers-update-page/dashboard-admin-job-offers-update-page.component";
import { DashboardAdminJobsOffersCreatePageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offers-create-page/dashboard-admin-jobs-offers-create-page.component";
import { DashboardAdminJobOffersListPageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offers-list-page/dashboard-admin-job-offers-list-page.component";
import { DashboardAdminJobOffersDetailsPageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offer-details-page/dashboard-admin-job-offers-details-page.component";
import { DashboardAdminCompanyCreatePageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-create-page/dashboard-admin-company-create-page.component";
import { DashboardAdminCompaniesDetailPageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-details-page/dashboard-admin-companies-detail-page.component";
import { DashboardAdminCompaniesUpdatePageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-update-page/dashboard-admin-companies-update-page.component";
import { DashboardAdminCompaniesListPageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-list-page/dashboard-admin-companies-list-page.component";
import { DashboardAdminUsersListPageComponent } from "@modules/dashboard/submodules/admin/pages/users/dashboard-users-companies-list-page/dashboard-admin-users-list-page.component";
import { DashboardUsersCompaniesDetailsPageComponent } from "./pages/users/dashboard-users-companies-details-page/dashboard-users-companies-details-page.component";
import { DashboardAdminUsersUpdatePageComponent } from "./pages/users/dashboard-admin-users-update-page/dashboard-admin-users-update-page.component";
import { DashboardAdminInterviewsDetailsPageComponent } from "./pages/interviews/dashboard-admin-interviews-details-page/dashboard-admin-interviews-details-page.component";
import { DashboardAdminInterviewsListPageComponent } from "./pages/interviews/dashboard-admin-interviews-list-page/dashboard-admin-interviews-list-page.component";
import { DashboardPermissionsListPageComponent } from "./pages/permissions/dashboard-permissions-list-page/dashboard-permissions-list-page.component";
import { DashboardPermissionsCreatePageComponent } from "./pages/permissions/dashboard-permissions-create-page/dashboard-permissions-create-page.component";
import { DashboardPermissionsUpdatePageComponent } from "./pages/permissions/dashboard-permissions-update-page/dashboard-permissions-update-page.component";
import { DashboardPermissionsDetailPageComponent } from "./pages/permissions/dashboard-permissions-detail-page/dashboard-permissions-detail-page.component";
import { DashboardAdminOverviewPageComponent } from "./pages/overview/dashboard-admin-overview-page.component";

const routes: Routes = [
  {
    path: ":employerId",
    component: DashboardAdminLayoutComponent,
    children: [
      {
        path: "",
        component: DashboardAdminComponent,
      },
      {
        path: "overwiew",
        component: DashboardAdminOverviewPageComponent,
      },
      {
        path: "companies",
        children: [
          // {
          //   path: "create",
          //   component: DashboardAdminCompanyCreatePageComponent,
          // },
          {
            path: "list",
            component: DashboardAdminCompaniesListPageComponent,
          },
          {
            path: ":companyId",
            component: DashboardAdminCompaniesDetailPageComponent,
          },
          // {
          //   path: "edit/:companyId",
          //   component: DashboardAdminCompaniesUpdatePageComponent,
          // },
        ],
      },
      {
        path: "job-offers",
        children: [
          // {
          //   path: "create",
          //   component: DashboardAdminJobsOffersCreatePageComponent,
          // },
          {
            path: "list",
            component: DashboardAdminJobOffersListPageComponent,
          },

          {
            path: ":jobOffersId",
            component: DashboardAdminJobOffersDetailsPageComponent,
          },
          // {
          //   path: "edit/:jobOffersId",
          //   component: DashboardAdminJobOffersUpdatePageComponent,
          // },
        ],
      },
      {
        path: "applications",
        children: [
          {
            path: "list",
            component: DashboardAdminApplicationsListPageComponent,
          },

          {
            path: ":applicationId",
            component: DashboardAdminApplicationsDetailsPageComponent,
          },
        ],
      },
      {
        path: "interviews",
        children: [
          {
            path: "list",
            component: DashboardAdminInterviewsListPageComponent,
          },
          {
            path: ":interviewId",
            component: DashboardAdminInterviewsDetailsPageComponent,
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
        path: "users",
        children: [
          {
            path: "list",
            component: DashboardAdminUsersListPageComponent,
          },
          {
            path: ":id",
            component: DashboardUsersCompaniesDetailsPageComponent,
          },
          // {
          //   path: "edit/:id",
          //   component: DashboardAdminUsersUpdatePageComponent,
          // },
        ],
      },
      // {
      //   path: "permissions",
      //   children: [
      //     {
      //       path: "list",
      //       component: DashboardPermissionsListPageComponent,
      //     },
      //     {
      //       path: "create",
      //       component: DashboardPermissionsCreatePageComponent,
      //     },
      //     {
      //       path: ":id",
      //       component: DashboardPermissionsDetailPageComponent,
      //     },
      //     {
      //       path: "edit/:id",
      //       component: DashboardPermissionsUpdatePageComponent,
      //     },
      //     {
      //       path: "",
      //       redirectTo: "list",
      //       pathMatch: "full",
      //     },
      //   ],
      // },
    ],
  },
  // { path: "", component: DashboardHomeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardAdminRoutingModule {}
