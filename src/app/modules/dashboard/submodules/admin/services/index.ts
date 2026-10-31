/**
 * Services Admin Platform
 * Exporte tous les services pour l'administration de la plateforme
 */

export {
  DashboardAdminStatsService,
  type AdminPlatformStats,
} from "./dashboard-admin-stats.service";
export {
  AdminPlatformUsersService,
  type AdminUser,
  type AdminUsersFilter,
  type AdminUsersResponse,
} from "./admin-platform-users.service";
export {
  AdminPlatformCompaniesService,
  type AdminCompany,
  type AdminCompaniesFilter,
  type AdminCompaniesResponse,
} from "./admin-platform-companies.service";
export {
  AdminPlatformJobOffersService,
  type AdminJobOffer,
  type AdminJobOffersFilter,
  type AdminJobOffersResponse,
} from "./admin-platform-job-offers.service";
export {
  AdminPlatformSettingsService,
  type AdminSetting,
  type AdminSettingsResponse,
} from "./admin-platform-settings.service";
export { AdminPlatformService } from "./admin-platform.service";
export {
  AdminDashboardFacadeService,
  type AdminDashboardOverview,
} from "./admin-dashboard-facade.service";
