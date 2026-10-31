import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "@env/environment";
import { Observable, map } from "rxjs";

import {
  ActivatePlanDto,
  ActivatePlanResponse,
  BillingListApiResponse,
  BillingListParams,
  BillingPayment,
  BillingPaymentsResponse,
  BillingPlan,
  BillingPlansResponse,
  BillingSubscriptionsResponse,
  BillingUserPlan,
  BillingsModuleRoot,
  ConfirmMonerooPaymentResponse,
  UpdatePaymentStatusDto,
  UpdateAccountPaymentDisabledDto,
  BillingAccountPaymentDisabledResponse,
  UpdateCurrentBillingPlanDto,
  ConsumeBillingCreditsDto,
  ConsumeBillingCreditsResponse,
  BillingCurrentPlanValidityResponse,
} from "./billings.types";
import type {
  BillingAccessBackendDecision,
  ResolvedBillingAccessConfig,
} from "./access/billing-access.types";

@Injectable({
  providedIn: "root",
})
export class BillingsService {
  private readonly apiUrl = `${environment.apiUrl}/${BillingsModuleRoot}`;

  constructor(private readonly http: HttpClient) {}

  getPlans(): Observable<BillingPlan[]> {
    return this.selectPlans({
      page: 1,
      limit: 100,
      isActive: true,
    }).pipe(map((response) => response.data));
  }

  getCurrentPlan(): Observable<BillingUserPlan | null> {
    return this.http.get<BillingUserPlan | null>(`${this.apiUrl}/current`);
  }

  refreshCurrentPlan(): Observable<BillingUserPlan | null> {
    return this.http.patch<BillingUserPlan | null>(
      `${this.apiUrl}/current/refresh`,
      {},
    );
  }

  checkCurrentPlanValidity(
    minimumRemainingCredits = 0,
  ): Observable<BillingCurrentPlanValidityResponse> {
    return this.http.get<BillingCurrentPlanValidityResponse>(
      `${this.apiUrl}/current/valid`,
      {
        params: this.buildQueryParams({ minimumRemainingCredits }),
      },
    );
  }

  updateAccountCurrentPlan(
    accountId: string,
    dto: UpdateCurrentBillingPlanDto,
  ): Observable<BillingUserPlan | null> {
    return this.http.patch<BillingUserPlan | null>(
      `${this.apiUrl}/accounts/${encodeURIComponent(accountId)}/current-plan`,
      dto,
    );
  }

  expireAccountCurrentPlan(accountId: string): Observable<BillingUserPlan | null> {
    return this.http.patch<BillingUserPlan | null>(
      `${this.apiUrl}/accounts/${encodeURIComponent(accountId)}/current-plan/expire`,
      {},
    );
  }

  consumeCurrentPlanCredits(
    dto: ConsumeBillingCreditsDto = {},
  ): Observable<ConsumeBillingCreditsResponse> {
    return this.http.patch<ConsumeBillingCreditsResponse>(
      `${this.apiUrl}/current/consume`,
      dto,
    );
  }

  activatePlan(dto: ActivatePlanDto): Observable<ActivatePlanResponse> {
    return this.http.post<ActivatePlanResponse>(`${this.apiUrl}/activate`, dto);
  }

  confirmMonerooPayment(
    paymentId: string,
  ): Observable<ConfirmMonerooPaymentResponse> {
    const params = new HttpParams().set("paymentId", paymentId);

    return this.http.get<ConfirmMonerooPaymentResponse>(
      `${this.apiUrl}/moneroo/return`,
      { params },
    );
  }

  cancelSubscription(subscriptionId: string): Observable<BillingUserPlan> {
    return this.http.patch<BillingUserPlan>(
      `${this.apiUrl}/subscriptions/${encodeURIComponent(subscriptionId)}/cancel`,
      {},
    );
  }

  updatePaymentStatus(
    paymentId: string,
    dto: UpdatePaymentStatusDto,
  ): Observable<BillingPayment> {
    return this.http.patch<BillingPayment>(
      `${this.apiUrl}/payments/${encodeURIComponent(paymentId)}/status`,
      dto,
    );
  }

  updateAccountPaymentDisabled(
    accountId: string,
    paymentDisabledOrDto: boolean | UpdateAccountPaymentDisabledDto,
  ): Observable<BillingAccountPaymentDisabledResponse> {
    const dto: UpdateAccountPaymentDisabledDto =
      typeof paymentDisabledOrDto === "boolean"
        ? { paymentDisabled: paymentDisabledOrDto }
        : paymentDisabledOrDto;

    return this.http.patch<BillingAccountPaymentDisabledResponse>(
      `${this.apiUrl}/accounts/${encodeURIComponent(accountId)}/payment-disabled`,
      dto,
    );
  }

  selectPlans(params: BillingListParams): Observable<BillingPlansResponse> {
    return this.http
      .get<BillingListApiResponse<BillingPlan>>(`${this.apiUrl}/plans`, {
        params: this.buildQueryParams(params),
      })
      .pipe(map((response) => this.normalizeResponse(response, params)));
  }

  selectSubscriptions(
    params: BillingListParams,
  ): Observable<BillingSubscriptionsResponse> {
    return this.http
      .get<BillingListApiResponse<BillingUserPlan>>(
        `${this.apiUrl}/subscriptions`,
        { params: this.buildQueryParams(params) },
      )
      .pipe(map((response) => this.normalizeResponse(response, params)));
  }

  selectPayments(
    params: BillingListParams,
  ): Observable<BillingPaymentsResponse> {
    return this.http
      .get<BillingListApiResponse<BillingPayment>>(`${this.apiUrl}/payments`, {
        params: this.buildQueryParams(params),
      })
      .pipe(map((response) => this.normalizeResponse(response, params)));
  }

  checkBillingAccess(
    config: ResolvedBillingAccessConfig,
  ): Observable<BillingAccessBackendDecision> {
    return this.http.get<BillingAccessBackendDecision>(
      `${this.apiUrl}/access/check`,
      {
        params: this.buildQueryParams({
          requireSubscription: config.requireSubscription,
          allowedSubscriptionStatuses: config.allowedSubscriptionStatuses,
          requireNotExpired: config.requireNotExpired,
          requirePaidInvoice: config.requirePaidInvoice,
          acceptedPaymentStatuses: config.acceptedPaymentStatuses,
          allowFreePlan: config.allowFreePlan,
          allowPaymentDisabled: config.allowPaymentDisabled,
          minimumRemainingCredits: config.minimumRemainingCredits,
          paymentsLimit: config.paymentsLimit,
          failOpen: config.failOpen,
        }),
      },
    );
  }

  private buildQueryParams(params: Record<string, unknown>): HttpParams {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => {
          httpParams = httpParams.append(key, String(item));
        });
        return;
      }

      httpParams = httpParams.set(key, String(value));
    });

    return httpParams;
  }

  private normalizeResponse<T>(
    response: BillingListApiResponse<T>,
    params: BillingListParams,
  ) {
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 10);

    if (Array.isArray(response)) {
      return {
        page,
        limit,
        total: response.length,
        data: response,
      };
    }

    return {
      page: Number(response.page || page),
      limit: Number(response.limit || limit),
      total: Number(response.total || 0),
      data: Array.isArray(response.data) ? response.data : [],
    };
  }
}
