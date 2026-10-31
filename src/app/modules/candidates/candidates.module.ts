import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Translation, TRANSLOCO_SCOPE } from "@ngneat/transloco";
import { SupportedLanguages } from "../../transloco-loader";
import { CandidatesRoutes } from "./candidates.routing";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";

// Components
import { CandidatesDatatableComponent } from "./components/candidates-datatable/candidates-datatable.component";
import { CandidatesFormComponent } from "./components/candidates-form/candidates-form.component";
import { CandidatesListComponent } from "./components/candidates-list/candidates-list.component";
import { CandidatesListItemComponent } from "./components/candidates-list-item/candidates-list-item.component";

// Pages
import { CandidatesListPageComponent } from "./pages/candidates-list-page/candidates-list-page.component";
import { CandidatesCreatePageComponent } from "./pages/candidates-create-page/candidates-create-page.component";
import { CandidatesUpdatePageComponent } from "./pages/candidates-update-page/candidates-update-page.component";
import { CandidatesDetailsPageComponent } from "./pages/candidates-details-page/candidates-details-page.component";
import { CandidatesDetails2Component } from "./components/candidates-details2/candidates-details2.component";
import { CandidatesExperiencesFormComponent } from "./components/candidates-experiences-form/candidates-experiences-form.component";
import { CandidatesExperiencesListComponent } from "./containers/candidates-experiences-list/candidates-experiences-list.component";
import { CandidateExperienceListItemComponent } from "./components/candidate-experience-list-item/candidate-experience-list-item.component";
import { CandidatesEducationsListComponent } from "./containers/candidates-educations-list/candidates-educations-list.component";
import { CandidateEducationListItemComponent } from "./components/candidate-education-list-item/candidate-education-list-item.component";
import { CandidatesCertificationsListComponent } from "./containers/candidates-certifications-list/candidates-certifications-list.component";
import { CandidateCertificationListItemComponent } from "./components/candidate-certification-list-item/candidate-certification-list-item.component";
import { CandidatesSkillsListComponent } from "./containers/candidates-skills-list/candidates-skills-list.component";
import { CandidateSkillListItemComponent } from "./components/candidate-skill-list-item/candidate-skill-list-item.component";
import { CandidatesLanguagesListComponent } from "./containers/candidates-languages-list/candidates-languages-list.component";
import { CandidateLanguageListItemComponent } from "./components/candidate-language-list-item/candidate-language-list-item.component";
import { CandidatesToolsListComponent } from "./containers/candidates-tools-list/candidates-tools-list.component";
import { CandidateToolListItemComponent } from "./components/candidate-tool-list-item/candidate-tool-list-item.component";
import { CandidatesPersonalInfoComponent } from "./containers/candidates-personal-info/candidates-personal-info.component";
import { SortByDatePipe } from "./pipes/sort-by-date.pipe";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

const components = [
  // Components
  CandidatesDatatableComponent,
  CandidatesFormComponent,
  CandidatesListComponent,
  CandidatesListItemComponent,
  CandidatesDetails2Component,
  CandidatesExperiencesFormComponent,
  CandidatesExperiencesListComponent,
  CandidateExperienceListItemComponent,
  CandidatesEducationsListComponent,
  CandidateEducationListItemComponent,
  CandidatesCertificationsListComponent,
  CandidateCertificationListItemComponent,
  CandidatesSkillsListComponent,
  CandidateSkillListItemComponent,
  CandidatesLanguagesListComponent,
  CandidateLanguageListItemComponent,
  CandidatesToolsListComponent,
  CandidateToolListItemComponent,
  CandidatesPersonalInfoComponent,
  SortByDatePipe,

  // Pages
  CandidatesListPageComponent,
  CandidatesCreatePageComponent,
  CandidatesUpdatePageComponent,
  CandidatesDetailsPageComponent,
];

@NgModule({
  declarations: [components],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: "candidates", loader },
    },
  ],
  exports: [components, RouterModule],
})
export class CandidatesSharedModule {}

@NgModule({
  imports: [
    CandidatesSharedModule,
    RouterModule.forChild(CandidatesRoutes),
  ],
  exports: [CandidatesSharedModule],
})
export class CandidatesModule {}
