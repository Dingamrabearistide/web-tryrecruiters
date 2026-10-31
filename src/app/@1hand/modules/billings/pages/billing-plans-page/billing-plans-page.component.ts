import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { finalize, take } from "rxjs/operators";

import { BillingConfirmDialogComponent } from "../../components/billing-confirm-dialog/billing-confirm-dialog.component";
import { BillingsService } from "../../billings.service";
import { BillingPlan, BillingUserPlan } from "../../billings.types";
import { GenericModalComponent } from "../../../../components/generic-modal/generic-modal.component";

@Component({
  selector: "app-billing-plans-page",
  standalone: false,
  templateUrl: "./billing-plans-page.component.html",
  styleUrls: ["./billing-plans-page.component.scss"],
})
export class BillingPlansPageComponent implements OnInit {
  plans: BillingPlan[] = [];
  currentPlan: BillingUserPlan | null = null;
  selectedPlan: BillingPlan | null = null;

  isLoading = false;
  hasError = false;
  errorMessage = "";
  subscribingPlanId: string | null = null;

  constructor(
    private readonly billingsService: BillingsService,
    private readonly dialog: MatDialog,
    private readonly transloco: TranslocoService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit(): void { this.loadPage(); }

  loadPage(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.billingsService
      .getPlans()
      .pipe(take(1), finalize(() => { this.isLoading = false; }))
      .subscribe({
        next: (plans) => {
          this.plans = plans;
          this.selectedPlan = plans[0] || null;
          this.loadCurrentPlan();
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage = this.extractErrorMessage(error, "billings.loadError");
        },
      });
  }

  selectPlan(plan: BillingPlan): void {
    if (this.subscribingPlanId !== null) return;
    this.selectedPlan = plan;
  }

  isPlanSelected(plan: BillingPlan): boolean { return this.selectedPlan?.id === plan.id; }
  isCurrentPlan(plan: BillingPlan): boolean { return this.currentPlan?.planId === plan.id; }

  startActivation(): void {
    const plan = this.selectedPlan;
    if (!plan || this.subscribingPlanId !== null) return;

    if (this.isCurrentPlan(plan)) {
      this.openMessageModal(
        this.transloco.translate("billings.informationTitle"),
        this.transloco.translate("billings.alreadyActive"),
        "info",
      );
      return;
    }

    const dialogRef = this.dialog.open(BillingConfirmDialogComponent, {
      width: "480px",
      maxWidth: "calc(100vw - 32px)",
      disableClose: true,
      data: { plan, credits: this.getPlanCredits(plan) },
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe((confirmed) => {
      if (confirmed) this.activatePlan(plan);
    });
  }

  getPlanCredits(plan: BillingPlan): number {
    if (plan.credits > 0) return plan.credits;
    const v = Number(plan.details?.maxVerificationRequests || 0);
    return Number.isFinite(v) ? v : 0;
  }

  getPlanIcon(plan: BillingPlan): string {
    const icons: Record<string, string> = {
      FREE: "fa-gift",
      BASIC: "fa-seedling",
      PREMIUM: "fa-briefcase",
      ENTERPRISE: "fa-building",
    };
    return icons[plan.type] || "fa-box";
  }

  getPlanIconContainerClass(plan: BillingPlan): string {
    if (plan.type === "FREE") return "bg-purple-50 text-purple-700";
    if (plan.type === "BASIC") return "bg-gray-100 text-gray-700";
    return "bg-green-50 text-green-700";
  }

  trackPlanById(_index: number, plan: BillingPlan): string { return plan.id; }

  goToCurrentPlan(): void {
    void this.router.navigate(["../current"], { relativeTo: this.route });
  }

  private loadCurrentPlan(): void {
    this.billingsService.getCurrentPlan().pipe(take(1)).subscribe({
      next: (currentPlan) => {
        this.currentPlan = currentPlan;
        if (currentPlan) {
          const activePlan = this.plans.find((p) => p.id === currentPlan.planId);
          if (activePlan) this.selectedPlan = activePlan;
        }
      },
      error: () => { this.currentPlan = null; },
    });
  }

  private activatePlan(plan: BillingPlan): void {
    this.subscribingPlanId = plan.id;

    this.billingsService
      .activatePlan({ planCode: plan.code })
      .pipe(take(1), finalize(() => { this.subscribingPlanId = null; }))
      .subscribe({
        next: (response) => {
          if (response.requiresPayment) {
            window.location.assign(response.paymentUrl);
            return;
          }
          this.currentPlan = response.userPlan;
          this.openMessageModal(
            this.transloco.translate("billings.activationSuccessTitle"),
            this.transloco.translate("billings.activationSuccessMessage", { name: plan.name }),
            "success",
          );
        },
        error: (error) => {
          this.openMessageModal(
            this.transloco.translate("billings.errorTitle"),
            this.extractErrorMessage(error, "billings.activationError"),
            "danger",
          );
        },
      });
  }

  private extractErrorMessage(error: any, fallbackKey: string): string {
    const message = error?.error?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (Array.isArray(message) && message[0]?.message) return message[0].message;
    return this.transloco.translate(fallbackKey);
  }

  private openMessageModal(title: string, content: string, type: "info" | "success" | "danger"): void {
    this.dialog.open(GenericModalComponent, {
      width: "400px",
      maxWidth: "calc(100vw - 32px)",
      data: {
        title,
        content,
        type,
        actions: [{ id: "ok", label: this.transloco.translate("general.ok"), color: "primary" }],
      },
    });
  }
}
