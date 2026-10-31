import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CANDIDATE" | "EMPLOYER" | "ADMIN";
  archived: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface AdminUsersFilter {
  search?: string;
  role?: string;
  gender?: string;
  emailConfirmed?: boolean | string;
  city?: string;
  region?: string;
  deleted?: boolean | string;
  archived?: boolean | string;
  page?: number;
  limit?: number;
}

export interface AdminUsersResponse {
  data: AdminUser[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: "root",
})
export class AdminPlatformUsersService {
  private apiUrl = `${environment.apiUrl}/admin/platform`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des utilisateurs avec filtres
   */
  getUsers(filters?: AdminUsersFilter): Observable<AdminUsersResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.search) params = params.set('search', filters.search);
      if (filters.role) params = params.set('role', filters.role);
      if (filters.gender) params = params.set('gender', filters.gender);
      if (filters.emailConfirmed !== undefined && filters.emailConfirmed !== '')
        params = params.set('emailConfirmed', filters.emailConfirmed.toString());
      if (filters.city) params = params.set('city', filters.city);
      if (filters.region) params = params.set('region', filters.region);
      if (filters.deleted !== undefined && filters.deleted !== '')
        params = params.set('deleted', filters.deleted.toString());
      if (filters.archived !== undefined && filters.archived !== '')
        params = params.set('archived', filters.archived.toString());
      if (filters.page) params = params.set('page', filters.page.toString());
      if (filters.limit) params = params.set('limit', filters.limit.toString());
    }

    return this.http.get<AdminUsersResponse>(`${this.apiUrl}/users`, { params });
  }

  /**
   * Récupère les détails d'un utilisateur spécifique
   */
  getUserDetail(userId: string): Observable<AdminUser> {
    return this.http.get<AdminUser>(`${this.apiUrl}/users/${userId}`);
  }

  /**
   * Bloque un utilisateur (PATCH /admin/platform/users/:id { archived: true })
   */
  blockUser(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, {
      archived: true,
    });
  }

  /**
   * Débloque un utilisateur (PATCH /admin/platform/users/:id { archived: false })
   */
  unblockUser(userId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/users/${userId}`, {
      archived: false,
    });
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }
}
