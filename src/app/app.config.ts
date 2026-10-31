import {
  ApplicationConfig,
  provideZoneChangeDetection,
  isDevMode,
  APP_INITIALIZER,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideAnimations } from "@angular/platform-browser/animations";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideTransloco } from "@ngneat/transloco";
import { defaultLanguage, TranslocoHttpLoader } from "./transloco-loader";
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { AuthInterceptor } from "./modules/auth/auth.interceptor";
import { AuthService } from "./modules/auth/auth.service";

/**
 * Initialise le profil utilisateur au démarrage de l'application
 */
export function initializeApp(authService: AuthService) {
  return (): Promise<any> => {
    return authService.loadCurrentUser();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withInterceptors([AuthInterceptor])),
    provideRouter(routes),
    provideTransloco({
      config: {
        availableLangs: ["en", "fr"],
        defaultLang: defaultLanguage,
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: TranslocoHttpLoader,
    }),
    provideAnimationsAsync(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true,
    },
  ],
};
