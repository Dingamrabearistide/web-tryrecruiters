import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { BillingsService } from "../../@1hand/modules/billings/billings.service";

@Injectable({
  providedIn: "root",
})
export class SubscriptionGuard implements CanActivate {
  constructor(
    private billingsService: BillingsService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.billingsService.checkCurrentPlanValidity().pipe(
      map((result) => {
        if (result.valid) {
          return true;
        }
        return this.router.createUrlTree(["/dashboard/employers/subscriptions"], {
          queryParams: {
            returnUrl: state.url,
            reason: result.reason,
          },
        });
      }),
      catchError(() => {
        // Fail open — don't block the user if billing check errors
        return of(true as true);
      })
    );
  }
}
