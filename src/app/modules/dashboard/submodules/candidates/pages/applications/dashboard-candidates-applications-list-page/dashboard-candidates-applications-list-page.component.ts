import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationsService as Service } from "@modules/applications/applications.service";
import { Application as ModuleObject } from "@modules/applications/applications.types";
import { TranslocoService } from "@ngneat/transloco";
import { MatDialog } from "@angular/material/dialog";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { AuthService } from "@modules/auth/auth.service";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-applications-list-page",
  templateUrl: "./dashboard-candidates-applications-list-page.component.html",
  styleUrls: ["./dashboard-candidates-applications-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesApplicationsListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "applications";

  keyword: string = "";
  status: string = "";

  filters: {
    category?: string;
    postedDate?: string;
    experienceLevel?: string;
    location?: string;
    searchQuery?: string;
    startDate?: string;
    endDate?: string;
    contractType?: string;
    keyword?: string;
  } = {};

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
    private authService: AuthService,
  ) {
    super(service, route, router, transloco, dialog);
  }

  onSearch(): void {
    this.page = 1;
    this.updateQueryParams();
  }

  onReset(): void {
    this.keyword = '';
    this.status = '';
    this.page = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: this.limit },
    });
    this.loadItems();
  }

  onFiltersChanged(newFilters: any): void {
    // reset to first page when filters change
    this.page = 1;
    this.filters = { ...(newFilters || {}) };
    this.updateQueryParams();
    this.loadItems();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updateQueryParams();
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: ModuleObject) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }

  protected onParamsInit(params: any): void {
    this.keyword = params['keyword'] ?? '';
    this.status = params['status'] ?? '';
  }

  protected getListParams(): any {
    const params: any = {
      page: this.page,
      limit: this.limit,
      accountId: this.candidateId,
    };
    if (this.keyword) params.keyword = this.keyword;
    if (this.status) params.status = this.status;
    return params;
  }

  protected override updateQueryParams(): void {
    const queryParams: any = { page: this.page, limit: this.limit };
    if (this.keyword) queryParams.keyword = this.keyword;
    if (this.status) queryParams.status = this.status;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
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

  protected override filterItems(items: ModuleObject[]): ModuleObject[] {
    if (!items || items.length === 0) return [];
    return items.filter(
      (application) => application?.jobOffer?.status === "ACTIVE",
    );
  }
}
