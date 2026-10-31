import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, map, of, catchError } from "rxjs";
import { environment } from "@env/environment";
import {
  DashboardAdminStatsService,
  type AdminPlatformStats,
} from "./dashboard-admin-stats.service";
import { AdminPlatformUsersService } from "./admin-platform-users.service";
import { AdminPlatformCompaniesService } from "./admin-platform-companies.service";
import { AdminPlatformJobOffersService } from "./admin-platform-job-offers.service";

export interface AdminDashboardOverview {
  stats: AdminPlatformStats;
  pendingUsersCount: number;
  pendingCompaniesCount: number;
  pendingJobOffersCount: number;
  recentActivities: any[];
}

/**
 * Service pour agréger les données du dashboard admin
 * Combine les stats avec les données de modération en attente
 */
@Injectable({
  providedIn: "root",
})
export class AdminDashboardFacadeService {
  private apiUrl = `${environment.apiUrl}/admin/platform`;

  constructor(
    private http: HttpClient,
    private statsService: DashboardAdminStatsService,
    private usersService: AdminPlatformUsersService,
    private companiesService: AdminPlatformCompaniesService,
    private jobOffersService: AdminPlatformJobOffersService,
  ) {}

  /**
   * Récupère les données complètes du dashboard overview
   * Combine les statistiques avec les éléments en attente de modération
   */
  getDashboardOverview(): Observable<AdminDashboardOverview> {
    return forkJoin({
      stats: this.statsService.getAdminStats(),
      pendingUsers: this.usersService
        .getUsers({ limit: 1000 })
        .pipe(catchError(() => of({ data: [], total: 0 }))),
      pendingCompanies: this.companiesService
        .getPendingCompanies({ limit: 1000 })
        .pipe(catchError(() => of({ data: [], total: 0 }))),
      pendingJobOffers: this.jobOffersService
        .getPendingJobOffers({ limit: 1000 })
        .pipe(catchError(() => of({ data: [], total: 0 }))),
    }).pipe(
      map(({ stats, pendingUsers, pendingCompanies, pendingJobOffers }) => ({
        stats,
        pendingUsersCount: pendingUsers.total || 0,
        pendingCompaniesCount: pendingCompanies.total || 0,
        pendingJobOffersCount: pendingJobOffers.total || 0,
        recentActivities: [],
      })),
    );
  }

  /**
   * Récupère les statistiques uniquement
   */
  getStats(): Observable<AdminPlatformStats> {
    return this.statsService.getAdminStats();
  }
}
