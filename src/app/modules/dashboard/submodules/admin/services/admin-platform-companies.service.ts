import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

export interface AdminCompany {
  id: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  status: "PENDING" | "ACTIVE" | "INACTIVE";
  archived: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCompaniesFilter {
  keyword?: string;
  archived?: boolean;
  deleted?: boolean;
  page?: number;
  limit?: number;
}

export interface AdminCompaniesResponse {
  data: AdminCompany[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: "root",
})
export class AdminPlatformCompaniesService {
  private apiUrl = `${environment.apiUrl}/admin/platform`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des entreprises en attente (pending)
   */
  getPendingCompanies(
    filters?: AdminCompaniesFilter,
  ): Observable<AdminCompaniesResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.keyword) params = params.set("keyword", filters.keyword);
      if (filters.archived !== undefined)
        params = params.set("archived", filters.archived.toString());
      if (filters.deleted !== undefined)
        params = params.set("deleted", filters.deleted.toString());
      if (filters.page) params = params.set("page", filters.page.toString());
      if (filters.limit) params = params.set("limit", filters.limit.toString());
    }

    return this.http.get<AdminCompaniesResponse>(
      `${this.apiUrl}/companies/pending`,
      { params },
    );
  }

  /**
   * Récupère toutes les entreprises
   */
  getAllCompanies(
    filters?: AdminCompaniesFilter,
  ): Observable<AdminCompaniesResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.keyword) params = params.set("keyword", filters.keyword);
      if (filters.archived !== undefined)
        params = params.set("archived", filters.archived.toString());
      if (filters.deleted !== undefined)
        params = params.set("deleted", filters.deleted.toString());
      if (filters.page) params = params.set("page", filters.page.toString());
      if (filters.limit) params = params.set("limit", filters.limit.toString());
    }

    return this.http.get<AdminCompaniesResponse>(`${this.apiUrl}/companies`, {
      params,
    });
  }

  /**
   * Récupère les détails d'une entreprise
   */
  getCompanyDetail(companyId: string): Observable<AdminCompany> {
    return this.http.get<AdminCompany>(
      `${this.apiUrl}/companies/${companyId}`,
    );
  }

  /**
   * Active une entreprise
   */
  activateCompany(companyId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/companies/${companyId}`, {
      status: "ACTIVE",
    });
  }

  /**
   * Désactive une entreprise
   */
  deactivateCompany(companyId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/companies/${companyId}`, {
      status: "INACTIVE",
    });
  }

  /**
   * Archive une entreprise
   */
  archiveCompany(companyId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/companies/${companyId}`, {
      archived: true,
    });
  }

  /**
   * Marque une entreprise comme supprimée
   */
  deleteCompany(companyId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/companies/${companyId}`, {
      deleted: true,
    });
  }
}
