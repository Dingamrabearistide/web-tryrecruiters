import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface Feature {
  label: string;
  labelParams?: Record<string, any>;
  available: boolean;
}

export interface PricingPlan {
  id: string;
  title: string;
  price: number | null;
  currency?: string;
  duration?: string;
  buttonLabel: string;
  bestValue?: boolean;
  features: Feature[];
}

@Component({
  standalone: false,

  selector: "app-pricing-plan",
  templateUrl: "./pricing-plan.component.html",
  styleUrls: ["./pricing-plan.component.scss", "../../../../styles/legacy-styles.css"],
})
export class PricingPlansComponent {
  @Input() plans: PricingPlan[] = [];
  @Input() currentPlanId: string | null = null;
  @Input() loading: boolean = false;
  @Output() selectPlan = new EventEmitter<string>();

  // Outputs dépréciés - gardés pour compatibilité mais non utilisés
  @Output() paymentSuccess = new EventEmitter<{
    planId: string;
    details: any;
  }>();
  @Output() paymentError = new EventEmitter<{ planId: string; error: any }>();

  durations = ["1 mois", "3 mois", "6 mois", "12 mois"];
  selectedDuration = "1 mois";

  bestValue() {
    return this.plans.some((p) => p.bestValue);
  }

  onSelect(planId: string) {
    if (this.isCurrentPlan(planId)) {
      return;
    }
    this.selectPlan.emit(planId);
  }

  isCurrentPlan(planId: string): boolean {
    return this.currentPlanId === planId;
  }

  getButtonLabel(plan: PricingPlan): string {
    if (this.isCurrentPlan(plan.id)) {
      return 'payments.pricing.currentPlan';
    }
    return plan.buttonLabel;
  }
}
