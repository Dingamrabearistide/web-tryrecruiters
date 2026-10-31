import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AuthService } from "@modules/auth/auth.service";
import { BillingsService } from "../../@1hand/modules/billings/billings.service";

export type SubscriptionLimitType =
  | "companies"
  | "jobOffers"
  | "interviews"
  | "applications";

@Injectable({
  providedIn: "root",
})
export class SubscriptionLimitGuard implements CanActivate {
  constructor(
    private billingsService: BillingsService,
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const limitType = route.data["limitType"] as SubscriptionLimitType;

    if (!limitType) {
      return true;
    }

    return this.billingsService.checkCurrentPlanValidity().pipe(
      map((result) => {
        if (!result.valid) {
          const user = this.authService.getUser();
          const empId = user?.id ?? "";
          return this.router.createUrlTree(
            [`/dashboard/employers/${empId}/subscriptions/list`],
            { queryParams: { limitReached: limitType } }
          );
        }
        return true as true;
      }),
      catchError(() => {
        // Fail open — don't block the user if billing check errors
        return of(true as true);
      })
    );
  }
}
