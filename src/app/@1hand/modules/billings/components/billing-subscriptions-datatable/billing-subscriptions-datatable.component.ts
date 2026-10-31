import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import { Subscription as RxSubscription } from "rxjs";

import { createBillingSubscriptionColumns } from "../../billings.config";
import { BillingUserPlan } from "../../billings.types";
import { GenericDatatableColumnDef } from "../../../../components/generic-datatable/generic-datatable.component";

@Component({
  selector: "app-billing-subscriptions-datatable",
  standalone: false,
  templateUrl: "./billing-subscriptions-datatable.component.html",
  styleUrls: ["./billing-subscriptions-datatable.component.scss"],
})
export class BillingSubscriptionsDatatableComponent implements OnInit, OnDestroy {
  @Input() items: BillingUserPlan[] = [];
  @Input() isLoading = false;
  @Input() hasError = false;

  @Output() cancel = new EventEmitter<BillingUserPlan>();

  columns: GenericDatatableColumnDef<BillingUserPlan>[] = [];

  private languageSubscription?: RxSubscription;

  constructor(private readonly transloco: TranslocoService) {}

  ngOnInit(): void {
    this.buildColumns();
    this.languageSubscription = this.transloco.langChanges$.subscribe(() => this.buildColumns());
  }

  ngOnDestroy(): void {
    this.languageSubscription?.unsubscribe();
  }

  private buildColumns(): void {
    const p = "billings.datatable";
    this.columns = createBillingSubscriptionColumns({
      name: this.transloco.translate(`${p}.name`),
      code: this.transloco.translate(`${p}.code`),
      type: this.transloco.translate(`${p}.type`),
      price: this.transloco.translate(`${p}.price`),
      credits: this.transloco.translate(`${p}.credits`),
      active: this.transloco.translate(`${p}.active`),
      account: this.transloco.translate(`${p}.account`),
      plan: this.transloco.translate(`${p}.plan`),
      status: this.transloco.translate(`${p}.status`),
      remainingCredits: this.transloco.translate(`${p}.remainingCredits`),
      freePlanUsed: this.transloco.translate(`${p}.freePlanUsed`),
      activatedAt: this.transloco.translate(`${p}.activatedAt`),
      expireAt: this.transloco.translate(`${p}.expireAt`),
      amount: this.transloco.translate(`${p}.amount`),
      provider: this.transloco.translate(`${p}.provider`),
      paymentId: this.transloco.translate(`${p}.paymentId`),
      paidAt: this.transloco.translate(`${p}.paidAt`),
      createdAt: this.transloco.translate(`${p}.createdAt`),
      actions: this.transloco.translate(`${p}.actions`),
      yes: this.transloco.translate("billings.yes"),
      no: this.transloco.translate("billings.no"),
    });
  }
}
