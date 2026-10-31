import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import {
  ResumeResponse as ModuleResponse,
  CreateResumeDto as ModuleCreateDto,
  UpdateResumeDto as ModuleUpdateDto,
  ResumeDeleteDto as ModuleDeleteDto,
  Resume as ModuleObject,
  ModuleRoot,
} from "./resumes.types";
import { BaseParamsQuery } from "../../@1hand/base.type";

@Injectable({
  providedIn: "root",
})
export class ResumesService {
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
        } else if (typeof params[key as keyof BaseParamsQuery] === 'boolean') {
          httpParams = httpParams.set(key, params[key as keyof BaseParamsQuery] as boolean);
        } else {
          httpParams = httpParams.set(
            key,
            String(params[key as keyof BaseParamsQuery]),
          );
        }
      }
    }
    return httpParams;
  }

  selectMany(params: BaseParamsQuery): Observable<ModuleResponse> {
    const { isDefault, ...rest } = params as any;
    const queryParams = this.buildQueryParams(rest);
    let url = `${this.apiUrl}?${queryParams.toString()}`;
    if (isDefault !== undefined && isDefault !== null && isDefault !== '') {
      url += `&isDefault=${isDefault}`;
    }
    return this.http.get<ModuleResponse>(url);
  }

  selectById(itemId: string): Observable<ModuleObject> {
    return this.http.get<ModuleObject>(`${this.apiUrl}/${itemId}`);
  }

  create(item: ModuleCreateDto): Observable<ModuleObject> {
    // const formData = new FormData();
    // formData.append("name", item.name);
    // formData.append("file", item.res);
    // formData.append("candidateId", item.candidateId);
    // if (item.isDefault !== undefined) {
    //   formData.append("isDefault", String(item.isDefault));
    // }
    return this.http.post<ModuleObject>(`${this.apiUrl}`, item);
  }

  update(id: string, item: ModuleUpdateDto): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.apiUrl}/${id}`, item);
  }

  delete(dto: ModuleDeleteDto): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto}`);
  }

  setDefaultResume(resumeId: string): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(
      `${this.apiUrl}/${resumeId}/default`,
      {},
    );
  }

  downloadResume(resumeId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${resumeId}/download`, {
      responseType: "blob",
    });
  }

  // Legacy methods for backward compatibility
  // uploadResume(accountId: string, data: any): Observable<any> {
  //   return this.create({
  //     name: data.name,
  //     file: data.file,
  //     accountId: accountId,
  //     isDefault: data.isDefault,
  //   });
  // }

  getResumes(accountId: string): Observable<any> {
    return this.selectMany({ accountId: accountId });
  }

  updateResume(id: string, data: any): Observable<any> {
    return this.update(id, data);
  }

  deleteResume(id: string): Observable<any> {
    return this.delete(id);
  }
}
