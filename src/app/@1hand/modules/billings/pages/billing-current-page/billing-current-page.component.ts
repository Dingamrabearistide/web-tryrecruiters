import { Component, OnInit } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import { finalize, take } from "rxjs/operators";

import { BillingsService } from "../../billings.service";
import { BillingUserPlan } from "../../billings.types";

@Component({
  selector: "app-billing-current-page",
  standalone: false,
  templateUrl: "./billing-current-page.component.html",
  styleUrls: ["./billing-current-page.component.scss"],
})
export class BillingCurrentPageComponent implements OnInit {
  currentPlan: BillingUserPlan | null = null;

  isLoading = false;
  hasError = false;
  errorMessage = "";

  constructor(
    private readonly billingsService: BillingsService,
    private readonly transloco: TranslocoService,
  ) {}

  ngOnInit(): void { this.loadCurrentPlan(); }

  getPlanName(plan: BillingUserPlan): string {
    const code = plan.plan?.code;
    if (code) {
      const key = `billings.plans.${code}.name`;
      const translated = this.transloco.translate(key);
      if (translated !== key) return translated;
    }
    return plan.plan?.name || plan.planId;
  }

  loadCurrentPlan(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.billingsService
      .getCurrentPlan()
      .pipe(take(1), finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (currentPlan) => { this.currentPlan = currentPlan; },
        error: (error) => {
          this.hasError = true;
          this.errorMessage = error?.error?.message || "Impossible de charger le forfait actuel.";
        },
      });
  }
}
