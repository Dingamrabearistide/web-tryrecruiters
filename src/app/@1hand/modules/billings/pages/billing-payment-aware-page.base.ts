import {
  AfterViewInit,
  ComponentRef,
  Directive,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  inject,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";

import {
  PROJECT_BILLING_ACCESS_CONFIG,
  resolveBillingAccessConfig,
} from "../access/billing-access.config";
import { BillingAccessService } from "../access/billing-access.service";
import {
  BillingAccessConfig,
  BillingAccessDecision,
  BillingAccessNavigationContext,
  BillingPlansTarget,
  isBillingAccessDeniedReason,
} from "../access/billing-access.types";
import { BillingPaymentRequiredAlertComponent } from "../components/billing-payment-required-alert/billing-payment-required-alert.component";

@Directive()
export abstract class BillingPaymentAwarePageBase
  implements AfterViewInit, OnDestroy
{
  @ViewChild("billingPaymentAlertHost", { read: ViewContainerRef })
  private billingPaymentAlertHost?: ViewContainerRef;

  protected readonly billingAccessService = inject(BillingAccessService);
  protected readonly billingRouter = inject(Router);
  protected readonly billingRoute = inject(ActivatedRoute);

  private accessSubscription?: Subscription;
  private alertActionSubscription?: Subscription;
  private alertComponentRef?: ComponentRef<BillingPaymentRequiredAlertComponent>;

  protected get billingAccessConfig(): BillingAccessConfig {
    return PROJECT_BILLING_ACCESS_CONFIG;
  }

  ngAfterViewInit(): void {
    queueMicrotask(() => this.refreshBillingAccessAlert());
  }

  ngOnDestroy(): void {
    this.accessSubscription?.unsubscribe();
    this.alertActionSubscription?.unsubscribe();
    this.alertComponentRef?.destroy();
  }

  protected refreshBillingAccessAlert(): void {
    this.accessSubscription?.unsubscribe();

    this.accessSubscription = this.billingAccessService
      .check(this.billingAccessConfig)
      .subscribe((decision) => this.renderBillingAlert(decision));
  }

  private renderBillingAlert(decision: BillingAccessDecision): void {
    const host = this.billingPaymentAlertHost;

    if (!host) {
      console.warn(
        "BillingPaymentAwarePageBase: ajoutez <div #billingPaymentAlertHost></div> dans le template.",
      );
      return;
    }

    this.clearBillingPaymentAlert(host);

    if (decision.allowed || !isBillingAccessDeniedReason(decision.reason)) {
      return;
    }

    const deniedReason = decision.reason;
    const componentRef = host.createComponent(BillingPaymentRequiredAlertComponent);

    this.alertComponentRef = componentRef;
    componentRef.instance.title = decision.config.alert.title ?? "Paiement requis";
    componentRef.instance.message =
      decision.message ??
      decision.config.alert.messages?.[deniedReason] ??
      "Vous devez choisir un forfait pour continuer.";
    componentRef.instance.actionLabel = decision.config.alert.actionLabel ?? "Voir les forfaits";
    componentRef.instance.reason = deniedReason;

    this.alertActionSubscription = componentRef.instance.action.subscribe(() =>
      this.navigateToBillingPlans(decision),
    );

    componentRef.changeDetectorRef.detectChanges();
  }

  private clearBillingPaymentAlert(host: ViewContainerRef): void {
    this.alertActionSubscription?.unsubscribe();
    this.alertActionSubscription = undefined;
    this.alertComponentRef?.destroy();
    this.alertComponentRef = undefined;
    host.clear();
  }

  private navigateToBillingPlans(decision: BillingAccessDecision): void {
    const config = resolveBillingAccessConfig(this.billingAccessConfig);
    const currentUrl = this.billingRouter.url;

    const context: BillingAccessNavigationContext = { currentUrl, decision };
    const target = this.resolveTarget(config.plansTarget, context);

    if (Array.isArray(target)) {
      void this.billingRouter.navigate(target, {
        queryParams: {
          [config.reasonQueryParam]: decision.reason,
          [config.returnUrlQueryParam]: currentUrl,
        },
      });
      return;
    }

    const tree = this.billingRouter.parseUrl(target);
    tree.queryParams = {
      ...tree.queryParams,
      [config.reasonQueryParam]: decision.reason,
      [config.returnUrlQueryParam]: currentUrl,
    };

    void this.billingRouter.navigateByUrl(tree);
  }

  private resolveTarget(
    target: BillingPlansTarget,
    context: BillingAccessNavigationContext,
  ): string | any[] {
    return typeof target === "function" ? target(context) : target;
  }
}
