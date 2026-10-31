import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import {
  Permission,
  PermissionResponse as ModuleResponse,
  CreatePermissionDto as ModuleCreateDto,
  UpdatePermissionDto as ModuleUpdateDto,
  DeletePermissionDto as ModuleDeleteDto,
  FilterPermissionsDto,
  ModuleRoot,
} from "./permissions.type";
import { BaseParamsQuery } from "../../@1hand/base.type";

@Injectable({
  providedIn: "root",
})
export class PermissionsService {
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

  selectMany(params: BaseParamsQuery): Observable<ModuleResponse> {
    const queryParams = this.buildQueryParams(params);
    return this.http.get<ModuleResponse>(`${this.apiUrl}`, {
      params: queryParams,
    });
  }

  selectById(itemId: string): Observable<Permission> {
    return this.http.get<Permission>(`${this.apiUrl}/${itemId}`);
  }

  create(item: ModuleCreateDto): Observable<Permission> {
    return this.http.post<Permission>(`${this.apiUrl}`, item);
  }

  update(id: string, item: ModuleUpdateDto): Observable<Permission> {
    return this.http.patch<Permission>(`${this.apiUrl}/${id}`, item);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Legacy methods for backward compatibility
  getPermissions(
    filters: FilterPermissionsDto = {}
  ): Observable<ModuleResponse> {
    return this.selectMany(filters);
  }

  getPermissionById(id: string): Observable<Permission> {
    return this.selectById(id);
  }

  createPermission(permission: ModuleCreateDto): Observable<Permission> {
    return this.create(permission);
  }

  updatePermission(
    id: string,
    permission: ModuleUpdateDto
  ): Observable<Permission> {
    return this.update(id, permission);
  }

  deletePermission(id: string): Observable<void> {
    return this.delete(id);
  }
}
