import { Component, EventEmitter, Input, Output } from "@angular/core";
import { User, UserRole, Gender, UserStatut } from "@modules/users/users.type";
import { TranslocoService } from "@ngneat/transloco";
import { MatDialog } from "@angular/material/dialog";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";

@Component({
  standalone: false,

  selector: "app-users-detail",
  templateUrl: "./users-detail.component.html",
})
export class UsersDetailComponent {
  @Input() item!: User;
  @Input() displayActions = true;
  @Input() displayContactInfo = true;

  @Output("onEdit") onEdit$: EventEmitter<User> = new EventEmitter();
  @Output("onDelete") onDelete$: EventEmitter<User> = new EventEmitter();
  @Output("onActivate") onActivate$: EventEmitter<User> = new EventEmitter();
  @Output("onDeactivate") onDeactivate$: EventEmitter<User> =
    new EventEmitter();

  constructor(private transloco: TranslocoService, private dialog: MatDialog) {}

  get fullName() {
    return (
      `${this.item.firstName || ""} ${this.item.lastName || ""}`.trim() ||
      this.item.name
    );
  }

  get userRoleLabel() {
    if (!this.item.role) return "";
    return this.transloco.translate(`users.roles.${this.item.role}`);
  }

  get genderLabel() {
    if (!this.item.gender) return "";
    return this.transloco.translate(`users.gender.${this.item.gender}`);
  }

  get statusLabel() {
    if (!this.item.status) return "";
    return this.transloco.translate(`users.status.${this.item.status}`);
  }

  get isActive() {
    return (
      this.item.status === UserStatut.ACTIVE ||
      (!this.item.deleted && !this.item.archived)
    );
  }

  get profileImage() {
    return this.item.photo || "/images/no-avatar.svg";
  }

  editUser() {
    this.onEdit$.emit(this.item);
  }

  deleteUser() {
    const modalData: GenericModalData = {
      title: this.transloco.translate("users.delete.confirmTitle"),
      content: this.transloco.translate("users.delete.confirmMessage", {
        name: this.fullName,
      }),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
          color: undefined,
        },
        {
          id: "confirm",
          label: this.transloco.translate("general.delete"),
          color: "warn",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      data: modalData,
      width: "400px",
      disableClose: true,
    });

    dialogRef.componentInstance.action.subscribe((action: string) => {
      if (action === "confirm") {
        this.onDelete$.emit(this.item);
        dialogRef.close();
      } else if (action === "cancel") {
        dialogRef.close();
      }
    });
  }

  activateUser() {
    this.onActivate$.emit(this.item);
  }

  deactivateUser() {
    this.onDeactivate$.emit(this.item);
  }

  formatDate(date: string | null): string {
    if (!date) return this.transloco.translate("general.notSpecified");
    return new Date(date).toLocaleDateString();
  }

  formatAddress(): string {
    const parts = [];
    if (this.item.address?.street) parts.push(this.item.address.street);
    if (this.item.address?.city) parts.push(this.item.address.city);
    if (this.item.city) parts.push(this.item.city);
    if (this.item.region) parts.push(this.item.region);

    return parts.length > 0
      ? parts.join(", ")
      : this.transloco.translate("general.notSpecified");
  }
}
