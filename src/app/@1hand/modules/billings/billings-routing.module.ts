import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BillingCurrentPageComponent } from "./pages/billing-current-page/billing-current-page.component";
import { BillingPaymentSuccessPageComponent } from "./pages/billing-payment-success-page/billing-payment-success-page.component";
import { BillingPaymentsListPageComponent } from "./pages/billing-payments-list-page/billing-payments-list-page.component";
import { BillingPlansListPageComponent } from "./pages/billing-plans-list-page/billing-plans-list-page.component";
import { BillingPlansPageComponent } from "./pages/billing-plans-page/billing-plans-page.component";
import { BillingSubscriptionsListPageComponent } from "./pages/billing-subscriptions-list-page/billing-subscriptions-list-page.component";

const routes: Routes = [
  { path: "", redirectTo: "plans", pathMatch: "full" },
  { path: "plans", component: BillingPlansPageComponent },
  { path: "current", component: BillingCurrentPageComponent },
  { path: "payment-success", component: BillingPaymentSuccessPageComponent },
  {
    path: "manage",
    children: [
      { path: "", redirectTo: "plans", pathMatch: "full" },
      { path: "plans", component: BillingPlansListPageComponent },
      { path: "subscriptions", component: BillingSubscriptionsListPageComponent },
      { path: "payments", component: BillingPaymentsListPageComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BillingsRoutingModule {}
