import { Injectable } from "@angular/core";
import { Observable, catchError, map, of } from "rxjs";

import { BillingsService } from "../billings.service";
import {
  PROJECT_BILLING_ACCESS_CONFIG,
  resolveBillingAccessConfig,
} from "./billing-access.config";
import {
  BillingAccessBackendDecision,
  BillingAccessConfig,
  BillingAccessDecision,
  ResolvedBillingAccessConfig,
  isBillingAccessDeniedReason,
} from "./billing-access.types";

@Injectable({
  providedIn: "root",
})
export class BillingAccessService {
  constructor(private readonly billingsService: BillingsService) {}

  check(
    config: BillingAccessConfig = PROJECT_BILLING_ACCESS_CONFIG,
  ): Observable<BillingAccessDecision> {
    const resolvedConfig = resolveBillingAccessConfig(config);

    return this.billingsService.checkBillingAccess(resolvedConfig).pipe(
      map((backendDecision) =>
        this.applyFrontendRules(backendDecision, resolvedConfig),
      ),
      catchError(() =>
        of(
          this.createDecision(
            resolvedConfig.failOpen,
            resolvedConfig.failOpen ? "ALLOWED" : "CHECK_FAILED",
            null,
            [],
            0,
            resolvedConfig,
            false,
          ),
        ),
      ),
    );
  }

  private applyFrontendRules(
    backendDecision: BillingAccessBackendDecision,
    config: ResolvedBillingAccessConfig,
  ): BillingAccessDecision {
    const paymentDisabled = backendDecision.paymentDisabled === true;

    const reason: BillingAccessDecision["reason"] = paymentDisabled
      ? "PAYMENT_DISABLED"
      : backendDecision.reason;

    const allowed = paymentDisabled ? true : backendDecision.allowed;

    const baseDecision: BillingAccessDecision = {
      ...backendDecision,
      allowed,
      reason,
      paymentDisabled,
      message:
        !paymentDisabled && backendDecision.message
          ? backendDecision.message
          : this.getAlertMessage(reason, config),
      config,
    };

    if (paymentDisabled) {
      return baseDecision;
    }

    if (!baseDecision.allowed || !config.customRule) {
      return baseDecision;
    }

    const customResult = config.customRule({
      currentPlan: baseDecision.currentPlan,
      payments: baseDecision.payments,
      acceptedPaymentCount: baseDecision.acceptedPaymentCount,
      paymentDisabled: false,
      now: new Date(),
    });

    if (customResult.allowed) {
      return baseDecision;
    }

    const reasonFromCustomRule = customResult.reason ?? "CUSTOM_RULE_DENIED";

    return {
      ...baseDecision,
      allowed: false,
      reason: reasonFromCustomRule,
      message:
        customResult.message ??
        this.getAlertMessage(reasonFromCustomRule, config) ??
        baseDecision.message,
    };
  }

  private createDecision(
    allowed: boolean,
    reason: BillingAccessDecision["reason"],
    currentPlan: BillingAccessDecision["currentPlan"],
    payments: BillingAccessDecision["payments"],
    acceptedPaymentCount: number,
    config: ResolvedBillingAccessConfig,
    paymentDisabled: boolean,
  ): BillingAccessDecision {
    return {
      allowed,
      reason,
      paymentDisabled,
      currentPlan,
      payments,
      acceptedPaymentCount,
      checkedAt: new Date().toISOString(),
      message: this.getAlertMessage(reason, config),
      config,
    };
  }

  private getAlertMessage(
    reason: BillingAccessDecision["reason"],
    config: ResolvedBillingAccessConfig,
  ): string | undefined {
    if (!isBillingAccessDeniedReason(reason)) {
      return undefined;
    }

    return config.alert.messages?.[reason];
  }
}
