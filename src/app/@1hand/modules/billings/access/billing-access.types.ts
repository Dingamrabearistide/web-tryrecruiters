import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";

import {
  BillingPayment,
  BillingPaymentStatus,
  BillingUserPlan,
  BillingUserPlanStatus,
} from "../billings.types";

export type BillingAccessDeniedReason =
  | "NO_SUBSCRIPTION"
  | "SUBSCRIPTION_STATUS_NOT_ALLOWED"
  | "SUBSCRIPTION_EXPIRED"
  | "NO_PAID_PAYMENT"
  | "INSUFFICIENT_CREDITS"
  | "CUSTOM_RULE_DENIED"
  | "CHECK_FAILED";

export type BillingAccessAllowedReason = "ALLOWED" | "PAYMENT_DISABLED";

export type BillingAccessReason =
  | BillingAccessAllowedReason
  | BillingAccessDeniedReason;

export function isBillingAccessDeniedReason(
  reason: BillingAccessReason | null | undefined,
): reason is BillingAccessDeniedReason {
  return Boolean(reason) && reason !== "ALLOWED" && reason !== "PAYMENT_DISABLED";
}

export interface BillingAccessEvaluationContext {
  currentPlan: BillingUserPlan | null;
  payments: BillingPayment[];
  acceptedPaymentCount: number;
  paymentDisabled: boolean;
  now: Date;
}

export interface BillingAccessCustomRuleResult {
  allowed: boolean;
  reason?: BillingAccessDeniedReason;
  message?: string;
}

export interface BillingAccessNavigationContext {
  route?: ActivatedRouteSnapshot;
  state?: RouterStateSnapshot;
  currentUrl: string;
  decision?: BillingAccessDecision;
}

export type BillingPlansTarget =
  | string
  | any[]
  | ((context: BillingAccessNavigationContext) => string | any[]);

export interface BillingAccessAlertConfig {
  title?: string;
  actionLabel?: string;
  messages?: Partial<Record<BillingAccessDeniedReason, string>>;
}

export interface BillingAccessConfig {
  requireSubscription?: boolean;
  allowedSubscriptionStatuses?: BillingUserPlanStatus[];
  requireNotExpired?: boolean;
  requirePaidInvoice?: boolean;
  acceptedPaymentStatuses?: BillingPaymentStatus[];
  allowFreePlan?: boolean;
  minimumRemainingCredits?: number;
  paymentsLimit?: number;
  allowPaymentDisabled?: boolean;
  customRule?: (
    context: BillingAccessEvaluationContext,
  ) => BillingAccessCustomRuleResult;
  plansTarget?: BillingPlansTarget;
  reasonQueryParam?: string;
  returnUrlQueryParam?: string;
  failOpen?: boolean;
  alert?: BillingAccessAlertConfig;
}

export interface ResolvedBillingAccessConfig
  extends Required<
    Pick<
      BillingAccessConfig,
      | "requireSubscription"
      | "requireNotExpired"
      | "requirePaidInvoice"
      | "allowFreePlan"
      | "minimumRemainingCredits"
      | "paymentsLimit"
      | "reasonQueryParam"
      | "returnUrlQueryParam"
      | "allowPaymentDisabled"
      | "failOpen"
    >
  > {
  allowedSubscriptionStatuses: BillingUserPlanStatus[];
  acceptedPaymentStatuses: BillingPaymentStatus[];
  customRule?: BillingAccessConfig["customRule"];
  plansTarget: BillingPlansTarget;
  alert: BillingAccessAlertConfig;
}

export interface BillingAccessBackendDecision {
  allowed: boolean;
  reason: BillingAccessReason;
  paymentDisabled?: boolean;
  currentPlan: BillingUserPlan | null;
  payments: BillingPayment[];
  acceptedPaymentCount: number;
  checkedAt: string;
  message?: string;
}

export interface BillingAccessDecision extends BillingAccessBackendDecision {
  config: ResolvedBillingAccessConfig;
}
