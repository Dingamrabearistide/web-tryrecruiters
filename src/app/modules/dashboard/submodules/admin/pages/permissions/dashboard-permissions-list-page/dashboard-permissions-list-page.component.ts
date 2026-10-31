import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { PermissionsService } from "@modules/permissions/permissions.service";
import { Permission } from "@modules/permissions/permissions.type";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-permissions-list-page",
  templateUrl: "./dashboard-permissions-list-page.component.html",
})
export class DashboardPermissionsListPageComponent
  extends BaseListDeletePageComponent<Permission>
  implements OnInit
{
  moduleName = "permissions";

  startDate: string = "";
  endDate: string = "";
  keyword: string = "";
  resource: string = "";
  action: string = "";

  constructor(
    service: PermissionsService,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog
  ) {
    super(service, route, router, transloco, dialog);
  }

  onSearch(): void {
    this.page = 1;
    this.limit = 10;
    this.updateQueryParams();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updateQueryParams();
  }

  handleCreate() {
    this.router.navigate(["../create"], { relativeTo: this.route });
  }

  handleView(item: Permission) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: Permission) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }

  onReset() {
    this.startDate = "";
    this.endDate = "";
    this.keyword = "";
    this.resource = "";
    this.action = "";
    this.onSearch();
  }

  protected onParamsInit(params: any): void {
    this.startDate = params["startDate"] || "";
    this.endDate = params["endDate"] || "";
    this.keyword = params["keyword"] || "";
    this.resource = params["resource"] || "";
    this.action = params["action"] || "";
  }

  protected getListParams(): any {
    return {
      page: this.page,
      limit: this.limit,
      search: this.keyword,
      resource: this.resource || undefined,
      action: this.action || undefined,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
    };
  }

  protected getItemId(item: Permission): string {
    return item.id;
  }

  protected getItemLabel(item: Permission): string {
    return item.name;
  }

  protected getDeleteTitle(item: Permission): string {
    return this.transloco.translate("permissions.delete.title");
  }

  protected getDeleteMessage(item: Permission): string {
    return this.transloco.translate("permissions.delete.message", {
      name: item.name,
    });
  }
}
