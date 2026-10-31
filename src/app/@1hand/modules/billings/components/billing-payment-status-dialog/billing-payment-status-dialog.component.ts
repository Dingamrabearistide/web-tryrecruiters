import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { BillingPayment, BillingPaymentStatus } from "../../billings.types";

export interface BillingPaymentStatusDialogData {
  payment: BillingPayment;
}

@Component({
  selector: "app-billing-payment-status-dialog",
  standalone: false,
  templateUrl: "./billing-payment-status-dialog.component.html",
  styleUrls: ["./billing-payment-status-dialog.component.scss"],
})
export class BillingPaymentStatusDialogComponent {
  readonly statuses: BillingPaymentStatus[] = ["PENDING", "PAID", "FAILED"];
  selectedStatus: BillingPaymentStatus;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: BillingPaymentStatusDialogData,

    private readonly dialogRef: MatDialogRef<
      BillingPaymentStatusDialogComponent,
      BillingPaymentStatus | null
    >,
  ) {
    this.selectedStatus = data.payment.status;
  }

  cancel(): void { this.dialogRef.close(null); }
  confirm(): void { this.dialogRef.close(this.selectedStatus); }
}
