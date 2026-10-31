import { CommonModule, DatePipe } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
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
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { GenericErrorComponent } from "../../../../@1hand/components/generic-error/generic-error.component";
import { CoreModule } from "../../../core/core.module";
import { SharedModule } from "../../../shared/shared.module";
import { DashboardNavbarComponent } from "../../layout/dashboard-navbar/dashboard-navbar.component";
import { CountrySelectComponent } from "../../../../@1hand/components/country-select/country-select.component";

import {
  EmployersModule,
  loader as EmployerLoader,
} from "@modules/employers/employers.module";

import {
  DashboardModule,
  loader as DashboardLoader,
} from "@modules/dashboard/dashboard.module";

import {
  CandidatesModule,
  loader as CandidatesLoader,
} from "@modules/candidates/candidates.module";
import {
  InterviewModule,
  loader as InterviewsLoader,
} from "@modules/interview/interview.module";
import { SupportedLanguages } from "../../../../transloco-loader";
import { MatDialogModule } from "@angular/material/dialog";
import { DashboardAdminLayoutComponent } from "./layout/dashboard-admin-layout.component";
import { DashboardAdminComponent } from "./dashboard-admin.component";
import { DashboardAdminRoutingModule } from "./dashboard-admin-routing.module";
import { DashboardAdminApplicationsListPageComponent } from "@modules/dashboard/submodules/admin/pages/applications/dashboard-employers-applications-list-page/dashboard-admin-applications-list-page.component";
import { DashboardAdminApplicationsDetailsPageComponent } from "@modules/dashboard/submodules/admin/pages/applications/dashboard-employers-application-details-page/dashboard-admin-applications-details-page.component";
import { DashboardAdminJobOffersUpdatePageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offers-update-page/dashboard-admin-job-offers-update-page.component";
import { DashboardAdminJobsOffersCreatePageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offers-create-page/dashboard-admin-jobs-offers-create-page.component";
import { DashboardAdminJobOffersDetailsPageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offer-details-page/dashboard-admin-job-offers-details-page.component";
import { DashboardAdminJobOffersListPageComponent } from "@modules/dashboard/submodules/admin/pages/job-offers/dashboard-admin-job-offers-list-page/dashboard-admin-job-offers-list-page.component";
import { DashboardAdminCompaniesListPageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-list-page/dashboard-admin-companies-list-page.component";
import { DashboardAdminCompanyCreatePageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-create-page/dashboard-admin-company-create-page.component";
import { DashboardAdminCompaniesUpdatePageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-update-page/dashboard-admin-companies-update-page.component";
import { DashboardAdminCompaniesDetailPageComponent } from "@modules/dashboard/submodules/admin/pages/companies/dashboard-admin-companies-details-page/dashboard-admin-companies-detail-page.component";
import { DashboardAdminUsersListPageComponent } from "@modules/dashboard/submodules/admin/pages/users/dashboard-users-companies-list-page/dashboard-admin-users-list-page.component";
import { DashboardUsersCompaniesDetailsPageComponent } from "./pages/users/dashboard-users-companies-details-page/dashboard-users-companies-details-page.component";
import { DashboardAdminUsersUpdatePageComponent } from "./pages/users/dashboard-admin-users-update-page/dashboard-admin-users-update-page.component";
import { DashboardAdminInterviewsDetailsPageComponent } from "./pages/interviews/dashboard-admin-interviews-details-page/dashboard-admin-interviews-details-page.component";
import { DashboardAdminInterviewsListPageComponent } from "./pages/interviews/dashboard-admin-interviews-list-page/dashboard-admin-interviews-list-page.component";
import { DashboardPermissionsListPageComponent } from "./pages/permissions/dashboard-permissions-list-page/dashboard-permissions-list-page.component";
import { DashboardPermissionsCreatePageComponent } from "./pages/permissions/dashboard-permissions-create-page/dashboard-permissions-create-page.component";
import { DashboardPermissionsUpdatePageComponent } from "./pages/permissions/dashboard-permissions-update-page/dashboard-permissions-update-page.component";
import { DashboardPermissionsDetailPageComponent } from "./pages/permissions/dashboard-permissions-detail-page/dashboard-permissions-detail-page.component";
import { UsersModule } from "@modules/users/users.module";
import { UsersDetailComponent } from "@modules/users/components/users-detail/users-detail.component";
import { PermissionsModule } from "@modules/permissions/permissions.module";
import { DashboardAdminOverviewPageComponent } from "./pages/overview/dashboard-admin-overview-page.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce(
    (acc, lang) => {
      acc[lang] = () => import(`./i18n/${lang}.json`);
      return acc;
    },
    {} as Record<string, () => Promise<Translation>>,
  );

@NgModule({
  declarations: [
    // Layout
    DashboardAdminLayoutComponent,
    DashboardAdminComponent,

    //pages
    //applications
    DashboardAdminApplicationsListPageComponent,
    DashboardAdminApplicationsDetailsPageComponent,

    //job-offers
    DashboardAdminJobOffersUpdatePageComponent,
    DashboardAdminJobsOffersCreatePageComponent,
    DashboardAdminJobOffersDetailsPageComponent,
    DashboardAdminJobOffersListPageComponent,

    //companies
    DashboardAdminCompanyCreatePageComponent,
    DashboardAdminCompaniesListPageComponent,
    DashboardAdminCompaniesDetailPageComponent,
    DashboardAdminCompaniesUpdatePageComponent,

    //users
    UsersDetailComponent,
    DashboardAdminUsersListPageComponent,
    DashboardUsersCompaniesDetailsPageComponent,
    DashboardAdminUsersUpdatePageComponent,
    DashboardAdminInterviewsDetailsPageComponent,
    DashboardAdminInterviewsListPageComponent,

    //permissions
    DashboardPermissionsListPageComponent,
    DashboardPermissionsCreatePageComponent,
    DashboardPermissionsUpdatePageComponent,
    DashboardPermissionsDetailPageComponent,
  ],
  imports: [
    CommonModule,
    DatePipe,
    DashboardAdminRoutingModule,
    DashboardAdminOverviewPageComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CompagniesModule,
    JobOfferModule,
    ApplicationsModule,
    EmployersModule,
    CoreModule,
    UsersModule,
    SharedModule,
    MatDialogModule,
    JobOfferModule,
    CompagniesModule,
    ApplicationsModule,
    CandidatesModule,
    InterviewModule,
    PermissionsModule,
    TranslocoModule,

    // StandAlone component
    DashboardNavbarComponent,
    CountrySelectComponent,
    GenericErrorComponent,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "dashboardadmin",
        loader: DashboardLoader,
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
export class DashboardAdminModule {}
