import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

import { BillingPlan } from "../../billings.types";

export interface BillingConfirmDialogData {
  plan: BillingPlan;
  credits: number;
}

@Component({
  selector: "app-billing-confirm-dialog",
  standalone: false,
  templateUrl: "./billing-confirm-dialog.component.html",
  styleUrls: ["./billing-confirm-dialog.component.scss"],
})
export class BillingConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: BillingConfirmDialogData,

    private readonly dialogRef: MatDialogRef<
      BillingConfirmDialogComponent,
      boolean
    >,
  ) {}

  cancel(): void { this.dialogRef.close(false); }
  confirm(): void { this.dialogRef.close(true); }
}
