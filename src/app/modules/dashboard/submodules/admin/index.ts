/**
 * Admin Platform Module - Exports
 *
 * Ce fichier exporte tous les services et composants du module admin
 * pour faciliter leur utilisation dans le reste de l'application
 */

import { DashboardAdminOverviewPageComponent } from "./pages/overview/dashboard-admin-overview-page.component";
import { DashboardAdminUsersListPageComponent } from "./pages/users/dashboard-admin-users-list-page.component";
import { DashboardAdminCompaniesListPageComponent } from "./pages/companies/dashboard-admin-companies-moderation-list-page.component";
import { DashboardAdminJobOffersListPageComponent } from "./pages/job-offers/dashboard-admin-job-offers-moderation-list-page.component";
import { DashboardAdminSettingsPageComponent } from "./pages/permissions/dashboard-admin-settings-page.component";
import { SettingsEditDialogComponent } from "./pages/permissions/settings-edit-dialog.component";

// Services
export * from "./services";

// Components
export { DashboardAdminOverviewPageComponent };
export { DashboardAdminUsersListPageComponent };
export { DashboardAdminCompaniesListPageComponent };
export { DashboardAdminJobOffersListPageComponent };
export { DashboardAdminSettingsPageComponent };
export { SettingsEditDialogComponent };

// Utility
export { BaseAdminListComponent } from "./pages/base-admin-list.component";
export { AdminListStateService } from "./services/admin-list-state.service";
