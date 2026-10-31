import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
// import { DashbaordEmployersUsersListPageComponent } from "@modules/dashboard/submodules/employers/pages/users/dashbaord-employers-users-list-page/dashbaord-employers-users-list-page.component";
// import { DashboardEmployersUsersDetailsPageComponent } from "@modules/dashboard/submodules/employers/pages/users/dashbaord-employers-users-details-page/dashboard-employers-users-details-page.component";

const routes: Route[] = [
  // { path: "list", component: DashbaordEmployersUsersListPageComponent },
  // { path: "create", component: DashbaordEmployersUsersCreatePageComponent },
  // { path: ":id", component: DashboardEmployersUsersDetailsPageComponent },
  // { path: "edit/:id", component: DashbaordEmployersUsersUpdatePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRouting {}
