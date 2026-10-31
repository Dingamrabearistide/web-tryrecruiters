import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// import { AfterViewInit } from "@angular/core";
// import {
//   SubscriptionService,
//   SubscriptionPlan,
// } from "../../../../../../../core/services/subscription.service";
// import { PayPalService } from "../../../../../../../core/services/paypal.service";
// import { AuthService } from "@modules/auth/auth.service";
// import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,
  selector: "app-dashboard-employers-subscription-payment-page",
  templateUrl: "./dashboard-employers-subscription-payment-page.component.html",
  styleUrls: ["./dashboard-employers-subscription-payment-page.component.scss"],
})
export class DashboardEmployersSubscriptionPaymentPageComponent implements OnInit {
  // selectedPlan: SubscriptionPlan | null = null;
  // accountId: string = "";
  // recruiterId: string = "";
  // loading = true;
  // error: string | null = null;
  // paymentProcessing = false;
  // paymentSuccessMessage: string | null = null;
  // paymentErrorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    // private subscriptionService: SubscriptionService,
    // private paypalService: PayPalService,
    // private authService: AuthService,
    // private transloco: TranslocoService,
  ) {}

  // getPlanTitle(plan: SubscriptionPlan): string {
  //   return this.transloco.translate(`dashboardemployers.subscriptions.plans.${plan.type}.title`);
  // }

  ngOnInit(): void {
    // const planId = this.route.snapshot.paramMap.get("planId");
    // const user = this.authService.getUser();
    // if (!user || !this.authService.isRecruiter()) {
    //   this.error = "Erreur: Utilisateur non authentifié";
    //   this.loading = false;
    //   return;
    // }
    // this.recruiterId = user.id;
    // this.accountId = user.id;
    // if (!planId) { this.error = "Erreur: Plan non spécifié"; this.loading = false; return; }
    // this.loadPlan(planId);
  }

  // loadPlan(planId: string): void {
  //   this.loading = true;
  //   this.subscriptionService.getPlanById(planId).subscribe({
  //     next: (plan) => {
  //       this.selectedPlan = plan;
  //       this.loading = false;
  //       if (plan.price === 0) {
  //         this.createFreeSubscription();
  //       } else {
  //         setTimeout(() => { this.loadPayPalButton(); }, 100);
  //       }
  //     },
  //     error: (err) => {
  //       console.error("Erreur chargement plan:", err);
  //       this.error = "Impossible de charger les détails du plan";
  //       this.loading = false;
  //     },
  //   });
  // }

  // createFreeSubscription(): void {
  //   this.paymentProcessing = true;
  //   this.subscriptionService.createSubscription({ recruiterId: this.recruiterId, planId: this.selectedPlan!.id, autoRenew: false }).subscribe({
  //     next: () => {
  //       this.paymentProcessing = false;
  //       this.paymentSuccessMessage = "Souscription activée avec succès!";
  //       setTimeout(() => { this.navigateToSubscriptions(); }, 2000);
  //     },
  //     error: (err) => {
  //       this.paymentProcessing = false;
  //       this.paymentErrorMessage = "Erreur lors de l'activation du forfait gratuit.";
  //       console.error("Erreur création souscription:", err);
  //     },
  //   });
  // }

  // async loadPayPalButton(): Promise<void> {
  //   if (!this.selectedPlan) return;
  //   let amountUsd = 0;
  //   const planCurrency = (this.selectedPlan.currency || "").toUpperCase();
  //   const planPrice = Number(this.selectedPlan.price) || 0;
  //   const planPriceUsd = (this.selectedPlan as any).priceUsd;
  //   if (planCurrency === "USD") {
  //     amountUsd = planPrice;
  //   } else if (typeof planPriceUsd === "number" && planPriceUsd > 0) {
  //     amountUsd = planPriceUsd;
  //   } else {
  //     amountUsd = this.paypalService.convertFcfaToUsd(planPrice);
  //   }
  //   if (!amountUsd || amountUsd <= 0) { this.paymentErrorMessage = "Montant invalide pour le paiement."; return; }
  //   amountUsd = Math.round(amountUsd * 100) / 100;
  //   await this.paypalService.renderPayPalButton(
  //     "paypal-button-container", amountUsd, "USD", this.selectedPlan.name,
  //     (details) => { this.onPaymentSuccess(details); },
  //     (error) => { this.onPaymentError(error); },
  //     () => { this.onPaymentCancel(); },
  //   );
  // }

  // onPaymentSuccess(details: any): void {
  //   const orderId = details?.id;
  //   if (!orderId) { this.paymentErrorMessage = "ID de commande PayPal manquant"; return; }
  //   this.paymentProcessing = true;
  //   this.paymentSuccessMessage = null;
  //   this.paymentErrorMessage = null;
  //   this.subscriptionService.upgradeSubscription({
  //     newPlanId: this.selectedPlan!.id,
  //     recruiterId: this.recruiterId,
  //     returnUrl: "https://app.tryrecruiters.com/payment/success",
  //     cancelUrl: "https://app.tryrecruiters.com/payment/cancel",
  //     autoRenew: true,
  //   }).subscribe({
  //     next: () => {
  //       this.paymentProcessing = false;
  //       this.paymentSuccessMessage = `Forfait "${this.selectedPlan!.name}" activé avec succès!`;
  //       setTimeout(() => { this.navigateToSubscriptions(); }, 2000);
  //     },
  //     error: (err) => {
  //       this.paymentProcessing = false;
  //       this.paymentErrorMessage = "Paiement réussi mais erreur lors de l'enregistrement. Contactez le support avec l'ID: " + orderId;
  //       console.error("Erreur upgrade souscription:", err);
  //     },
  //   });
  // }

  // onPaymentError(error: any): void {
  //   console.error("Payment error:", error);
  //   this.paymentErrorMessage = "Une erreur est survenue lors du paiement. Veuillez réessayer.";
  // }

  // onPaymentCancel(): void { this.navigateToSubscriptions(); }

  // goBack(): void { this.navigateToSubscriptions(); }

  // private navigateToSubscriptions(): void {
  //   const employerId = this.route.snapshot.paramMap.get("employerId") || this.recruiterId;
  //   this.router.navigate(["/dashboard/employers", employerId, "subscriptions", "list"]);
  // }
}
