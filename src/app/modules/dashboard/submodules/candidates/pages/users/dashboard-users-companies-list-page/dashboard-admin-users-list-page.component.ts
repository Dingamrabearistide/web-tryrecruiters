import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService as Service } from "@modules/users/users.service";
import { User as ModuleObject } from "@modules/users/users.type";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-users-list-page",
  templateUrl: "./dashboard-admin-users-list-page.component.html",
})
export class DashboardAdminUsersListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "users";

  startDate: string = "";
  endDate: string = "";
  userType: string = "";
  keyword: string = "";
  userGender: string = "";
  userStatus: string = "";
  userRole: string = "";

  constructor(
    service: Service,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog
  ) {
    super(service, route, router, transloco, dialog);
  }

  onSearch(): void {
    this.page = 1;
    this.updateQueryParams();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updateQueryParams();
  }

  handleCreate() {
    //
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: ModuleObject) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }

  onReset() {
    console.log("reset");
  }

  protected onParamsInit(params: any): void {
    // init des paramètres custom (keyword, date, etc.)
  }

  protected getListParams(): any {
    return {
      page: this.page,
      limit: this.limit,
      // autres filtres si besoin
    };
  }

  protected getItemId(item: ModuleObject): string {
    return item.id;
  }

  protected getItemLabel(item: ModuleObject): string {
    return item.name;
  }

  protected getDeleteTitle(item: ModuleObject): string {
    return this.transloco.translate("users.delete.title");
  }

  protected getDeleteMessage(item: ModuleObject): string {
    return this.transloco.translate("users.delete.message", {
      name: item.name,
    });
  }
}
