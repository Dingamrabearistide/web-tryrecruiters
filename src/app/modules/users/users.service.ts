import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { map, Observable, tap } from "rxjs";
import { environment } from "@env/environment";
import {
  ModuleCreateDto,
  ModuleObject,
  ModuleResponse,
  ModuleRoot,
  ModuleUpdateDto,
  paramDto,
} from "./users.type";
import { BaseParamsQuery } from "../../@1hand/base.type";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  private apiUrl = `${environment.apiUrl}/${ModuleRoot}`;
  private adminApiUrl = `${environment.apiUrl}/admin/platform/${ModuleRoot}`;

  constructor(private http: HttpClient) {}

  selectMany(params: paramDto): Observable<ModuleResponse> {
    const queryParams = this.buildQueryParams(params);
    return this.http.get<ModuleResponse>(`${this.apiUrl}`, { params: queryParams });
  }

  selectById(itemId: string): Observable<ModuleObject> {
    return this.http.get<ModuleObject>(`${this.adminApiUrl}/${itemId}`);
  }

  create(item: ModuleCreateDto): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(`${this.adminApiUrl}`, item);
  }

  update(id: string, item: ModuleUpdateDto): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.adminApiUrl}/${id}`, item);
  }

  delete(dto: string): Observable<void> {
    return this.http.delete<void>(`${this.adminApiUrl}/${dto}`);
  }

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
}
