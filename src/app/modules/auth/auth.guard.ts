import { inject } from "@angular/core";
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { ACCESS_TOKEN_KEY } from "./auth.service";

export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (token) {
    return true;
  } else {
    router.navigate(["/auth/login"], {
      //   queryParams: { returnUrl: state.url },
    });
    return false;
  }
};

export const UnAuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  if (!token) {
    return true;
  } else {
    router.navigate(["/"], {
      //   queryParams: { returnUrl: state.url },
    });
    return false;
  }
};
