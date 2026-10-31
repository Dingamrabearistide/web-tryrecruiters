import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { finalize, take } from "rxjs/operators";

import { BillingsService } from "../../billings.service";

type ConfirmationStatus = "loading" | "success" | "error";

@Component({
  selector: "app-billing-payment-success-page",
  standalone: false,
  templateUrl: "./billing-payment-success-page.component.html",
  styleUrls: ["./billing-payment-success-page.component.scss"],
})
export class BillingPaymentSuccessPageComponent implements OnInit {
  status: ConfirmationStatus = "loading";

  paymentId: string | null = null;
  paymentStatus: string | null = null;
  planCode: string | null = null;

  errorMessage = "";
  isConfirming = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly billingsService: BillingsService,
  ) {}

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.queryParamMap.get("paymentId");
    this.paymentStatus = this.route.snapshot.queryParamMap.get("paymentStatus");

    if (!this.paymentId) {
      this.status = "error";
      this.errorMessage = "Identifiant du paiement manquant.";
      return;
    }

    this.confirmPayment();
  }

  confirmPayment(): void {
    if (!this.paymentId || this.isConfirming) return;

    this.status = "loading";
    this.isConfirming = true;
    this.errorMessage = "";

    this.billingsService
      .confirmMonerooPayment(this.paymentId)
      .pipe(take(1), finalize(() => { this.isConfirming = false; }))
      .subscribe({
        next: (response) => {
          if (!response.success) {
            this.status = "error";
            this.errorMessage = "Le paiement n'a pas pu être confirmé.";
            return;
          }
          this.planCode = response.planCode;
          this.status = "success";
        },
        error: (error) => {
          this.status = "error";
          this.errorMessage = error?.error?.message || "Impossible de confirmer le paiement.";
        },
      });
  }

  goToCurrentPlan(): void {
    void this.router.navigate(["../current"], { relativeTo: this.route });
  }

  goToPlans(): void {
    void this.router.navigate(["../plans"], { relativeTo: this.route });
  }
}
