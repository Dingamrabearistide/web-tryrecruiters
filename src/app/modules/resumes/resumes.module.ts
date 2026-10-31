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
import { ResumesRoutingModule } from "./resumes.routing";
import { ResumesDatatableComponent } from "./components/resumes-datatable/resumes-datatable.component";
import { ResumesFormComponent } from "./components/resumes-form/resumes-form.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

const toExport = [ResumesDatatableComponent, ResumesFormComponent];

@NgModule({
  declarations: [toExport],
  imports: [
    CommonModule,
    RouterModule,
    ResumesRoutingModule,
    CoreModule,
    SharedModule,
    FormsModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "resumes",
        loader,
      },
    },
  ],
  exports: [toExport],
})
export class ResumesModule {}
