import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { CoreModule } from "@modules/core/core.module";
import { SharedModule } from "@modules/shared/shared.module";
import {
  Translation,
  TranslocoModule,
  TRANSLOCO_SCOPE,
} from "@ngneat/transloco";
import { PricingPlansComponent } from "./pricing-plan/pricing-plan.component";
import { SupportedLanguages } from "../../transloco-loader";

const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

const toExport = [PricingPlansComponent];

@NgModule({
  declarations: [toExport],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslocoModule,
    MatDialogModule,
    CoreModule,
    SharedModule,
  ],
  exports: [toExport],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: "payments", loader },
    },
  ],
})
export class PermissionsModule {}
