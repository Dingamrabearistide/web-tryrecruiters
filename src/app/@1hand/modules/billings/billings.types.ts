import {
  BaseModel,
  BaseParamsQuery,
  BaseResponseInterface,
} from "../../base.type";

export type BillingPlanType =
  | "FREE"
  | "BASIC"
  | "PREMIUM"
  | "ENTERPRISE"
  | "OTHER";

export type BillingPaymentStatus = "PENDING" | "PAID" | "FAILED";

export type BillingUserPlanStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_PAYMENT"
  | "EXPIRED"
  | "SUSPENDED"
  | "CANCELED";

export type PaymentProvider = "MONEROO" | "PAYPAL" | "STRIPE";

export interface BillingPlanDetails {
  maxVerificationRequests?: number;
  [key: string]: unknown;
}

export interface BillingPlan extends BaseModel {
  code: string;
  name: string;
  description?: string | null;
  details?: BillingPlanDetails | null;
  type: BillingPlanType;
  price: string | number;
  currency: string;
  credits: number;
  isFree: boolean;
  isActive: boolean;
}

export interface BillingUserPlan extends BaseModel {
  accountId: string;
  planId: string;
  status: BillingUserPlanStatus;
  remainingCredits: number;
  hasUsedFreePlan: boolean;
  activatedAt: string;
  expireAt?: string | null;
  plan?: BillingPlan;
}

export interface BillingPayment extends BaseModel {
  accountId: string;
  amount: number;
  currency: string;
  status: BillingPaymentStatus;
  provider: PaymentProvider;
  rawResponse?: unknown;
  orderId?: string | null;
  ressourceId?: string | null;
  planId: string;
  paidAt?: string | null;
  plan?: BillingPlan;
}

export interface ActivatePlanDto {
  planCode: string;
}

export interface FreePlanActivationResponse {
  requiresPayment: false;
  userPlan: BillingUserPlan;
}

export interface MonerooPaymentInitializationResponse {
  requiresPayment: true;
  provider: "MONEROO";
  paymentId: string;
  paymentUrl: string;
}

export type ActivatePlanResponse =
  | FreePlanActivationResponse
  | MonerooPaymentInitializationResponse;

export interface ConfirmMonerooPaymentResponse {
  success: boolean;
  paymentId: string;
  planCode: string;
}

export interface UpdatePaymentStatusDto {
  status: BillingPaymentStatus;
}

export interface UpdateAccountPaymentDisabledDto {
  paymentDisabled: boolean;
}

export interface BillingAccountPaymentDisabledResponse {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  paymentDisabled: boolean;
  updatedAt?: string;
}

export interface UpdateCurrentBillingPlanDto {
  remainingCredits?: number;
  creditsDelta?: number;
  status?: BillingUserPlanStatus;
  expireAt?: string | null;
  markExpiredIfNeeded?: boolean;
  resourceType?: string;
  resourceId?: string;
}

export interface ConsumeBillingCreditsDto {
  credits?: number;
  resourceType?: string;
  resourceId?: string;
  markExpiredIfNeeded?: boolean;
}

export interface ConsumeBillingCreditsResponse {
  userPlan: BillingUserPlan;
  consumedCredits: number;
  remainingCredits: number;
  resourceType?: string | null;
  resourceId?: string | null;
}

export interface BillingCurrentPlanValidityResponse {
  valid: boolean;
  reason:
    | "ALLOWED"
    | "NO_SUBSCRIPTION"
    | "SUBSCRIPTION_STATUS_NOT_ALLOWED"
    | "SUBSCRIPTION_EXPIRED"
    | "INSUFFICIENT_CREDITS";
  currentPlan: BillingUserPlan | null;
}

export interface BillingListParams extends BaseParamsQuery {
  search?: string;
  status?: string;
  type?: string;
  provider?: string;
  isActive?: boolean;
}

export interface BillingPlansResponse extends BaseResponseInterface<BillingPlan> {}

export interface BillingSubscriptionsResponse extends BaseResponseInterface<BillingUserPlan> {}

export interface BillingPaymentsResponse extends BaseResponseInterface<BillingPayment> {}

export type BillingListApiResponse<T> = BaseResponseInterface<T> | T[];

export const BillingsModuleRoot = "billing";
