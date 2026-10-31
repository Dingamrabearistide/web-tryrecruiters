import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { map } from "rxjs";

import { BillingAccessService } from "./billing-access.service";
import {
  BillingAccessConfig,
  BillingAccessNavigationContext,
  BillingPlansTarget,
} from "./billing-access.types";

export function billingAccessGuard(config: BillingAccessConfig): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const accessService = inject(BillingAccessService);

    return accessService.check(config).pipe(
      map((decision) => {
        if (decision.allowed) {
          return true;
        }

        const context: BillingAccessNavigationContext = {
          route,
          state,
          currentUrl: state.url,
          decision,
        };

        const target = resolveTarget(decision.config.plansTarget, context);
        const urlTree = createTargetUrlTree(router, target);

        urlTree.queryParams = {
          ...urlTree.queryParams,
          [decision.config.reasonQueryParam]: decision.reason,
          [decision.config.returnUrlQueryParam]: state.url,
        };

        return urlTree;
      }),
    );
  };
}

function resolveTarget(
  target: BillingPlansTarget,
  context: BillingAccessNavigationContext,
): string | any[] {
  return typeof target === "function" ? target(context) : target;
}

function createTargetUrlTree(router: Router, target: string | any[]): UrlTree {
  if (Array.isArray(target)) {
    return router.createUrlTree(target);
  }

  return router.parseUrl(target);
}
