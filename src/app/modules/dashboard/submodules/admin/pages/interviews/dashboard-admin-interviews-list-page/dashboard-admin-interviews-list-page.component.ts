import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { InterviewsService as Service } from "@modules/interview/interviews.service";
import {
  Interview as ModuleObject,
  InterviewStatus,
} from "@modules/interview/interview.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-interviews-list-page",
  templateUrl: "./dashboard-admin-interviews-list-page.component.html",
  styleUrls: ["./dashboard-admin-interviews-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminInterviewsListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "interviews";
  startDate: string = "";
  endDate: string = "";
  status: string = "";
  location: string = "";
  keyword: string = "";

  InterviewStatus = InterviewStatus;
  statuses = Object.values(InterviewStatus);

  constructor(
    service: Service,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog
  ) {
    super(service, route, router, transloco, dialog);
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  protected onParamsInit(params: any): void {
    this.startDate = params["startDate"] || "";
    this.endDate = params["endDate"] || "";
    this.status = params["status"] || "";
    this.location = params["location"] || "";
    this.keyword = params["keyword"] || "";
  }

  protected getListParams(): any {
    return {
      page: this.page,
      limit: this.limit,
      startDate: this.startDate || undefined,
      endDate: this.endDate || undefined,
      status: this.status || undefined,
      location: this.location || undefined,
      keyword: this.keyword || undefined,
    };
  }

  protected getItemId(item: ModuleObject): string {
    return item.id!;
  }

  protected getItemLabel(item: ModuleObject): string {
    return `Interview - ${item.candidate?.firstName} ${item.candidate?.lastName}`;
  }

  protected getDeleteTitle(item: ModuleObject): string {
    return this.transloco.translate("interviews.delete.title");
  }

  protected getDeleteMessage(item: ModuleObject): string {
    return this.transloco.translate("interviews.delete.message", {
      name: `${item.candidate?.firstName} ${item.candidate?.lastName}`,
    });
  }

  onSearch(): void {
    this.page = 1;
    this.updateQueryParams();
  }

  onReset(): void {
    this.startDate = "";
    this.endDate = "";
    this.status = "";
    this.location = "";
    this.keyword = "";
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
    this.router.navigate(["../create"], { relativeTo: this.route });
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: ModuleObject) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }

  protected override updateQueryParams(): void {
    const queryParams: any = {
      page: this.page,
      limit: this.limit,
    };

    if (this.startDate) queryParams.startDate = this.startDate;
    if (this.endDate) queryParams.endDate = this.endDate;
    if (this.status) queryParams.status = this.status;
    if (this.location) queryParams.location = this.location;
    if (this.keyword) queryParams.keyword = this.keyword;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: "merge",
    });
  }
}

