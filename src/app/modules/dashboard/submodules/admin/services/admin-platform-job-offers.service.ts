import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

export interface AdminJobOffer {
  id: string;
  title: string;
  description: string;
  companyId: string;
  companyName?: string;
  status: "PENDING" | "VALIDATED" | "REJECTED" | "DELETED";
  contractType: string;
  isPublished: boolean;
  applicationsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminJobOffersFilter {
  status?: string;
  contractType?: string;
  isPublished?: boolean;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  createdById?: string;
}

export interface AdminJobOffersResponse {
  data: AdminJobOffer[];
  total: number;
  page: number;
  limit: number;
}

@Injectable({
  providedIn: "root",
})
export class AdminPlatformJobOffersService {
  private apiUrl = `${environment.apiUrl}/admin/platform`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère la liste des offres d'emploi en attente (pending)
   */
  getPendingJobOffers(
    filters?: AdminJobOffersFilter,
  ): Observable<AdminJobOffersResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set("status", filters.status);
      if (filters.contractType)
        params = params.set("contractType", filters.contractType);
      if (filters.isPublished !== undefined)
        params = params.set("isPublished", filters.isPublished.toString());
      if (filters.startDate) params = params.set("startDate", filters.startDate);
      if (filters.endDate) params = params.set("endDate", filters.endDate);
      if (filters.page) params = params.set("page", filters.page.toString());
      if (filters.limit) params = params.set("limit", filters.limit.toString());
    }

    return this.http.get<AdminJobOffersResponse>(
      `${this.apiUrl}/job-offers/pending`,
      { params },
    );
  }

  /**
   * Récupère toutes les offres d'emploi
   */
  getAllJobOffers(
    filters?: AdminJobOffersFilter,
  ): Observable<AdminJobOffersResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.status) params = params.set("status", filters.status);
      if (filters.contractType)
        params = params.set("contractType", filters.contractType);
      if (filters.isPublished !== undefined)
        params = params.set("isPublished", filters.isPublished.toString());
      if (filters.startDate) params = params.set("startDate", filters.startDate);
      if (filters.endDate) params = params.set("endDate", filters.endDate);
      if (filters.page) params = params.set("page", filters.page.toString());
      if (filters.limit) params = params.set("limit", filters.limit.toString());
      if (filters.createdById) params = params.set("createdById", filters.createdById);
    }

    return this.http.get<AdminJobOffersResponse>(
      `${this.apiUrl}/job-offers`,
      { params },
    );
  }

  /**
   * Récupère les détails d'une offre d'emploi
   */
  getJobOfferDetail(offerId: string): Observable<AdminJobOffer> {
    return this.http.get<AdminJobOffer>(
      `${this.apiUrl}/job-offers/${offerId}`,
    );
  }

  /**
   * Valide une offre d'emploi
   */
  validateJobOffer(offerId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/job-offers/${offerId}`, {
      status: "VALIDATED",
    });
  }

  /**
   * Rejette une offre d'emploi
   */
  rejectJobOffer(offerId: string, reason?: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/job-offers/${offerId}`, {
      status: "REJECTED",
      rejectReason: reason,
    });
  }

  /**
   * Supprime une offre d'emploi
   */
  deleteJobOffer(offerId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/job-offers/${offerId}`, {
      status: "DELETED",
    });
  }

  /**
   * Publie une offre d'emploi
   */
  publishJobOffer(offerId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/job-offers/${offerId}`, {
      isPublished: true,
    });
  }

  /**
   * Dépublie une offre d'emploi
   */
  unpublishJobOffer(offerId: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/job-offers/${offerId}`, {
      isPublished: false,
    });
  }
}
