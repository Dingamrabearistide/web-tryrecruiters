import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import {
  JobOfferResponse as ModuleResponse,
  CreateJobOfferDto as ModuleCreateDto,
  UpdateJobOfferDto as ModuleUpdateDto,
  DeleteJobOfferDto as ModuleDeleteDto,
  JobOffer as ModuleObject,
  Currency,
  ModuleRoot,
} from "./job-offers.types";
import { BaseParamsQuery } from "../../@1hand/base.type";
import { AuthService } from "@modules/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class JobOffersService {
  private apiUrl = `${environment.apiUrl}/${ModuleRoot}`;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

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
            String(params[key as keyof BaseParamsQuery]),
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

  /** GET /job-offers/mine — server-scoped to the connected recruiter's
   * own company job offers (all statuses), used for the "Job offer"
   * filter dropdown on the applications list. */
  selectMine(params: BaseParamsQuery = {}): Observable<ModuleResponse> {
    const queryParams = this.buildQueryParams(params);
    return this.http.get<ModuleResponse>(`${this.apiUrl}/mine`, {
      params: queryParams,
    });
  }

  selectManyPublic(params: BaseParamsQuery): Observable<ModuleResponse> {
    const queryParams = this.buildQueryParams(params);
    return this.http.get<ModuleResponse>(`${this.apiUrl}`, {
      params: queryParams,
      headers: { skip: 'true' },
    });
  }

  selectById(itemId: string): Observable<ModuleObject> {
    return this.http.get<ModuleObject>(`${this.apiUrl}/${itemId}`);
  }

  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.apiUrl}/currencies`, {
      headers: { skip: "true" },
    });
  }

  create(item: ModuleCreateDto): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(`${this.apiUrl}`, item);
  }

  update(id: string, item: ModuleUpdateDto): Observable<ModuleObject> {
    return this.http.patch<ModuleObject>(`${this.apiUrl}/${id}`, item);
  }

  delete(dto: ModuleDeleteDto): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${dto}`);
  }

  addToFavorites(jobOfferId: string, candidateId: string, set: boolean = true): Observable<any> {
    const payload = {
      accountId: this.authService.getAccountId(),
      jobOfferId,
      candidateId,
      set,
    };
    return this.http.post<any>(`${this.apiUrl}/toggle-favorite`, payload);
  }

  approve(jobOfferId: string): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(
      `${this.apiUrl}/${jobOfferId}/approve`,
      {},
    );
  }

  reject(jobOfferId: string): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(
      `${this.apiUrl}/${jobOfferId}/reject`,
      {},
    );
  }

  revoke(jobOfferId: string): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(
      `${this.apiUrl}/${jobOfferId}/revoke`,
      {},
    );
  }

  republish(jobOfferId: string, expiresAt?: string): Observable<ModuleObject> {
    const body = expiresAt ? { expiresAt } : {};
    return this.http.post<ModuleObject>(
      `${this.apiUrl}/${jobOfferId}/republish`,
      body,
    );
  }

  /** Submits a DRAFT job offer for moderation (DRAFT → PENDING). This is
   * when the recruiter's plan is checked and a credit consumed — 403
   * BILLING_ACCESS_DENIED if the plan doesn't cover it. 400 if the offer
   * isn't currently a draft. */
  submit(jobOfferId: string): Observable<ModuleObject> {
    return this.http.post<ModuleObject>(
      `${this.apiUrl}/${jobOfferId}/submit`,
      {},
    );
  }
}
