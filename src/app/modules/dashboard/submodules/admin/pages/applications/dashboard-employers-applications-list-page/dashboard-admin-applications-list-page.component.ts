import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationsService as Service } from "@modules/applications/applications.service";
import { Application as ModuleObject } from "@modules/applications/applications.types";
import { TranslocoService } from "@ngneat/transloco";
import { MatDialog } from "@angular/material/dialog";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-applications-list-page",
  templateUrl: "./dashboard-admin-applications-list-page.component.html",
  styleUrls: ["./dashboard-admin-applications-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminApplicationsListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "applications";

  startDate: string = "";
  endDate: string = "";
  status: string = "";
  keyword: string = "";

  constructor(
    service: Service,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog
  ) {
    super(service, route, router, transloco, dialog);
  }

  protected onParamsInit(params: any): void {
    this.startDate = params["startDate"] || "";
    this.endDate = params["endDate"] || "";
    this.status = params["status"] || "";
    this.keyword = params["keyword"] || "";
  }

  protected getListParams(): any {
    return {
      page: this.page,
      limit: this.limit,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      status: this.status || undefined,
      keyword: this.keyword || undefined,
    };
  }

  protected override updateQueryParams(): void {
    const queryParams: any = { page: this.page, limit: this.limit };
    if (this.startDate) queryParams.startDate = this.startDate;
    if (this.endDate) queryParams.endDate = this.endDate;
    if (this.status) queryParams.status = this.status;
    if (this.keyword) queryParams.keyword = this.keyword;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: "merge",
    });
    this.loadItems();
  }

  protected getItemId(item: ModuleObject): string {
    return item.id;
  }

  protected getItemLabel(item: ModuleObject): string {
    return item.id;
  }

  protected getDeleteTitle(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.title");
  }

  protected getDeleteMessage(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.message", {
      name: item.id,
    });
  }

  onSearch(): void {
    this.page = 1;
    this.updateQueryParams();
  }

  onReset(): void {
    this.keyword = '';
    this.startDate = '';
    this.endDate = '';
    this.status = '';
    this.page = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: this.limit },
    });
    this.loadItems();
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

  protected override filterItems(items: ModuleObject[]): ModuleObject[] {
    if (!items || items.length === 0) return [];
    return items.filter((application) => application?.jobOffer?.status !== 'INACTIVE');
  }
}
