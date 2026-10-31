import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  JobOfferModule,
  loader as JobOfferLoader,
} from "@modules/job-offers/job-offers.module";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { SupportedLanguages } from "../../transloco-loader";
import { CoreModule } from "../core/core.module";
import { SharedModule } from "../shared/shared.module";
import { HomeComponent } from "./home.component";
import { HomeRoutingModule } from "./home.routing";
import { FooterComponent } from "./layout/footer/footer.component";
import { NavbarComponent } from "./layout/header/navbar.component";
import {
  CandidatesDetailsPageComponent as HomeCandidatesDetailsPageComponent,
  CandidatesListPageComponent as HomeCandidatesListPageComponent,
  AboutPageComponent,
  ContactPageComponent,
  HomePageComponent,
  FaqsPageComponent,
  PrivacyPolicyPageComponent,
  TermsPageComponent,
  HowItWorksPageComponent,
  ApplyPageComponent,
} from "./pages";

import {
  CandidatesModule,
  loader as CandidatesLoader,
} from "@modules/candidates/candidates.module";

import {
  CompagniesModule,
  loader as CompaniesLoader,
} from "@modules/compagnies/compagnies.module";

import { ApplicationsModule } from "@modules/applications/applications.module";
import { GenericFormComponent } from "../../@1hand/components/generic-form/generic-form.component";

// Load base locale file and merge with large legal documents to keep main bundles lean
export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () =>
      Promise.all([
        import(`./i18n/${lang}.json`),
        import(`./i18n/legal-${lang}.json`),
      ]).then(([base, legal]) => ({
        ...base.default,
        legalDocuments: legal.default,
      }));
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

@NgModule({
  declarations: [
    HomeComponent,

    FooterComponent,

    HomePageComponent,
    AboutPageComponent,
    ContactPageComponent,

    // New static pages

    PrivacyPolicyPageComponent,
    TermsPageComponent,
    HowItWorksPageComponent,
    FaqsPageComponent,

    // Home candidates pages
    HomeCandidatesListPageComponent,
    HomeCandidatesDetailsPageComponent,

    // Apply page
    ApplyPageComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HomeRoutingModule,
    CoreModule,
    SharedModule,
    TranslocoModule,

    // Modules
    JobOfferModule,
    CandidatesModule,
    ApplicationsModule,
    CompagniesModule,

    // Standalone components
    GenericFormComponent,
    NavbarComponent,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "home",
        loader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "joboffers",
        loader: JobOfferLoader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "candidates",
        loader: CandidatesLoader,
      },
    },
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "companies",
        loader: CompaniesLoader,
      },
    },
  ],
})
export class HomeModule {}
