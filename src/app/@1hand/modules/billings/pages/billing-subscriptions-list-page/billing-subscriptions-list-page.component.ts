import { Component } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { GenericModalComponent } from "../../../../components/generic-modal/generic-modal.component";
import { TranslocoService } from "@ngneat/transloco";
import { Observable } from "rxjs";
import { finalize, take } from "rxjs/operators";

import { BillingsService } from "../../billings.service";
import { BillingListParams, BillingUserPlan } from "../../billings.types";
import { BillingPaginatedListPage } from "../billing-paginated-list-page.base";

@Component({
  selector: "app-billing-subscriptions-list-page",
  standalone: false,
  templateUrl: "./billing-subscriptions-list-page.component.html",
  styleUrls: ["./billing-subscriptions-list-page.component.scss"],
})
export class BillingSubscriptionsListPageComponent extends BillingPaginatedListPage<BillingUserPlan> {
  protected readonly loadErrorKey = "billings.subscriptionsList.loadError";

  statusFilter = "";
  cancellingId: string | null = null;

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
    return this.billingsService.selectSubscriptions(params);
  }

  protected override getCustomQueryParams() {
    return { status: this.statusFilter || null };
  }

  protected override resetCustomFilters(): void {
    this.statusFilter = "";
  }

  handleCancel(subscription: BillingUserPlan): void {
    if (subscription.plan?.isFree || subscription.plan?.type === "FREE") {
      this.openMessage(
        this.transloco.translate("billings.informationTitle"),
        this.transloco.translate("billings.subscriptionsList.freeCannotCancel"),
        "info",
      );
      return;
    }

    if (subscription.status === "CANCELED") {
      this.openMessage(
        this.transloco.translate("billings.informationTitle"),
        this.transloco.translate("billings.subscriptionsList.alreadyCanceled"),
        "info",
      );
      return;
    }

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "430px",
      disableClose: true,
      data: {
        title: this.transloco.translate("billings.subscriptionsList.cancelTitle"),
        content: this.transloco.translate("billings.subscriptionsList.cancelMessage", {
          plan: subscription.plan?.name || subscription.planId,
        }),
        type: "warn",
        actions: [
          { id: "cancel", label: this.transloco.translate("billings.cancel") },
          {
            id: "confirm",
            label: this.transloco.translate("billings.subscriptionsList.cancelAction"),
            color: "warn",
          },
        ],
      },
    });

    const actionSub = dialogRef.componentInstance.action.subscribe((action) => {
      if (action !== "confirm") {
        dialogRef.close();
        actionSub.unsubscribe();
        return;
      }

      const confirmAction = dialogRef.componentInstance.data.actions?.find(
        (item: any) => item.id === "confirm",
      );
      if (confirmAction) confirmAction.isLoading = true;

      this.cancellingId = subscription.id;

      this.billingsService
        .cancelSubscription(subscription.id)
        .pipe(take(1), finalize(() => { this.cancellingId = null; actionSub.unsubscribe(); }))
        .subscribe({
          next: () => {
            dialogRef.close();
            this.openMessage(
              this.transloco.translate("billings.subscriptionsList.cancelSuccessTitle"),
              this.transloco.translate("billings.subscriptionsList.cancelSuccessMessage"),
              "success",
            );
            this.loadItems();
          },
          error: (error) => {
            dialogRef.close();
            this.openMessage(
              this.transloco.translate("billings.errorTitle"),
              error?.error?.message || this.transloco.translate("billings.subscriptionsList.cancelError"),
              "danger",
            );
          },
        });
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
