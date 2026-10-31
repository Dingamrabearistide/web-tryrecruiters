import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";

export interface AdminSetting {
  key: string;
  value: any;
  type: "string" | "number" | "boolean" | "json";
  description?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface AdminSettingsResponse {
  data: AdminSetting[];
  total: number;
}

@Injectable({
  providedIn: "root",
})
export class AdminPlatformSettingsService {
  private apiUrl = `${environment.apiUrl}/admin/platform`;

  constructor(private http: HttpClient) {}

  /**
   * Récupère tous les paramètres de configuration
   */
  getAllSettings(
    page?: number,
    limit?: number,
  ): Observable<AdminSettingsResponse> {
    let params = new HttpParams();

    if (page) params = params.set("page", page.toString());
    if (limit) params = params.set("limit", limit.toString());

    return this.http.get<AdminSettingsResponse>(`${this.apiUrl}/settings`, {
      params,
    });
  }

  /**
   * Récupère un paramètre spécifique
   */
  getSetting(key: string): Observable<AdminSetting> {
    return this.http.get<AdminSetting>(`${this.apiUrl}/settings/${key}`);
  }

  /**
   * Met à jour un paramètre
   */
  updateSetting(key: string, value: any): Observable<AdminSetting> {
    return this.http.patch<AdminSetting>(`${this.apiUrl}/settings/${key}`, {
      value,
    });
  }

  /**
   * Crée un nouveau paramètre
   */
  createSetting(
    setting: Omit<AdminSetting, "updatedAt" | "updatedBy">,
  ): Observable<AdminSetting> {
    return this.http.post<AdminSetting>(`${this.apiUrl}/settings`, setting);
  }

  /**
   * Supprime un paramètre
   */
  deleteSetting(key: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/settings/${key}`);
  }
}
