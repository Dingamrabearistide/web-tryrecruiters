import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import {
  InterviewResponse as ModuleResponse,
  CreateInterviewDto as ModuleCreateDto,
  UpdateInterviewDto as ModuleUpdateDto,
  InterviewDeleteDto as ModuleDeleteDto,
  Interview as ModuleObject,
  RespondToInterviewDto,
  ModuleRoot,
} from "./interview.types";
import { BaseParamsQuery } from "../../@1hand/base.type";

@Injectable({
  providedIn: "root",
})
export class InterviewsService {
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

  selectById(itemId: string): Observable<ModuleObject> {
    return this.http.get<ModuleObject>(`${this.apiUrl}/${itemId}`);
  }

  create(item: ModuleCreateDto): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(`${this.apiUrl}`, item);
  }

  /** PATCH /interviews takes the id inside the body (`interviewId`), not
   * in the URL — there is no PATCH /interviews/:id route on this API. */
  update(id: string, item: ModuleUpdateDto): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.apiUrl}`, {
      interviewId: id,
      ...item,
    });
  }

  delete(dto: ModuleDeleteDto): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto}`);
  }

  cancel(id: string, notes?: string): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.apiUrl}/cancel`, {
      interviewId: id,
      ...(notes ? { notes } : {}),
    });
  }

  respond(payload: RespondToInterviewDto): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.apiUrl}/respond`, payload);
  }

  getHistory(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${id}/history`);
  }

  addToFavorites(jobId: string): Observable<{ success: boolean }> {
    // Simulate a fake request that returns true or false randomly
    return new Observable((observer) => {
      setTimeout(() => {
        const success = Math.random() > 0.3; // 70% chance of success
        observer.next({ success });
        observer.complete();
      }, 1000); // Simulate network delay
    });
  }
}
