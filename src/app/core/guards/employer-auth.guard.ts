import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "@modules/auth/auth.service";

/**
 * Guard to restrict access to employer-only pages (like candidates list)
 * Only logged-in employers (recruiters) can access these pages
 */
@Injectable({
  providedIn: "root",
})
export class EmployerAuthGuard implements CanActivate {
  constructor(
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
    // Check if user is logged in and is an employer/recruiter
    const isEmployer = this.authService.isRecruiter();

    if (isEmployer) {
      return true;
    }

    // User is not an employer - redirect to login
    return this.router.createUrlTree(["/auth/login"], {
      queryParams: {
        returnUrl: state.url,
        reason: "employer_access_required",
      },
    });
  }
}
