import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ErrorService } from "../services/error.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorService: ErrorService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const status = error.status;

        // Erreurs HTTP natives
        if (status >= 100 && status < 600) {
          // Laisser les erreurs natives être traitées par les composants
          return throwError(() => error);
        }

        // Erreurs techniques/bizarres (non-HTTP natives)
        const appError = this.errorService.handleHttpError(error);
        return throwError(() => appError);
      }),
    );
  }
}
