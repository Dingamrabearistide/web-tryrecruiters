import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { JobOffersService as Service } from "@modules/job-offers/job-offers.service";
import {
  JobOffer as ModuleObject,
  JobStatus,
} from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { wait } from "../../../../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
  GenericModalType,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";

@Component({
  standalone: false,
  selector: "app-dashboard-admin-job-offers-list-page",
  templateUrl: "./dashboard-admin-job-offers-list-page.component.html",
  styleUrls: [
    "./dashboard-admin-job-offers-list-page.component.scss",
    "../../../../../../../../styles/legacy-styles.css",
  ],
})
export class DashboardAdminJobOffersListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "joboffers";

  startDate: string = "";
  endDate: string = "";
  contractType: string = "";
  jobType: string = "";
  keyword: string = "";

  activeTab: "pending" | "active" | "inactive" = "pending";
  currentStatus: JobStatus = JobStatus.PENDING;
  total: number = 0;

  processingJobIds: Set<string> = new Set();

  constructor(
    private jobOffersService: Service,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog,
  ) {
    super(jobOffersService, route, router, transloco, dialog);
  }

  protected onParamsInit(params: any): void {
    this.keyword = params['keyword'] ?? '';
    this.startDate = params['startDate'] ?? '';
    this.endDate = params['endDate'] ?? '';
    this.contractType = params['contractType'] ?? '';
    this.jobType = params['jobType'] ?? '';
  }

  protected override loadItems(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    const params = {
      page: 1,
      limit: 1000,
      allStatuses: true,
      keyword: this.keyword,
      startDate: this.startDate,
      endDate: this.endDate,
      contractType: this.contractType,
      jobType: this.jobType,
    };

    this.service.selectMany(params).subscribe({
      next: async (res: any) => {
        await wait();
        this.items = res.data;
        this.totalItems = res.total;
        this.total = res.total;
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

  /** All items are fetched at once (up to 1000, across every status) so the
   * tab counts below are always accurate, then filtered and paginated
   * client-side per status here — pagination must be scoped to the current
   * tab's subset, not the combined total across all three tabs. */
  getFilteredItems(status: JobStatus): ModuleObject[] {
    const filtered = this.items.filter((item) => item.status === status);
    const start = (this.page - 1) * this.limit;
    return filtered.slice(start, start + this.limit);
  }

  getCurrentTabTotalPages(): number {
    const count = this.items.filter(
      (item) => item.status === this.currentStatus,
    ).length;
    return Math.max(1, Math.ceil(count / this.limit));
  }

  getPendingCount(): number {
    return this.items.filter((item) => item.status === JobStatus.PENDING)
      .length;
  }

  getActiveCount(): number {
    return this.items.filter((item) => item.status === JobStatus.ACTIVE).length;
  }

  getInactiveCount(): number {
    return this.items.filter((item) => item.status === JobStatus.INACTIVE)
      .length;
  }

  protected getListParams(): any {
    return {
      page: this.page,
      limit: this.limit,
      status: this.currentStatus,
      keyword: this.keyword,
      startDate: this.startDate,
      endDate: this.endDate,
      contractType: this.contractType,
    };
  }

  protected getItemId(item: ModuleObject): string {
    return item.id;
  }

  protected getItemLabel(item: ModuleObject): string {
    return item.title;
  }

  protected getDeleteTitle(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.title");
  }

  protected getDeleteMessage(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.message", {
      name: item.title,
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadItems();
  }

  onReset(): void {
    this.keyword = '';
    this.startDate = '';
    this.endDate = '';
    this.contractType = '';
    this.jobType = '';
    this.page = 1;
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

  setActiveTab(tab: "pending" | "active" | "inactive"): void {
    this.activeTab = tab;

    switch (tab) {
      case "pending":
        this.currentStatus = JobStatus.PENDING;
        break;
      case "active":
        this.currentStatus = JobStatus.ACTIVE;
        break;
      case "inactive":
        this.currentStatus = JobStatus.INACTIVE;
        break;
    }

    this.page = 1;
    this.loadItems();
  }

  async handleApprove(item: ModuleObject): Promise<void> {
    if (this.processingJobIds.has(item.id)) return;

    const dialogRef = this.openActionModal(
      "joboffers.approve.title",
      "joboffers.approve.message",
      item.title,
    );

    const sub = dialogRef.componentInstance.action.subscribe(async (result) => {
      if (result !== "confirm") {
        dialogRef.close();
        sub.unsubscribe();
        return;
      }

      const confirmAction = dialogRef.componentInstance.data?.actions?.find(
        (a) => a.id === "confirm",
      );
      if (confirmAction) confirmAction.isLoading = true;

      this.processingJobIds.add(item.id);
      await wait();

      this.jobOffersService.approve(item.id).subscribe({
        next: async () => {
          await wait();
          this.processingJobIds.delete(item.id);
          sub.unsubscribe();
          this.showResultModal(
            dialogRef,
            "joboffers.approve.title",
            "joboffers.approve.success",
            item.title,
            "info",
            () => this.loadItems(),
          );
        },
        error: async (_error) => {
          await wait();
          this.processingJobIds.delete(item.id);
          sub.unsubscribe();
          this.showResultModal(
            dialogRef,
            "joboffers.approve.title",
            "joboffers.approve.error",
            item.title,
            "danger",
          );
        },
      });
    });
  }

  async handleReject(item: ModuleObject): Promise<void> {
    if (this.processingJobIds.has(item.id)) return;

    const dialogRef = this.openActionModal(
      "joboffers.reject.title",
      "joboffers.reject.message",
      item.title,
    );

    const sub = dialogRef.componentInstance.action.subscribe(async (result) => {
      if (result !== "confirm") {
        dialogRef.close();
        sub.unsubscribe();
        return;
      }

      const confirmAction = dialogRef.componentInstance.data?.actions?.find(
        (a) => a.id === "confirm",
      );
      if (confirmAction) confirmAction.isLoading = true;

      this.processingJobIds.add(item.id);
      await wait();

      this.jobOffersService.reject(item.id).subscribe({
        next: async () => {
          await wait();
          this.processingJobIds.delete(item.id);
          sub.unsubscribe();
          this.showResultModal(
            dialogRef,
            "joboffers.reject.title",
            "joboffers.reject.success",
            item.title,
            "info",
            () => this.loadItems(),
          );
        },
        error: async (_error) => {
          await wait();
          this.processingJobIds.delete(item.id);
          sub.unsubscribe();
          this.showResultModal(
            dialogRef,
            "joboffers.reject.title",
            "joboffers.reject.error",
            item.title,
            "danger",
          );
        },
      });
    });
  }

  async handleRevoke(item: ModuleObject): Promise<void> {
    if (this.processingJobIds.has(item.id)) return;

    const dialogRef = this.openActionModal(
      "joboffers.revoke.title",
      "joboffers.revoke.message",
      item.title,
    );

    const sub = dialogRef.componentInstance.action.subscribe(async (result) => {
      if (result !== "confirm") {
        dialogRef.close();
        sub.unsubscribe();
        return;
      }

      const confirmAction = dialogRef.componentInstance.data?.actions?.find(
        (a) => a.id === "confirm",
      );
      if (confirmAction) confirmAction.isLoading = true;

      this.processingJobIds.add(item.id);
      await wait();

      this.jobOffersService.revoke(item.id).subscribe({
        next: async () => {
          await wait();
          this.processingJobIds.delete(item.id);
          sub.unsubscribe();
          this.showResultModal(
            dialogRef,
            "joboffers.revoke.title",
            "joboffers.revoke.success",
            item.title,
            "info",
            () => this.loadItems(),
          );
        },
        error: async (_error) => {
          await wait();
          this.processingJobIds.delete(item.id);
          sub.unsubscribe();
          this.showResultModal(
            dialogRef,
            "joboffers.revoke.title",
            "joboffers.revoke.error",
            item.title,
            "danger",
          );
        },
      });
    });
  }

  private openActionModal(
    titleKey: string,
    messageKey: string,
    itemName: string,
  ): MatDialogRef<GenericModalComponent> {
    const confirmColor = titleKey.includes("approve") ? "primary" : "warn";
    const modalData: GenericModalData = {
      title: this.transloco.translate(titleKey),
      content: this.transloco.translate(messageKey, { name: itemName }),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
        },
        {
          id: "confirm",
          label: this.transloco.translate("general.confirm"),
          color: confirmColor,
        },
      ],
    };

    return this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
      disableClose: true,
    });
  }

  override showResultModal(
    dialogRef: MatDialogRef<GenericModalComponent>,
    titleKey: string,
    messageKey: string,
    name: string,
    type: GenericModalType = "info",
    cb?: Function,
  ) {
    const instance = dialogRef.componentInstance;

    if (!instance) return;

    instance.data.title = this.transloco.translate(titleKey);
    instance.data.content = this.transloco.translate(messageKey, { name });
    instance.data.type = type;
    instance.data.actions = [
      {
        id: "ok",
        label: this.transloco.translate("general.ok"),
        color: "primary",
      },
    ];

    const sub = instance.action.subscribe((res) => {
      if (res === "ok") {
        sub.unsubscribe();
        if (cb) cb();
        dialogRef.close();
      }
    });
  }

  isProcessing(item: ModuleObject): boolean {
    return this.processingJobIds.has(item.id);
  }
}
