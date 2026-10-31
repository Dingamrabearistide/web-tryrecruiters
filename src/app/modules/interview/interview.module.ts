import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Translation, TRANSLOCO_SCOPE } from "@ngneat/transloco";

import { InterviewFormComponent } from "./components/interview-form/interview-form.component";
import { InterviewListComponent } from "./components/interview-list/interview-list.component";
import { InterviewsDatatableComponent } from "./components/interviews-datatable/interviews-datatable.component";

import { InterviewListPageComponent } from "./pages/interview-list-page/interview-list-page.component";

import { CoreModule } from "@modules/core/core.module";
import { SharedModule } from "@modules/shared/shared.module";
import { SupportedLanguages } from "../../transloco-loader";
import { InterviewScheduleModalComponent } from "./containers/interview-schedule-modal/interview-schedule-modal.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

const toExport = [
  InterviewFormComponent,
  InterviewListComponent,
  InterviewsDatatableComponent,
  InterviewScheduleModalComponent,

  // Pages
  InterviewListPageComponent,
];

@NgModule({
  declarations: [toExport],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CoreModule,
    SharedModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "interviews",
        loader,
      },
    },
  ],
  exports: [toExport],
})
export class InterviewModule {}
