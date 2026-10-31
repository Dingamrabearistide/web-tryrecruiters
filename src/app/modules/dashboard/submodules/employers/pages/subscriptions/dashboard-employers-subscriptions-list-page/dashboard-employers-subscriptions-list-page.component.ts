import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import {
//   SubscriptionService,
//   SubscriptionPlan,
//   CompanySubscription,
// } from "../../../../../../../core/services/subscription.service";
// import { PricingPlan } from "@modules/payments/pricing-plan/pricing-plan.component";
// import { AuthService } from "@modules/auth/auth.service";

@Component({
  standalone: false,
  selector: "app-dashboard-employers-subscriptions-list-page",
  templateUrl: "./dashboard-employers-subscriptions-list-page.component.html",
  styleUrls: ["./dashboard-employers-subscriptions-list-page.component.scss"],
})
export class DashboardEmployersSubscriptionsListPageComponent implements OnInit {
  // // Data
  // availablePlans: SubscriptionPlan[] = [];
  // currentSubscription: CompanySubscription | null = null;
  // accountId: string = "";
  // recruiterId: string = "";
  // loading = false;
  // error: string | null = null;

  // // Convertir les plans backend en format PricingPlan pour le composant pricing-plan
  // get plans(): PricingPlan[] {
  //   return this.availablePlans.map((plan) => ({
  //     id: plan.id,
  //     title: `dashboardemployers.subscriptions.plans.${plan.type}.title`,
  //     price: plan.price === 0 ? null : plan.price,
  //     currency: plan.currency ?? 'USD',
  //     buttonLabel: plan.price === 0
  //       ? 'dashboardemployers.subscriptions.plans.activate'
  //       : 'dashboardemployers.subscriptions.plans.subscribe',
  //     bestValue: plan.type === "ENTERPRISE" || plan.maxActiveJobOffers === -1,
  //     features: this.getPlanFeatures(plan),
  //   }));
  // }

  // // Convertir les caractéristiques du plan backend en features
  // private getPlanFeatures(plan: SubscriptionPlan) {
  //   const features = [];

  //   if (plan.maxActiveJobOffers !== null) {
  //     features.push({
  //       label:
  //         plan.maxActiveJobOffers === -1
  //           ? "dashboardemployers.subscriptions.features.unlimitedJobOffers"
  //           : "dashboardemployers.subscriptions.features.activeJobOffers",
  //       labelParams: plan.maxActiveJobOffers === -1 ? {} : { count: plan.maxActiveJobOffers },
  //       available: true,
  //     });
  //   }

  //   if (plan.canAccessCVDatabase !== undefined) {
  //     features.push({
  //       label: "dashboardemployers.subscriptions.features.cvDatabase",
  //       available: plan.canAccessCVDatabase,
  //     });
  //   }

  //   if (plan.canExportData !== undefined) {
  //     features.push({
  //       label: "dashboardemployers.subscriptions.features.exportData",
  //       available: plan.canExportData,
  //     });
  //   }

  //   if (plan.canUseAnalytics !== undefined) {
  //     features.push({
  //       label: "dashboardemployers.subscriptions.features.analytics",
  //       available: plan.canUseAnalytics,
  //     });
  //   }

  //   if (plan.canUsePrioritySupport !== undefined) {
  //     features.push({
  //       label: "dashboardemployers.subscriptions.features.prioritySupport",
  //       available: plan.canUsePrioritySupport,
  //     });
  //   }

  //   if (plan.canFeaturedJobOffers !== undefined) {
  //     features.push({
  //       label: "dashboardemployers.subscriptions.features.featuredOffers",
  //       available: plan.canFeaturedJobOffers,
  //     });
  //   }

  //   if (plan.canCustomBranding !== undefined) {
  //     features.push({
  //       label: "dashboardemployers.subscriptions.features.customBranding",
  //       available: plan.canCustomBranding,
  //     });
  //   }

  //   return features;
  // }

  // get employerId() {
  //   const user = this.authService.getUser();
  //   return user && this.authService.isRecruiter() ? user.id : null;
  // }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    // private subscriptionService: SubscriptionService,
    // private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // if (!this.employerId) {
    //   console.error("No employerId found");
    //   return;
    // }
    // this.recruiterId = this.employerId;
    // this.loadAvailablePlans();
    // if (this.recruiterId) {
    //   this.loadCurrentSubscription();
    // }
  }

  // loadAvailablePlans() {
  //   this.loading = true;
  //   this.subscriptionService.getAllPlans().subscribe({
  //     next: (plans) => {
  //       this.availablePlans = plans;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       console.error("Erreur chargement plans:", err);
  //       this.error = "Impossible de charger les plans";
  //       this.loading = false;
  //     },
  //   });
  // }

  // loadCurrentSubscription() {
  //   if (!this.recruiterId) return;
  //   this.subscriptionService.getRecruiterSubscription(this.recruiterId).subscribe({
  //     next: (subscription) => { this.currentSubscription = subscription; },
  //     error: (err) => { console.error("Erreur chargement souscription:", err); },
  //   });
  // }

  // paymentSuccessMessage: string | null = null;
  // paymentErrorMessage: string | null = null;
  // processingPlanId: string | null = null;

  // onSelectPlan(planId: string) {
  //   const backendPlan = this.availablePlans.find((plan) => plan.id === planId);
  //   if (!backendPlan) { this.paymentErrorMessage = "Plan introuvable"; return; }
  //   if (!this.recruiterId) { this.paymentErrorMessage = "Identifiant recruteur introuvable"; return; }
  //   if (backendPlan.price === 0) {
  //     this.createSubscription(planId);
  //   } else {
  //     const employerId =
  //       this.route.snapshot.paramMap.get("employerId") ||
  //       this.route.parent?.snapshot.paramMap.get("employerId") ||
  //       this.route.parent?.parent?.snapshot.paramMap.get("employerId");
  //     if (employerId) {
  //       this.router.navigate(["/dashboard/employers", employerId, "subscriptions", "payments", backendPlan.id]);
  //     }
  //   }
  // }

  // createSubscription(planId: string): void {
  //   this.processingPlanId = planId;
  //   this.paymentSuccessMessage = null;
  //   this.paymentErrorMessage = null;
  //   this.subscriptionService.createSubscription({ recruiterId: this.recruiterId, planId, autoRenew: false }).subscribe({
  //     next: (subscription) => {
  //       this.processingPlanId = null;
  //       this.currentSubscription = subscription;
  //       this.paymentSuccessMessage = `Souscription "${subscription.plan.name}" activée avec succès!`;
  //       setTimeout(() => { this.paymentSuccessMessage = null; }, 5000);
  //       this.loadCurrentSubscription();
  //     },
  //     error: (err) => {
  //       this.processingPlanId = null;
  //       this.paymentErrorMessage = err?.error?.message || "Erreur lors de la création de la souscription";
  //       setTimeout(() => { this.paymentErrorMessage = null; }, 5000);
  //     },
  //   });
  // }

  // onPaymentSuccess(event: { planId: string; details: any }) {}
  // onPaymentError(event: { planId: string; error: any }) {}
  // onSelectFreePlan(planId: string) { this.onSelectPlan(planId); }
}
