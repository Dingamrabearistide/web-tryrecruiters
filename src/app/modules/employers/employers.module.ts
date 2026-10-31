import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { SupportedLanguages } from "../../transloco-loader";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { EmployersRoutingModule } from "./employers.routing";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule,
    EmployersRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "employers",
        loader,
      },
    },
  ],
  exports: [],
})
export class EmployersModule {}
