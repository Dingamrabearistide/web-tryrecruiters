import { GenericDatatableColumnDef } from "../../components/generic-datatable/generic-datatable.component";
import { BillingPayment, BillingPlan, BillingUserPlan } from "./billings.types";

function formatDate(value?: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function createBillingPlanColumns(
  labels: Record<string, string>,
): GenericDatatableColumnDef<BillingPlan>[] {
  return [
    { key: "name", label: labels["name"] },
    { key: "code", label: labels["code"] },
    { key: "type", label: labels["type"] },
    {
      key: "price",
      label: labels["price"],
      renderValue: (item) => `${item.price} ${item.currency.toUpperCase()}`,
    },
    { key: "credits", label: labels["credits"] },
    {
      key: "isActive",
      label: labels["active"],
      renderValue: (item) => (item.isActive ? labels["yes"] : labels["no"]),
    },
    {
      key: "createdAt",
      label: labels["createdAt"],
      renderValue: (item) => formatDate(item.createdAt),
    },
  ];
}

export function createBillingSubscriptionColumns(
  labels: Record<string, string>,
): GenericDatatableColumnDef<BillingUserPlan>[] {
  return [
    { key: "accountId", label: labels["account"] },
    { label: labels["plan"], renderValue: (item) => item.plan?.name || item.planId },
    { key: "status", label: labels["status"] },
    { key: "remainingCredits", label: labels["remainingCredits"] },
    {
      key: "hasUsedFreePlan",
      label: labels["freePlanUsed"],
      renderValue: (item) => (item.hasUsedFreePlan ? labels["yes"] : labels["no"]),
    },
    {
      key: "activatedAt",
      label: labels["activatedAt"],
      renderValue: (item) => formatDate(item.activatedAt),
    },
    {
      key: "expireAt",
      label: labels["expireAt"],
      renderValue: (item) => formatDate(item.expireAt),
    },
    { label: labels["actions"], align: "center", width: "110px", canDelete: true },
  ];
}

export function createBillingPaymentColumns(
  labels: Record<string, string>,
): GenericDatatableColumnDef<BillingPayment>[] {
  return [
    { key: "accountId", label: labels["account"] },
    { label: labels["plan"], renderValue: (item) => item.plan?.name || item.planId },
    {
      label: labels["amount"],
      renderValue: (item) => `${item.amount} ${item.currency.toUpperCase()}`,
    },
    { key: "provider", label: labels["provider"] },
    { key: "status", label: labels["status"] },
    {
      key: "orderId",
      label: labels["paymentId"],
      renderValue: (item) => item.orderId || "—",
    },
    {
      key: "paidAt",
      label: labels["paidAt"],
      renderValue: (item) => formatDate(item.paidAt),
    },
    {
      key: "createdAt",
      label: labels["createdAt"],
      renderValue: (item) => formatDate(item.createdAt),
    },
    { label: labels["actions"], align: "center", width: "110px", canEdit: true },
  ];
}
