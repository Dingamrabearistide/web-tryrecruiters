import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Interview as ModuleObject,
  InterviewStatus,
} from "@modules/interview/interview.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { InterviewsService as Service } from "@modules/interview/interviews.service";
import { AuthService } from "@modules/auth/auth.service";

@Component({
  standalone: false,

  selector: "app-dashboard-candidates-interviews-list-page",
  templateUrl: "./dashboard-candidates-interviews-list-page.component.html",
  styleUrls: ["./dashboard-candidates-interviews-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesInterviewsListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "interviews";

  startDate: string = "";
  endDate: string = "";
  status: string = "";
  keyword: string = "";

  // Enum pour le template
  InterviewStatus = InterviewStatus;

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  constructor(
    service: Service,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog,
    private authService: AuthService
  ) {
    super(service, route, router, transloco, dialog);
  }

  protected onParamsInit(params: any): void {
    // init des paramètres custom (keyword, date, status, etc.)
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
      candidateId: this.candidateId,
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

  onReset(): void {
    this.startDate = "";
    this.endDate = "";
    this.status = "";
    this.keyword = "";
    this.page = 1;
    this.updateQueryParams();
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

    queryParams.candidateId = this.candidateId;

    if (this.keyword) queryParams.keyword = this.keyword;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: "merge",
    });
  }
}
