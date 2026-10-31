import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "candidates",
        loadChildren: () =>
          import("./submodules/candidates/dashboard-candidates.module").then(
            (m) => m.DashboardCandidatesModule
          ),
      },
      {
        path: "employers",
        loadChildren: () =>
          import("./submodules/employers/dashboard-employers.module").then(
            (m) => m.DashboardEmployersModule
          ),
      },
      {
        path: "admin",
        loadChildren: () =>
          import("./submodules/admin/dashboard-admin.module").then(
            (m) => m.DashboardAdminModule
          ),
      },
      { path: "", redirectTo: "candidates", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
