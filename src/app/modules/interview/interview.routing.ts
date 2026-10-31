import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InterviewListPageComponent } from "./pages/interview-list-page/interview-list-page.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "",
        component: InterviewListPageComponent,
      },

      // { path: "", redirectTo: "candidates", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployersRoutingModule {}
