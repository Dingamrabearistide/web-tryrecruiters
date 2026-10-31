import { Injectable } from "@angular/core";
import { DashboardAdminStatsService } from "./dashboard-admin-stats.service";
import { AdminPlatformUsersService } from "./admin-platform-users.service";
import { AdminPlatformCompaniesService } from "./admin-platform-companies.service";
import { AdminPlatformJobOffersService } from "./admin-platform-job-offers.service";
import { AdminPlatformSettingsService } from "./admin-platform-settings.service";

/**
 * Service agrégé pour l'administration de la plateforme
 * Fournit un point d'accès centralisé à tous les services admin
 */
@Injectable({
  providedIn: "root",
})
export class AdminPlatformService {
  constructor(
    public stats: DashboardAdminStatsService,
    public users: AdminPlatformUsersService,
    public companies: AdminPlatformCompaniesService,
    public jobOffers: AdminPlatformJobOffersService,
    public settings: AdminPlatformSettingsService,
  ) {}
}
