import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

export interface AdminPlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalCompanies: number;
  totalJobOffers: number;
  pendingApplications: number;
  newUsersThisMonth: number;
  newCompaniesThisMonth: number;
  newJobOffersThisMonth: number;
}

export interface AdminStatsResponse {
  data: AdminPlatformStats;
}

@Injectable({
  providedIn: "root",
})
export class DashboardAdminStatsService {
  private apiUrl = `${environment.apiUrl}/admin/platform`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère les statistiques principales du dashboard admin
   * Retourne 8 cartes de KPIs:
   * - Total Users
   * - Active Users
   * - Total Companies
   * - Total Job Offers
   * - Pending Applications
   * - New Users This Month
   * - New Companies This Month
   * - New Job Offers This Month
   */
  getAdminStats(): Observable<AdminPlatformStats> {
    return this.http.get<AdminPlatformStats>(`${this.apiUrl}/stats`);
  }

  /**
   * Récupère les statistiques avec réponse wrapper
   */
  getAdminStatsResponse(): Observable<AdminStatsResponse> {
    return this.http.get<AdminStatsResponse>(`${this.apiUrl}/stats`);
  }
}
