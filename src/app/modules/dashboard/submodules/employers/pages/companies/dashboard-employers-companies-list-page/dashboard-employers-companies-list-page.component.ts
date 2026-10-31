import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CompaniesService as Service } from "@modules/compagnies/companies.service";
import { Company as ModuleObject } from "@modules/compagnies/companies.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { AuthService } from "@modules/auth/auth.service";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-companies-list-page",
  templateUrl: "./dashboard-employers-companies-list-page.component.html",
})
export class DashboardEmployersCompaniesListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "companies";

  keyword: string = "";
  city: string = "";
  country: string = "";
  postedDate: string = "";

  filters: {
    category?: string;
    postedDate?: string;
    experienceLevel?: string;
    location?: string;
    searchQuery?: string;
  } = {};

  get recruiterId() {
    const user = this.authService.getUser();
    return user && this.authService.isRecruiter() ? user.id : null;
  }

  get companiesCount(): number {
    return this.items?.length || 0;
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

  /** City names are letters/spaces/hyphens/apostrophes only — blocks digits
   * and other special characters at the keystroke level instead of letting
   * garbage like "345325" (reported by testers) be typed into the filter. */
  blockNonCityChars(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey || event.key.length > 1) return;
    if (!/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'-]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onSearch(): void {
    this.page = 1;
    this.updateQueryParams();
  }

  onReset(): void {
    this.keyword = '';
    this.city = '';
    this.country = '';
    this.postedDate = '';
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

  handleCreate() {
    const employerId = this.recruiterId;
    if (employerId) {
      this.router.navigate(["../create"], { relativeTo: this.route });
    }
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: ModuleObject) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }

  protected onParamsInit(params: any): void {
    this.keyword = params['name'] ?? '';
    this.city = params['city'] ?? '';
    this.country = params['country'] ?? '';
    this.postedDate = params['postedDate'] ?? '';
  }

  protected getListParams(): any {
    return {
      page: this.page,
      limit: this.limit,
      createdById: this.recruiterId,
      ...(this.keyword && { name: this.keyword }),
      ...(this.city && { city: this.city }),
      ...(this.country && { country: this.country }),
      ...(this.postedDate && { postedDate: this.postedDate }),
    };
  }

  protected override updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        ...(this.keyword && { name: this.keyword }),
        ...(this.city && { city: this.city }),
        ...(this.country && { country: this.country }),
        ...(this.postedDate && { postedDate: this.postedDate }),
      },
      queryParamsHandling: 'merge',
    });
    this.loadItems();
  }

  protected getItemId(item: ModuleObject): string {
    return item.id;
  }

  protected getItemLabel(item: ModuleObject): string {
    return item.name;
  }

  protected getDeleteTitle(_item: ModuleObject): string {
    return this.transloco.translate("companies.delete.title");
  }

  protected getDeleteMessage(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.message", {
      name: item.name,
    });
  }

  protected override filterItems(items: ModuleObject[]): ModuleObject[] {
    return items || [];
  }
}
