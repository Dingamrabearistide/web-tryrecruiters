import { Component } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { GenericModalComponent } from "../../../../components/generic-modal/generic-modal.component";
import { TranslocoService } from "@ngneat/transloco";
import { Observable } from "rxjs";
import { finalize, take } from "rxjs/operators";

import { BillingPaymentStatusDialogComponent } from "../../components/billing-payment-status-dialog/billing-payment-status-dialog.component";
import { BillingsService } from "../../billings.service";
import { BillingListParams, BillingPayment, BillingPaymentStatus } from "../../billings.types";
import { BillingPaginatedListPage } from "../billing-paginated-list-page.base";

@Component({
  selector: "app-billing-payments-list-page",
  standalone: false,
  templateUrl: "./billing-payments-list-page.component.html",
  styleUrls: ["./billing-payments-list-page.component.scss"],
})
export class BillingPaymentsListPageComponent extends BillingPaginatedListPage<BillingPayment> {
  protected readonly loadErrorKey = "billings.paymentsList.loadError";

  statusFilter = "";
  updatingId: string | null = null;

  constructor(
    route: ActivatedRoute,
    router: Router,
    transloco: TranslocoService,
    private readonly billingsService: BillingsService,
    private readonly dialog: MatDialog,
  ) {
    super(route, router, transloco);
  }

  protected override onParamsInit(params: Params): void {
    this.statusFilter = String(params["status"] || "");
  }

  protected getListParams(): BillingListParams {
    return {
      page: this.page,
      limit: this.limit,
      search: this.search || undefined,
      status: this.statusFilter || undefined,
    };
  }

  protected selectMany(params: BillingListParams): Observable<any> {
    return this.billingsService.selectPayments(params);
  }

  protected override getCustomQueryParams() {
    return { status: this.statusFilter || null };
  }

  protected override resetCustomFilters(): void {
    this.statusFilter = "";
  }

  handleStatusChange(payment: BillingPayment): void {
    const dialogRef = this.dialog.open(BillingPaymentStatusDialogComponent, {
      width: "460px",
      maxWidth: "calc(100vw - 32px)",
      disableClose: true,
      data: { payment },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((status: BillingPaymentStatus | null | undefined) => {
        if (!status || status === payment.status) return;
        this.updateStatus(payment, status);
      });
  }

  private updateStatus(payment: BillingPayment, status: BillingPaymentStatus): void {
    this.updatingId = payment.id;

    this.billingsService
      .updatePaymentStatus(payment.id, { status })
      .pipe(take(1), finalize(() => { this.updatingId = null; }))
      .subscribe({
        next: (updatedPayment) => {
          this.items = this.items.map((item) =>
            item.id === updatedPayment.id ? updatedPayment : item,
          );
          this.openMessage(
            this.transloco.translate("billings.paymentsList.updateSuccessTitle"),
            this.transloco.translate("billings.paymentsList.updateSuccessMessage", { status }),
            "success",
          );
        },
        error: (error) => {
          this.openMessage(
            this.transloco.translate("billings.errorTitle"),
            error?.error?.message || this.transloco.translate("billings.paymentsList.updateError"),
            "danger",
          );
        },
      });
  }

  private openMessage(title: string, content: string, type: "info" | "success" | "danger"): void {
    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: {
        title,
        content,
        type,
        actions: [{ id: "ok", label: this.transloco.translate("general.ok"), color: "primary" }],
      },
    });

    const sub = dialogRef.componentInstance.action.subscribe(() => {
      dialogRef.close();
      sub.unsubscribe();
    });
  }
}
