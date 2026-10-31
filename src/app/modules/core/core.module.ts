import { NgModule } from "@angular/core";
import { AvatarDropdownComponent } from "../core/components/avatar-dropdown/avatar-dropdown.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { SupportedLanguages } from "../../transloco-loader";
import { LanguageSwitcherComponent } from "./components/language-switcher.component";
import { NotificationsDropdownComponent } from "./components/notifications-dropdown/notifications-dropdown.component";
import { FormsModule } from "@angular/forms";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

// const toExport = [];

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    TranslocoModule,
    LanguageSwitcherComponent,
    AvatarDropdownComponent,
    NotificationsDropdownComponent,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "core",
        loader,
      },
    },
  ],
  exports: [
    LanguageSwitcherComponent,
    AvatarDropdownComponent,
    NotificationsDropdownComponent,
  ],
})
export class CoreModule {}
