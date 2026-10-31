import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { Translation, TRANSLOCO_SCOPE } from "@ngneat/transloco";

import { BillingConfirmDialogComponent } from "./components/billing-confirm-dialog/billing-confirm-dialog.component";
import { BillingPaymentStatusDialogComponent } from "./components/billing-payment-status-dialog/billing-payment-status-dialog.component";
import { BillingPaymentsDatatableComponent } from "./components/billing-payments-datatable/billing-payments-datatable.component";
import { BillingPlansDatatableComponent } from "./components/billing-plans-datatable/billing-plans-datatable.component";
import { BillingSubscriptionsDatatableComponent } from "./components/billing-subscriptions-datatable/billing-subscriptions-datatable.component";
import { BillingsRoutingModule } from "./billings-routing.module";
import { BillingCurrentPageComponent } from "./pages/billing-current-page/billing-current-page.component";
import { BillingPaymentSuccessPageComponent } from "./pages/billing-payment-success-page/billing-payment-success-page.component";
import { BillingPaymentsListPageComponent } from "./pages/billing-payments-list-page/billing-payments-list-page.component";
import { BillingPlansListPageComponent } from "./pages/billing-plans-list-page/billing-plans-list-page.component";
import { BillingPlansPageComponent } from "./pages/billing-plans-page/billing-plans-page.component";
import { BillingSubscriptionsListPageComponent } from "./pages/billing-subscriptions-list-page/billing-subscriptions-list-page.component";
import { SupportedLanguages } from "../../../transloco-loader";
import { CoreModule } from "@modules/core/core.module";
import { SharedModule } from "@modules/shared/shared.module";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce(
    (accumulator, language) => {
      accumulator[language] = () => import(`./i18n/${language}.json`);
      return accumulator;
    },
    {} as Record<string, () => Promise<Translation>>,
  );

const declarations = [
  BillingConfirmDialogComponent,
  BillingPaymentStatusDialogComponent,
  BillingPlansDatatableComponent,
  BillingSubscriptionsDatatableComponent,
  BillingPaymentsDatatableComponent,
  BillingPlansPageComponent,
  BillingCurrentPageComponent,
  BillingPaymentSuccessPageComponent,
  BillingPlansListPageComponent,
  BillingSubscriptionsListPageComponent,
  BillingPaymentsListPageComponent,
];

@NgModule({
  declarations: [...declarations],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    CoreModule,
    SharedModule,
    BillingsRoutingModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: "billings", loader },
    },
  ],
  exports: [...declarations],
})
export class BillingsModule {}
