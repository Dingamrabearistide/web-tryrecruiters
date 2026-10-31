import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { AboutPageComponent } from "./pages/about-page/about-page.component";
import { ContactPageComponent } from "./pages/contact-page/contact-page.component";
import { JobOffersListPageComponent } from "./pages/job-offers/job-offers-list-page/job-offers-list-page.component";
import { JobOffersDetailsPageComponent } from "./pages/job-offers/job-offers-details-page/job-offers-details-page.component";
import { CompaniesListPageComponent } from "./pages/companies/companies-list-page/companies-list-page.component";
import { CompaniesDetailsPageComponent } from "./pages/companies/companies-details-page/companies-details-page.component";
import { CandidatesListPageComponent } from "./pages/candidates/candidates-list-page/candidates-list-page.component";
// import { FaqsPageComponent } from "./pages/faqs/faqs-page.component";
import { PrivacyPolicyPageComponent } from "./pages/privacy-policy/privacy-policy-page.component";
import { TermsPageComponent } from "./pages/terms/terms-page.component";
import { HowItWorksPageComponent } from "./pages/how-it-works/how-it-works-page.component";
import { NotFoundComponent } from "../../@1hand/pages/not-found.component";
import {
  CandidatesDetailsPageComponent,
  FaqsPageComponent,
  ApplyPageComponent,
} from "./pages";
import { MeetingsManagerComponent } from "@modules/video-calls/pages/meetings-manager/meetings-manager.component";
import { CallRoomComponent } from "@modules/video-calls/pages/call-room/call-room.component";
import { ServerErrorComponent } from "../../@1hand/pages/server-error.component";
const routes: Routes = [
  {
    path: "meetings/call-rooms",
    component: CallRoomComponent,
  },
  {
    path: "",
    component: HomeComponent,
    children: [
      { path: "", component: HomePageComponent },
      { path: "about", component: AboutPageComponent },
      { path: "contact", component: ContactPageComponent },
      { path: "jobs", component: JobOffersListPageComponent },
      { path: "jobs/:slug", component: JobOffersDetailsPageComponent },
      { path: "apply/:id", component: ApplyPageComponent },
      {
        path: "meetings",
        component: MeetingsManagerComponent,
      },

      { path: "employers", component: CompaniesListPageComponent },
      { path: "employers/:slug", component: CompaniesDetailsPageComponent },

      { path: "candidates", component: CandidatesListPageComponent },
      { path: "candidates/:id", component: CandidatesDetailsPageComponent },

      // Static/support pages
      { path: "faqs", component: FaqsPageComponent },
      { path: "privacy-policy", component: PrivacyPolicyPageComponent },
      { path: "terms", component: TermsPageComponent },
      { path: "how-it-works", component: HowItWorksPageComponent },
      { path: "server-error", component: ServerErrorComponent },

      { path: "**", component: NotFoundComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
