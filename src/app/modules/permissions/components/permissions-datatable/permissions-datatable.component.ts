import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { Permission } from "../../permissions.type";
import { GenericDatatableColumnDef } from "../../../../@1hand/components/generic-datatable/generic-datatable.component";
import { permissionsColumns } from "../../permissions.config";

@Component({
  standalone: false,

  selector: "app-permissions-datatable",
  templateUrl: "./permissions-datatable.component.html",
  styleUrls: ["./permissions-datatable.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class PermissionsDatatableComponent implements OnInit {
  datatableColumns: GenericDatatableColumnDef<Permission>[] = [];

  @Input() items: Permission[] = [];
  @Input() errorMessage = "";
  @Input() isLoading = false;
  @Input() hasError = false;

  @Output("view") handleView$: EventEmitter<Permission> = new EventEmitter();
  @Output("update") handleUpdate$: EventEmitter<Permission> =
    new EventEmitter();
  @Output("delete") handleDelete$: EventEmitter<Permission> =
    new EventEmitter();
  @Output("create") handleCreate$: EventEmitter<Permission> =
    new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.datatableColumns = permissionsColumns;
  }

  handleView(item: Permission) {
    this.handleView$.emit(item);
  }

  handleUpdate(item: Permission) {
    this.handleUpdate$.emit(item);
  }

  handleDelete(item: Permission) {
    this.handleDelete$.emit(item);
  }

  handleCreate() {
    this.handleCreate$.emit();
  }
}
