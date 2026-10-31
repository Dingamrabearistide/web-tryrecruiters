import { Routes } from "@angular/router";
import { CandidatesListPageComponent } from "./pages/candidates-list-page/candidates-list-page.component";
import { CandidatesCreatePageComponent } from "./pages/candidates-create-page/candidates-create-page.component";
import { CandidatesUpdatePageComponent } from "./pages/candidates-update-page/candidates-update-page.component";
import { CandidatesDetailsPageComponent } from "./pages/candidates-details-page/candidates-details-page.component";

export const CandidatesRoutes: Routes = [
  {
    path: "",
    redirectTo: "list",
    pathMatch: "full",
  },
  {
    path: "list",
    component: CandidatesListPageComponent,
  },
  {
    path: "create",
    component: CandidatesCreatePageComponent,
  },
  {
    path: "update/:id",
    component: CandidatesUpdatePageComponent,
  },
  {
    path: ":id",
    component: CandidatesDetailsPageComponent,
  },
];
