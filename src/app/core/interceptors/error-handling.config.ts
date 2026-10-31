import { ErrorInterceptor } from "./error.interceptor";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorService } from "@core/services/error.service";
import { ErrorOverlayComponent } from "@1hand/components/error-overlay/error-overlay.component";

/**
 * Configuration du système de gestion d'erreurs global
 * À ajouter dans app.module.ts ou app.config.ts
 */
export const ERROR_HANDLING_CONFIG = {
  // Providers pour le module
  providers: [
    ErrorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  // Composant à déclarer
  declarations: [ErrorOverlayComponent],
  // Composant à importer dans le composant racine
  imports: [ErrorOverlayComponent],
};

/**
 * Instructions d'intégration:
 *
 * 1. Dans app.module.ts (CommonJS):
 *    - Importer ERROR_HANDLING_CONFIG
 *    - Ajouter les providers: providers: [...ERROR_HANDLING_CONFIG.providers]
 *    - Déclarer le composant: declarations: [...ERROR_HANDLING_CONFIG.declarations]
 *
 * 2. Dans app.component.ts:
 *    - Ajouter <app-error-overlay></app-error-overlay> au template HTML
 *
 * 3. Utilisation:
 *    - Les erreurs HTTP seront automatiquement gérées
 *    - Les erreurs JS non gérées seront capturées
 *    - Un code d'erreur unique sera généré pour chaque erreur technique
 */
