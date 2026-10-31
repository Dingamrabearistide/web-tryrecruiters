import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { inject } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import { Observable, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthService } from "./auth.service";

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn,
): Observable<HttpEvent<any>> => {
  const token = localStorage.getItem("access-token");
  const transloco = inject(TranslocoService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);

  const currentLang = transloco.getActiveLang();
  const skipAuth = req.headers.has('skip');

  const modifiedReq = req.clone({
    headers: req.headers.delete('skip'),
    setHeaders: {
      ...(token && !skipAuth ? { Authorization: `Bearer ${token}` } : {}),
      "Accept-Language": currentLang,
      // Backend picks the email language from this header first, falling
      // back to Accept-Language, so send both explicitly.
      "lang": currentLang,
    },
  });

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 401 = Token invalide/expiré → Déconnecter
      if (error.status === 401) {
        authService.logout();
        const message = transloco.translate("auth.errors.sessionExpired");

        router.navigate(["/auth/login"], {
          queryParams: { message },
        });
        snackBar.open(message, "OK", {
          duration: 10000,
          panelClass: ["snackbar-danger"],
        });
      }

      // 403 = Permissions insuffisantes → Afficher erreur sans déconnecter
      if (error.status === 403) {
        const message = transloco.translate("auth.errors.forbidden");
        snackBar.open(message, "OK", {
          duration: 5000,
          panelClass: ["snackbar-danger"],
        });
      }

      return throwError(() => error);
    }),
  );
};
