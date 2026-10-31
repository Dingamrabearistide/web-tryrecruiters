import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { usersColumns } from "@modules/users/users.config";
import { User } from "../../users.type";
import { GenericDatatableColumnDef } from "../../../../@1hand/components/generic-datatable/generic-datatable.component";
import { AuthService } from "@modules/auth/auth.service";
import { Role } from "@modules/auth/auth.types";

@Component({
  standalone: false,

  selector: "app-users-datatable",
  templateUrl: "./users-datatable.component.html",
  styleUrls: [
    "./users-datatable.component.scss",
    "../../../../../styles/legacy-styles.css",
  ],
})
export class UsersDatatableComponent implements OnInit {
  datatableColumns: GenericDatatableColumnDef<User>[] = [];

  @Input() items: User[] = [];
  @Input() errorMessage = "";
  @Input() isLoading = false;
  @Input() hasError = false;

  @Output("view") handleView$: EventEmitter<User> = new EventEmitter();
  @Output("update") handleUpdate$: EventEmitter<User> = new EventEmitter();
  @Output("delete") handleDelete$: EventEmitter<User> = new EventEmitter();
  @Output("create") handleCreate$: EventEmitter<User> = new EventEmitter();
  @Output("assignUnlimited") handleAssignUnlimited$: EventEmitter<User> =
    new EventEmitter();
  @Output("deactivatePlans") handleDeactivatePlans$: EventEmitter<User> =
    new EventEmitter();

  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const userRole = this.authService.getRole();
    this.isAdmin =
      userRole === Role.PLATFORM_ADMIN || userRole === Role.SUPER_ADMIN;
    console.log(
      "JobOffersDatatable - User Role:",
      userRole,
      "Is Admin:",
      this.isAdmin,
    );

    this.datatableColumns = usersColumns.map((c) => {
      if (c.label === "Actions") {
        return {
          ...c,
          canDelete: this.isAdmin,
          canEdit: false,
        };
      }
      return c;
    });
  }

  handleView(item: User) {
    this.handleView$.emit(item);
  }

  handleUpdate(item: User) {
    this.handleUpdate$.emit(item);
  }

  handleDelete(item: User) {
    this.handleDelete$.emit(item);
  }

  handleCreate() {
    this.handleCreate$.emit();
  }

  handleAssignUnlimited(item: User) {
    this.handleAssignUnlimited$.emit(item);
  }

  handleDeactivatePlans(item: User) {
    this.handleDeactivatePlans$.emit(item);
  }
}
