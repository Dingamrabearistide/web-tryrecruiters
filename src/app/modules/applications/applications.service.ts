import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import {
  ApplicationResponse as ModuleResponse,
  CreateApplicationDto as ModuleCreateDto,
  UpdateApplicationDto as ModuleUpdateDto,
  DeleteApplicationDto as ModuleDeleteDto,
  Application as ModuleObject,
  FilterApplicationsDto,
  ModuleRoot,
} from "./applications.types";
import { BaseParamsQuery } from "../../@1hand/base.type";

@Injectable({
  providedIn: "root",
})
export class ApplicationsService {
  private apiUrl = `${environment.apiUrl}/${ModuleRoot}`;
  constructor(private http: HttpClient) {}

  private buildQueryParams(params: BaseParamsQuery): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (
        params.hasOwnProperty(key) &&
        params[key as keyof BaseParamsQuery] !== undefined &&
        params[key as keyof BaseParamsQuery] !== null &&
        params[key as keyof BaseParamsQuery] !== ""
      ) {
        if (Array.isArray(params[key as keyof BaseParamsQuery])) {
          (params[key as keyof BaseParamsQuery] as string[]).forEach((item) => {
            httpParams = httpParams.append(key, item);
          });
        } else {
          httpParams = httpParams.set(
            key,
            String(params[key as keyof BaseParamsQuery])
          );
        }
      }
    }
    return httpParams;
  }

  selectMany(params: FilterApplicationsDto): Observable<ModuleResponse> {
    const queryParams = this.buildQueryParams(params);
    return this.http.get<ModuleResponse>(`${this.apiUrl}`, {
      params: queryParams,
    });
  }

  selectById(itemId: string): Observable<ModuleObject> {
    return this.http.get<ModuleObject>(`${this.apiUrl}/${itemId}`);
  }

  create(item: any): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(`${this.apiUrl}`, item);
  }

  update(id: string, item: ModuleUpdateDto): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.apiUrl}/${id}`, item);
  }

  getHistory(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/history`);
  }

    delete(dto: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto}`);
  }

  // Legacy methods for backward compatibility
  apply(accountId: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${accountId}/apply`, data);
  }

  updateStatus(id: string, data: any): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/status`, data);
  }

  getCandidateApplications(accountId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/candidate/${accountId}`);
  }

  getJobApplications(jobOfferId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/job/${jobOfferId}`);
  }

  deleteApplication(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
