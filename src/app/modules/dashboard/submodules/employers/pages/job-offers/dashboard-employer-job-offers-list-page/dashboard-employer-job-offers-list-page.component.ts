import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { JobOffersService as Service } from "@modules/job-offers/job-offers.service";
import { JobOffer as ModuleObject, JobStatus } from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { AuthService } from "@modules/auth/auth.service";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { Company } from "@modules/compagnies/companies.types";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";
import { wait } from "../../../../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-job-offers-list-page",
  templateUrl: "./dashboard-employer-job-offers-list-page.component.html",
  styleUrls: [
    "./dashboard-employer-job-offers-list-page.component.scss",
    "../../../../../../../../styles/legacy-styles.css",
  ],
})
export class DashboardEmployerJobOffersListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "joboffers";

  startDate: string = "";
  endDate: string = "";
  contractType: string = "";
  jobType: string = "";
  companyId: string = "";
  keyword: string = "";

  companies: Company[] = [];

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

  @ViewChild('republishTpl', { static: true }) republishTpl!: TemplateRef<any>;

  republishModalMessage = '';
  republishExpiresAt = '';
  republishMinDate = '';
  republishIsLoading = false;
  private republishDialogRef?: MatDialogRef<GenericModalComponent>;
  private republishItem?: ModuleObject;

  get activeJobOffersCount(): number {
    return (this.items || []).filter((offer) => offer?.status === "ACTIVE").length;
  }

  get applicationsCount(): number {
    return (this.items || []).reduce(
      (total, offer) => total + (offer?.applications?.length || 0),
      0,
    );
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
    private companiesService: CompaniesService,
  ) {
    super(service, route, router, transloco, dialog);
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.loadCompanies();
  }

  private loadCompanies(): void {
    this.companiesService
      .selectMany({ page: 1, createdById: this.recruiterId })
      .subscribe({
        next: (res: any) => {
          this.companies = res.data || [];
        },
      });
  }

  protected onParamsInit(params: any): void {
    this.keyword = params['keyword'] ?? '';
    this.startDate = params['startDate'] ?? '';
    this.endDate = params['endDate'] ?? '';
    this.contractType = params['contractType'] ?? '';
    this.jobType = params['jobType'] ?? '';
    this.companyId = params['companyId'] ?? '';
  }

  protected getListParams(): any {
    const params: any = {
      page: this.page,
      limit: this.limit,
    };
    if (this.recruiterId) params.createdById = this.recruiterId;
    if (this.keyword) params.keyword = this.keyword;
    if (this.startDate) params.startDate = this.startDate;
    if (this.endDate) params.endDate = this.endDate;
    if (this.contractType) params.contractType = this.contractType;
    if (this.jobType) params.jobType = this.jobType;
    if (this.companyId) params.companyId = this.companyId;
    return params;
  }

  /** Drafts only ever appear via GET /job-offers/mine — the plain
   * /job-offers listing (even filtered by createdById) never returns
   * them, so this recruiter-facing list must use the "mine" endpoint
   * instead of the base class's default selectMany(). */
  protected override loadItems(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    (this.service as Service).selectMine(this.getListParams()).subscribe({
      next: async (res: any) => {
        await wait();
        this.items = this.filterItems(res.data) ?? [];
        this.totalItems = res.total;
        this.totalPages = Math.ceil(res.total / this.limit);
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.errorMessage = this.transloco.translate("genericError");
        this.isLoading = false;
      },
    });
  }

  protected override updateQueryParams(): void {
    const queryParams: any = { page: this.page, limit: this.limit };
    if (this.keyword) queryParams.keyword = this.keyword;
    if (this.startDate) queryParams.startDate = this.startDate;
    if (this.endDate) queryParams.endDate = this.endDate;
    if (this.contractType) queryParams.contractType = this.contractType;
    if (this.jobType) queryParams.jobType = this.jobType;
    if (this.companyId) queryParams.companyId = this.companyId;
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
    return item.title;
  }

  protected getDeleteTitle(_item: ModuleObject): string {
    return this.transloco.translate("companies.delete.title");
  }

  protected getDeleteMessage(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.message", {
      name: item.title,
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
    this.contractType = '';
    this.jobType = '';
    this.companyId = '';
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

  private resolveEmployerId(): string | null {
    return (
      this.recruiterId ||
      this.route.snapshot.paramMap.get("employerId") ||
      this.route.parent?.snapshot.paramMap.get("employerId") ||
      null
    );
  }

  handleCreate() {
    const employerId = this.resolveEmployerId();
    if (!employerId) return;
    this.router.navigate(["/dashboard/employers", employerId, "job-offers", "create"]);
  }

  handleView(item: ModuleObject) {
    const employerId = this.resolveEmployerId();
    if (!employerId) return;
    this.router.navigate(["/dashboard/employers", employerId, "job-offers", item.id]);
  }

  handleUpdate(item: ModuleObject) {
    const employerId = this.resolveEmployerId();
    if (!employerId) return;
    this.router.navigate(["/dashboard/employers", employerId, "job-offers", "edit", item.id]);
  }

  handleRepublish(item: ModuleObject): void {
    this.republishMinDate = new Date().toISOString().split('T')[0];
    this.republishExpiresAt = '';
    this.republishIsLoading = false;
    this.republishItem = item;
    this.republishModalMessage = this.transloco.translate("joboffers.republish.message", { title: item.title });

    this.republishDialogRef = this.dialog.open(GenericModalComponent, {
      width: "420px",
      data: {
        title: this.transloco.translate("joboffers.republish.title"),
        template: this.republishTpl,
      } as GenericModalData,
    });
  }

  cancelRepublish(): void {
    this.republishDialogRef?.close();
  }

  confirmRepublish(): void {
    if (!this.republishItem) return;
    this.republishIsLoading = true;

    const expiresAt = this.republishExpiresAt || undefined;
    this.service.republish(this.republishItem.id, expiresAt).subscribe({
      next: () => {
        this.republishDialogRef?.close();
        this.republishIsLoading = false;
        this.loadItems();
      },
      error: (error: any) => {
        this.republishIsLoading = false;
        this.republishDialogRef?.close();
        this.dialog.open(GenericModalComponent, {
          width: "400px",
          data: {
            title: this.transloco.translate("joboffers.republish.errorTitle"),
            content: error?.error?.message || this.transloco.translate("auth.genericError"),
            actions: [{ id: "ok", label: this.transloco.translate("general.ok"), color: "primary" }],
          } as GenericModalData,
        });
      },
    });
  }

  protected override filterItems(items: ModuleObject[]): ModuleObject[] {
    return items || [];
  }

  isDraft(item: ModuleObject): boolean {
    return item.status === JobStatus.DRAFT;
  }

  isSubmittingDraft = false;
  submitDraftError = "";

  /** DRAFT → PENDING. This is when the backend checks the recruiter's
   * plan and consumes a credit (403 BILLING_ACCESS_DENIED if it doesn't
   * cover it) — surface that distinctly from a generic failure. */
  submitDraft(item: ModuleObject): void {
    if (this.isSubmittingDraft) return;
    if (!confirm(this.transloco.translate("joboffers.submitDraftConfirm"))) return;

    this.isSubmittingDraft = true;
    this.submitDraftError = "";

    (this.service as Service).submit(item.id).subscribe({
      next: () => {
        this.isSubmittingDraft = false;
        this.loadItems();
      },
      error: (error: any) => {
        this.isSubmittingDraft = false;
        this.submitDraftError =
          error?.error?.message ||
          this.transloco.translate("joboffers.submitDraftError");
        this.dialog.open(GenericModalComponent, {
          width: "400px",
          data: {
            title: this.transloco.translate("joboffers.submitDraftError"),
            content: this.submitDraftError,
            actions: [{ id: "ok", label: this.transloco.translate("general.ok"), color: "primary" }],
          } as GenericModalData,
        });
      },
    });
  }
}
