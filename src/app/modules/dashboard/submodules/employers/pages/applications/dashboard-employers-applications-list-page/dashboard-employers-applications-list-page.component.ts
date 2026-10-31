import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationsService as Service } from "@modules/applications/applications.service";
import { Application as ModuleObject } from "@modules/applications/applications.types";
import { TranslocoService } from "@ngneat/transloco";
import { MatDialog } from "@angular/material/dialog";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { AuthService } from "@modules/auth/auth.service";
import { JobOffersService } from "@modules/job-offers/job-offers.service";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-applications-list-page",
  templateUrl: "./dashboard-employers-applications-list-page.component.html",
  styleUrls: [
    "./dashboard-employers-applications-list-page.component.scss",
    "../../../../../../../../styles/legacy-styles.css",
  ],
})
export class DashboardEmployersApplicationsListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "applications";

  keyword: string = "";
  status: string = "";
  dateFrom: string = "";
  dateTo: string = "";
  jobOfferId: string = "";
  jobOfferOptions: { id: string; title: string }[] = [];

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

  get applicationsCount(): number {
    return this.items?.length || 0;
  }

  get activeJobOffersCount(): number {
    const ids = new Set<string>();
    (this.items || []).forEach((application) => {
      const jobOffer = application?.jobOffer;
      if (jobOffer?.id && jobOffer?.status !== "INACTIVE") {
        ids.add(jobOffer.id);
      }
    });
    return ids.size;
  }

  get recruiterId() {
    const user = this.authService.getUser();
    return user && this.authService.isRecruiter() ? user.id : null;
  }

  constructor(
    service: Service,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog,
    private authService: AuthService,
    private jobOffersService: JobOffersService,
  ) {
    super(service, route, router, transloco, dialog);
  }

  protected onParamsInit(params: any): void {
    this.keyword = params['keyword'] ?? '';
    this.status = params['status'] ?? '';
    this.dateFrom = params['dateFrom'] ?? '';
    this.dateTo = params['dateTo'] ?? '';
    this.jobOfferId = params['jobOfferId'] ?? '';
    this.loadJobOfferOptions();
  }

  private loadJobOfferOptions(): void {
    this.jobOffersService.selectMine({ limit: 200 }).subscribe({
      next: (res) => {
        this.jobOfferOptions = (res.data || []).map((jo: any) => ({
          id: jo.id,
          title: jo.title,
        }));
      },
      error: () => {
        this.jobOfferOptions = [];
      },
    });
  }

  protected getListParams(): any {
    const params: any = {
      page: this.page,
      limit: this.limit,
      recruiterId: this.recruiterId,
    };
    if (this.keyword) params.keyword = this.keyword;
    if (this.status) params.status = this.status;
    if (this.dateFrom) params.submittedAfter = this.dateFrom;
    if (this.dateTo) params.submittedBefore = this.dateTo;
    if (this.jobOfferId) params.jobOfferId = this.jobOfferId;
    return params;
  }

  protected override updateQueryParams(): void {
    const queryParams: any = { page: this.page, limit: this.limit };
    if (this.keyword) queryParams.keyword = this.keyword;
    if (this.status) queryParams.status = this.status;
    if (this.dateFrom) queryParams.dateFrom = this.dateFrom;
    if (this.dateTo) queryParams.dateTo = this.dateTo;
    if (this.jobOfferId) queryParams.jobOfferId = this.jobOfferId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
    this.loadItems();
  }

  onSort(event: { key: keyof ModuleObject; direction: "asc" | "desc" }): void {
    const { key, direction } = event;
    const factor = direction === "asc" ? 1 : -1;

    this.items = [...this.items].sort((a, b) => {
      const aVal = (a as any)[key];
      const bVal = (b as any)[key];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return -1 * factor;
      if (bVal == null) return 1 * factor;
      if (aVal < bVal) return -1 * factor;
      if (aVal > bVal) return 1 * factor;
      return 0;
    });
  }

  protected getItemId(item: ModuleObject): string {
    return item.id;
  }

  protected getItemLabel(item: ModuleObject): string {
    return item.id;
  }

  protected getDeleteTitle(_item: ModuleObject): string {
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
    this.status = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.jobOfferId = '';
    this.page = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: this.limit },
    });
    this.loadItems();
  }

  onFiltersChanged(newFilters: any): void {
    this.page = 1;
    this.filters = { ...(newFilters || {}) };
    this.updateQueryParams();
    this.loadItems();
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updateQueryParams();
  }

  handleCreate() {}

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: ModuleObject) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }

  protected override filterItems(items: ModuleObject[]): ModuleObject[] {
    if (!items || items.length === 0) return [];
    return items.filter(
      (application) => application?.jobOffer?.status !== "INACTIVE",
    );
  }
}
