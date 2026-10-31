import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationsService as Service } from "@modules/applications/applications.service";
import { TranslocoService } from "@ngneat/transloco";
import { Location } from "@angular/common";
import {
  Application,
  ApplicationStatusEnum,
} from "@modules/applications/applications.types";
import { wait } from "../../../../../../../@1hand/utils";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {
  GenericModalComponent,
  GenericModalData,
  GenericModalType,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";

@Component({
  standalone: false,

  selector: "aapp-dashboard-admin-applications-detail-page",
  templateUrl: "./dashboard-admin-applications-details-page.component.html",
})
export class DashboardAdminApplicationsDetailsPageComponent implements OnInit {
  item!: Application;
  isLoading = false;
  hasError = false;
  errorMessage = "";
  private isLoadingDelete!: boolean;
  private moduleName = "applications";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: Service,
    private transloco: TranslocoService,
    private location: Location,
    private dialog: MatDialog,
  ) {}

  openDeleteModal(item: Application): MatDialogRef<GenericModalComponent> {
    const modalData: GenericModalData = {
      title: this.getDeleteTitle(item),
      content: this.getDeleteMessage(item),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
        },
        {
          id: "confirm",
          label: this.transloco.translate("general.delete"),
          color: "warn",
        },
      ],
    };

    return this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
      disableClose: true,
    });
  }

  ngOnInit(): void {
    this.loadItem();
  }

  handleBack(): void {
    this.location.back();
  }

  handleEdit(item: Application) {
    if (item?.id) {
      this.router.navigate(["../edit", item.id], {
        relativeTo: this.route,
      });
    }
  }

  handleDelete(item: Application): void {
    const dialogRef = this.openDeleteModal(item);
    const sub = dialogRef.componentInstance.action.subscribe(async (result) => {
      if (result !== "confirm") {
        dialogRef.close();
        sub.unsubscribe();
        // if (result === "ok") this.loadItems();
        return;
      }

      // this.isLoadingDelete = true;
      // this.hasError = true;
      // this.errorMessage = "";

      const confirmAction = dialogRef.componentInstance.data?.actions?.find(
        (a) => a.id === "confirm",
      );
      if (confirmAction) confirmAction.isLoading = true;
      await wait();
      this.service.delete(this.getItemId(item)).subscribe({
        next: async () => {
          await wait();

          // this.isLoadingDelete = false;
          // this.hasError = false;
          // this.errorMessage = "";

          this.showResultModal(
            dialogRef,
            `${this.moduleName}.delete.success.title`,
            `${this.moduleName}.delete.success.message`,
            this.getItemLabel(item),
            "info",
            () => {
              this.router.navigate(["../list"], {
                relativeTo: this.route,
              });
              this.loadItem();
            },
          );
        },
        error: async (error: any) => {
          await wait();

          // this.hasError = true;
          // this.isLoadingDelete = false;
          this.errorMessage =
            error?.error?.message ||
            this.transloco.translate("general.genericError");

          this.showResultModal(
            dialogRef,
            `${this.moduleName}.delete.error.title`,
            // `${this.moduleName}.delete.error.message`,
            (this.errorMessage =
              error?.error?.message ||
              this.transloco.translate("general.genericError")),
            this.getItemLabel(item),
            "danger",
          );
        },
        complete: () => {
          this.isLoadingDelete = false;
          sub.unsubscribe();
        },
      });
    });
  }

  handleUpdateStatus($event: {
    ModuleObject: Application;
    status: ApplicationStatusEnum;
  }) {
    if (this.isLoading) return;

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.service
      .update(this.item.id, {
        ...$event.ModuleObject,
        status: $event.status,
        updatedAt: new Date(),
      })
      .subscribe({
        next: async (updatedItem: Application) => {
          await wait();

          const dialogRef = this.dialog.open(GenericModalComponent, {
            disableClose: true,
            data: { type: "info", title: "", content: "", actions: [] },
          });

          this.showResultModal(
            dialogRef,
            `${this.moduleName}.update.success.title`,
            `${this.moduleName}.update.success.message`,
            this.getItemLabel(updatedItem),
            "info",
            () => window.location.reload(),
          );
        },
        error: async (error: any) => {
          await wait();

          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            error?.error?.message ||
            this.transloco.translate("general.genericError");

          const dialogRef = this.dialog.open(GenericModalComponent, {
            disableClose: true,
            data: { type: "info", title: "", content: "", actions: [] },
          });

          this.showResultModal(
            dialogRef,
            `${this.moduleName}.update.error.title`,
            `${this.moduleName}.update.error.message`,
            this.moduleName,
            "danger",
          );
        },
      });
  }

  protected showResultModal(
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
        dialogRef.close();
        sub.unsubscribe();
        if (cb) cb();
      }
    });
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const paramItemIdName = "applicationId";
      const itemId = params.get(paramItemIdName);

      if (!itemId) {
        throw new Error(`No query param id ${paramItemIdName}`);
      }

      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = "";

      this.service.selectById(itemId).subscribe({
        next: async (response) => {
          await wait();

          this.item = response;

          this.isLoading = false;
          this.hasError = false;
          this.errorMessage = "";
        },
        error: (error) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            error?.error.message ??
            this.transloco.translate("general.genericError");
        },
      });
    });
  }

  private getDeleteTitle(item: Application) {
    return `${this.transloco.translate("applications.delete.title", {
      id: item.id,
    })}`;
  }

  private getDeleteMessage(item: Application) {
    return this.transloco.translate("applications.delete.message", {
      id: item.id,
    });
  }

  private getItemId(item: Application) {
    return item.id;
  }

  private getItemLabel(item: Application) {
    return `${this.transloco.translate("applications.details.label", {
      name: item.id,
    })}`;
  }
}
