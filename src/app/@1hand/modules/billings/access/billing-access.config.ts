import {
  BillingAccessConfig,
  BillingAccessDeniedReason,
  BillingAccessNavigationContext,
  ResolvedBillingAccessConfig,
} from "./billing-access.types";

export const BILLING_ACCESS_DEFAULT_MESSAGES: Record<
  BillingAccessDeniedReason,
  string
> = {
  NO_SUBSCRIPTION:
    "Vous devez choisir un forfait avant d'utiliser cette fonctionnalité.",
  SUBSCRIPTION_STATUS_NOT_ALLOWED:
    "Votre abonnement n'est pas actif. Veuillez régulariser votre situation.",
  SUBSCRIPTION_EXPIRED:
    "Votre abonnement est expiré. Renouvelez-le pour continuer.",
  NO_PAID_PAYMENT:
    "Aucune facture payée n'a été trouvée pour votre compte.",
  INSUFFICIENT_CREDITS:
    "Votre solde de crédits est insuffisant pour accéder à cette fonctionnalité.",
  CUSTOM_RULE_DENIED:
    "Votre compte ne remplit pas les conditions nécessaires pour accéder à cette fonctionnalité.",
  CHECK_FAILED:
    "Impossible de vérifier votre abonnement pour le moment. Réessayez plus tard.",
};

export function dashboardEmployerBillingPlansTarget(
  context: BillingAccessNavigationContext,
): string {
  const url = context.currentUrl || "";
  const segments = url.split("?")[0].split("/").filter(Boolean);
  const employersIndex = segments.indexOf("employers");

  if (employersIndex !== -1 && segments[employersIndex + 1]) {
    return `/dashboard/employers/${segments[employersIndex + 1]}/billings/plans`;
  }

  return "/billings/plans";
}

export const PROJECT_BILLING_ACCESS_CONFIG: BillingAccessConfig = {
  requireSubscription: true,
  allowedSubscriptionStatuses: ["ACTIVE"],
  requireNotExpired: true,
  requirePaidInvoice: false,
  acceptedPaymentStatuses: ["PAID"],
  allowFreePlan: true,
  minimumRemainingCredits: 1,
  paymentsLimit: 5,
  allowPaymentDisabled: true,
  plansTarget: dashboardEmployerBillingPlansTarget,
  reasonQueryParam: "billingReason",
  returnUrlQueryParam: "returnUrl",
  failOpen: false,
  alert: {
    title: "Paiement requis",
    actionLabel: "Voir les forfaits",
    messages: BILLING_ACCESS_DEFAULT_MESSAGES,
  },
};

export function resolveBillingAccessConfig(
  config: BillingAccessConfig = PROJECT_BILLING_ACCESS_CONFIG,
): ResolvedBillingAccessConfig {
  return {
    requireSubscription: config.requireSubscription ?? true,
    allowedSubscriptionStatuses: config.allowedSubscriptionStatuses?.length
      ? [...config.allowedSubscriptionStatuses]
      : ["ACTIVE"],
    requireNotExpired: config.requireNotExpired ?? true,
    requirePaidInvoice: config.requirePaidInvoice ?? true,
    acceptedPaymentStatuses: config.acceptedPaymentStatuses?.length
      ? [...config.acceptedPaymentStatuses]
      : ["PAID"],
    allowFreePlan: config.allowFreePlan ?? false,
    minimumRemainingCredits: Math.max(
      Number(config.minimumRemainingCredits ?? 1),
      0,
    ),
    paymentsLimit: Math.min(Math.max(Number(config.paymentsLimit ?? 5), 0), 50),
    allowPaymentDisabled: config.allowPaymentDisabled ?? true,
    customRule: config.customRule,
    plansTarget: config.plansTarget ?? dashboardEmployerBillingPlansTarget,
    reasonQueryParam: config.reasonQueryParam ?? "billingReason",
    returnUrlQueryParam: config.returnUrlQueryParam ?? "returnUrl",
    failOpen: config.failOpen ?? false,
    alert: {
      title: config.alert?.title ?? "Paiement requis",
      actionLabel: config.alert?.actionLabel ?? "Voir les forfaits",
      messages: {
        ...BILLING_ACCESS_DEFAULT_MESSAGES,
        ...(config.alert?.messages ?? {}),
      },
    },
  };
}
