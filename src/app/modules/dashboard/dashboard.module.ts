import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Translation, TRANSLOCO_SCOPE } from "@ngneat/transloco";
import { SupportedLanguages } from "../../transloco-loader";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { DashboardRoutingModule } from "./dashboard.routing";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce(
    (acc, lang) => {
      acc[lang] = () => import(`./i18n/${lang}.json`);
      return acc;
    },
    {} as Record<string, () => Promise<Translation>>,
  );

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    DashboardRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "dashboard",
        loader,
      },
    },
  ],
  exports: [],
})
export class DashboardModule {}
