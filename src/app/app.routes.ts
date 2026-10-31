import { Routes } from "@angular/router";
import { NotFoundComponent } from "./@1hand/pages/not-found.component";
import { AuthGuard, UnAuthGuard } from "./modules/auth/auth.guard";

export const routes: Routes = [
  {
    path: "lab",
    loadChildren: () =>
      import("./@1hand/modules/lab/lab.module").then((m) => m.LabModule),
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./modules/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./modules/auth/auth.module").then((m) => m.AuthModule),
    canActivate: [UnAuthGuard],
  },
  {
    path: "",
    loadChildren: () =>
      import("./modules/home/home.module").then((m) => m.HomeModule),
  },
  {
    path: "**",
    component: NotFoundComponent,
  },
];
