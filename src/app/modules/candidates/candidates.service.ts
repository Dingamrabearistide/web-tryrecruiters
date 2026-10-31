import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import {
  Candidate as ModuleObject,
  CandidateResponse as ModuleResponse,
  DeleteCandidateDto as ModuleDeleteDto,
  DeleteCandidateInfosDto as ModuleInfosDeleteDto,
  ModuleRoot,
  UpdateCandidateDto as ModuleUpdateDto,
} from "./candidates.types";
import { BaseParamsQuery } from "../../@1hand/base.type";

@Injectable({
  providedIn: "root",
})
export class CandidatesService {
  private apiUrl = `${environment.apiUrl}/${ModuleRoot}`;

  constructor(private http: HttpClient) {}

  selectMany(params: BaseParamsQuery): Observable<ModuleResponse> {
    const queryParams = this.buildQueryParams(params);
    return this.http.get<ModuleResponse>(`${this.apiUrl}`, {
      params: queryParams,
    });
  }

  selectById(itemId: string): Observable<ModuleObject> {
    return this.http.get<ModuleObject>(`${this.apiUrl}/${itemId}`);
  }

  create(item: Partial<ModuleUpdateDto>): Observable<ModuleObject> {
    console.log("in service: ", item);
    return this.http.patch<ModuleObject>(`${this.apiUrl}/${item.id}`, item);
  }

  createElement(type: string, id: any, item: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/${type}`, item);
  }

  update(id: string, item: Partial<ModuleUpdateDto>): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.apiUrl}/${id}`, item);
  }

  delete(dto: ModuleDeleteDto): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto}`);
  }

  deleteInfos(dto: ModuleInfosDeleteDto): Observable<ModuleObject> {
    const { id, ...rest } = dto;
    console.log("received dto: ", dto);
    return this.http.delete<ModuleObject>(
      `${this.apiUrl}/${id}/profile/parts`,
      {
        body: rest,
      }
    );
  }

  updateElement(
    type: string,
    id: string,
    item: ModuleUpdateDto
  ): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(`${this.apiUrl}/${id}/`, item);
  }

  getExperience(id: any): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}/experiences`);
  }

  DeleteElement(type: string, candidateId: string, data: any) {
    return this.http.get<any>(`${this.apiUrl}/${candidateId}/experiences`);
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
            httpParams = httpParams.append(key, item); // Si l'API attend plusieurs paramètres "tag"
          });
          // Si l'API attend une chaîne comma-separated:
          // httpParams = httpParams.set(key, (params[key as keyof BaseParamsQuery] as string[]).join(','));
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
