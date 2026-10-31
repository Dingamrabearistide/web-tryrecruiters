import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService as Service } from "@modules/users/users.service";
import { User as ModuleObject } from "@modules/users/users.type";
import { TranslocoService } from "@ngneat/transloco";
import { BaseListDeletePageComponent } from "../../../../../../../@1hand/pages/base-list-delete-page/base-list-delete-page.component";
import { BillingsService } from "../../../../../../../@1hand/modules/billings/billings.service";
import { GenericModalComponent, GenericModalData } from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";

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
    dialog: MatDialog,
    private billingsService: BillingsService
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
    //
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: ModuleObject) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }

  onReset() {
    this.keyword = '';
    this.userRole = '';
    this.userGender = '';
    this.userStatus = '';
    this.startDate = '';
    this.endDate = '';
    this.page = 1;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: 1, limit: this.limit },
    });
  }

  protected override updateQueryParams(): void {
    const queryParams: any = {
      page: this.page,
      limit: this.limit,
    };
    if (this.keyword) queryParams['search'] = this.keyword;
    if (this.userRole) queryParams['role'] = this.userRole;
    if (this.userGender) queryParams['gender'] = this.userGender;
    if (this.userStatus) queryParams['status'] = this.userStatus;
    if (this.startDate) queryParams['startDate'] = this.startDate;
    if (this.endDate) queryParams['endDate'] = this.endDate;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  protected getListParams(): any {
    const params: any = {
      page: this.page,
      limit: this.limit,
    };
    if (this.keyword) params['search'] = this.keyword;
    if (this.userRole) params['role'] = this.userRole;
    if (this.userGender) params['gender'] = this.userGender;
    if (this.userStatus) params['status'] = this.userStatus;
    if (this.startDate) params['startDate'] = this.startDate;
    if (this.endDate) params['endDate'] = this.endDate;
    return params;
  }

  protected onParamsInit(params: any): void {
    this.keyword = params['search'] || '';
    this.userRole = params['role'] || '';
    this.userGender = params['gender'] || '';
    this.userStatus = params['status'] || '';
    this.startDate = params['startDate'] || '';
    this.endDate = params['endDate'] || '';
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

  private openActionModal(
    title: string,
    content: string,
    onConfirm: (close: () => void) => void
  ) {
    const modalData: GenericModalData = {
      title,
      content,
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
        },
        {
          id: "confirm",
          label: this.transloco.translate("general.confirm"),
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "420px",
      data: modalData,
      disableClose: true,
    });

    const sub = dialogRef.componentInstance.action.subscribe((res) => {
      if (res !== "confirm") {
        dialogRef.close();
        sub.unsubscribe();
        return;
      }

      const confirmBtn = dialogRef.componentInstance.data.actions?.find(
        (a) => a.id === "confirm"
      );
      if (confirmBtn) confirmBtn.isLoading = true;

      const close = () => {
        if (confirmBtn) confirmBtn.isLoading = false;
        dialogRef.close();
      };

      onConfirm(close);

      sub.unsubscribe();
    });
  }

  assignUnlimited(user: ModuleObject) {
    const accountId = (user as any)?.recruiter?.id ?? user.id;
    if (!accountId || user.role !== "RECRUITER") {
      this.errorMessage = this.transloco.translate("users.errors.notRecruiter");
      return;
    }
    const title = this.transloco.translate("users.actions.assignUnlimited.title", { fallback: "Activer le plan illimité" });
    const content = this.transloco.translate("users.actions.assignUnlimited.confirm", {
      fallback: "Confirmer l'activation du plan illimité pour ce recruteur ?",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    });

    this.openActionModal(title, content, (close) => {
      this.isLoading = true;
      this.billingsService.updateAccountCurrentPlan(accountId, {
        status: "ACTIVE",
        remainingCredits: 999999,
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadItems();
          close();
        },
        error: (err: { error: { message: string } }) => {
          this.isLoading = false;
          this.errorMessage =
            err?.error?.message || this.transloco.translate("general.genericError");
          close();
        },
      });
    });
  }

  deactivatePlans(user: ModuleObject) {
    const accountId = (user as any)?.recruiter?.id ?? user.id;
    if (!accountId || user.role !== "RECRUITER") {
      this.errorMessage = this.transloco.translate("users.errors.notRecruiter");
      return;
    }
    const title = this.transloco.translate("users.actions.deactivatePlans.title", { fallback: "Désactiver les plans" });
    const content = this.transloco.translate("users.actions.deactivatePlans.confirm", {
      fallback: "Voulez-vous désactiver tous les plans de ce recruteur ?",
      name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
    });

    this.openActionModal(title, content, (close) => {
      this.isLoading = true;
      this.billingsService.expireAccountCurrentPlan(accountId).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadItems();
          close();
        },
        error: (err: { error: { message: string } }) => {
          this.isLoading = false;
          this.errorMessage =
            err?.error?.message || this.transloco.translate("general.genericError");
          close();
        },
      });
    });
  }
}
