import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Resume as ModuleObject } from "@modules/resumes/resumes.types";
import { GenericDatatableColumnDef } from "../../../../@1hand/components/generic-datatable/generic-datatable.component";
import { resumeColumns as DatatableColumns } from "@modules/resumes/resumes.config";

@Component({
  standalone: false,

  selector: "app-resumes-datatable",
  templateUrl: "./resumes-datatable.component.html",
  styleUrls: ["./resumes-datatable.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ResumesDatatableComponent {
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
  @Output("download") handleDownload$: EventEmitter<ModuleObject> =
    new EventEmitter();
  @Output("setDefault") handleSetDefault$: EventEmitter<ModuleObject> =
    new EventEmitter();

  selectedItem = this.items[0];
  onItemSelected(item: ModuleObject) {
    console.log(item);
  }

  displayItemValue = (item: ModuleObject) =>
    `${item.name} - ${item.isDefault ? "Par défaut" : "Standard"}`;

  constructor() {}

  ngOnInit(): void {
    this.datatableColumns = DatatableColumns;
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

  handleDownload(item: ModuleObject) {
    this.handleDownload$.emit(item);
  }

  handleSetDefault(item: ModuleObject) {
    this.handleSetDefault$.emit(item);
  }
}
