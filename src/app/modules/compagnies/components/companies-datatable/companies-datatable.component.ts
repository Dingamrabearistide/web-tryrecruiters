import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Company as ModuleObject } from "@modules/compagnies/companies.types";
import { GenericDatatableColumnDef } from "../../../../@1hand/components/generic-datatable/generic-datatable.component";
import { DatatableColumns } from "@modules/compagnies/companies.config";
import { AuthService } from "@modules/auth/auth.service";
import { Role } from "@modules/auth/auth.types";

@Component({
  standalone: false,

  selector: "app-companies-datatable",

  templateUrl: "./companies-datatable.component.html",
  styleUrls: [
    "./companies-datatable.component.scss",
    "../../../../../styles/legacy-styles.css",
  ],
})
export class CompaniesDatatableComponent {
  datatableColumns: GenericDatatableColumnDef<ModuleObject>[] = [];

  @Input() items: ModuleObject[] = [];

  @Input() errorMessage = "";
  @Input() isLoading = false;
  @Input() hasError = false;

  @Output("view") handleView$: EventEmitter<ModuleObject> = new EventEmitter();
  @Output("update") handleUpdate$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("delete") handleDelete$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("create") handleCreate$: EventEmitter<ModuleObject> =
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

    this.datatableColumns = DatatableColumns;
    this.datatableColumns = this.datatableColumns.map((c) => {
      if (c.label === "Actions") {
        return {
          ...c,
          canEdit: !this.isAdmin,
        };
      }
      return c;
    });
  }

  handleView(item: ModuleObject) {
    this.handleView$.emit(item);
  }

  handleUpdate(item: ModuleObject) {
    this.handleUpdate$.emit(item);
  }

  handleDelete(item: ModuleObject) {
    this.handleDelete$.emit(item);
  }

  handleCreate() {
    this.handleCreate$.emit();
  }
}
