import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppError {
  id: string;
  title: string;
  message: string;
  code?: string;
  timestamp: Date;
  stack?: string;
  context?: any;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errorSubject = new BehaviorSubject<AppError | null>(null);
  public error$ = this.errorSubject.asObservable();

  constructor() {
    // Capture les erreurs non gérées
    window.addEventListener('error', (event) => {
      this.handleError({
        title: 'Erreur technique',
        message: event.message || 'Une erreur inattendue s\'est produite',
        stack: event.error?.stack,
        context: { filename: event.filename, lineno: event.lineno },
      });
    });

    // Capture les rejets de promesses non gérées
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        title: 'Erreur d\'exécution',
        message: event.reason?.message || 'Une erreur d\'exécution s\'est produite',
        stack: event.reason?.stack,
      });
    });
  }

  /**
   * Génère un code d'erreur unique
   */
  private generateErrorCode(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `ERR-${timestamp}-${random}`.toUpperCase();
  }

  /**
   * Enregistre une erreur et la diffuse
   */
  public handleError(error: Partial<AppError>): AppError {
    const appError: AppError = {
      id: this.generateErrorCode(),
      title: error.title || 'Erreur inconnue',
      message: error.message || 'Une erreur s\'est produite',
      code: error.code,
      timestamp: new Date(),
      stack: error.stack,
      context: error.context,
    };

    console.error('[ERROR SERVICE]', appError);
    this.errorSubject.next(appError);

    return appError;
  }

  /**
   * Gère les erreurs HTTP
   */
  public handleHttpError(error: any): AppError {
    const status = error?.status;
    const isNativeHttpError = status >= 100 && status < 600;

    // Si c'est une erreur HTTP native, la laisser être gérée normalement
    if (isNativeHttpError && [400, 401, 403, 404, 500, 502, 503].includes(status)) {
      throw error;
    }

    // Sinon, c'est une erreur technique
    return this.handleError({
      title: 'Erreur de communication',
      message: error?.error?.message || 'Impossible de communiquer avec le serveur',
      code: error?.status?.toString(),
      context: { errorResponse: error?.error },
    });
  }

  /**
   * Récupère la dernière erreur
   */
  public getLastError(): AppError | null {
    return this.errorSubject.value;
  }

  /**
   * Efface l'erreur
   */
  public clearError(): void {
    this.errorSubject.next(null);
  }
}
