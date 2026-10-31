import { Component, EventEmitter, Input, Output, OnInit } from "@angular/core";
import { Application } from "../../applications.types";
import { GenericDatatableColumnDef } from "../../../../@1hand/components/generic-datatable/generic-datatable.component";
import { applicationColumns } from "../../applications.config";

@Component({
  standalone: false,

  selector: "app-applications-datatable",
  templateUrl: "./applications-datatable.component.html",
  styleUrls: ["./applications-datatable.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ApplicationsDatatableComponent implements OnInit {
  datatableColumns: GenericDatatableColumnDef<Application>[] = [];

  @Input() items: Application[] = [];
  @Input() errorMessage = "";
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() hideCandidate = false;

  @Output("view") handleView$: EventEmitter<Application> = new EventEmitter();
  @Output("update") handleUpdate$: EventEmitter<Application> =
    new EventEmitter();
  @Output("delete") handleDelete$: EventEmitter<Application> =
    new EventEmitter();
  @Output("create") handleCreate$: EventEmitter<Application> =
    new EventEmitter();
  @Output("sort") handleSort$: EventEmitter<{
    key: keyof Application;
    direction: "asc" | "desc";
  }> = new EventEmitter();

  selectedItem = this.items[0];

  onItemSelected(item: Application) {
    console.log(item);
  }

  displayItemValue = (item: Application) =>
    `${item.candidate?.firstName} ${item.candidate?.lastName} - ${item.jobOffer?.title}`;

  constructor() {}

  ngOnInit(): void {
    this.datatableColumns = this.hideCandidate
      ? applicationColumns.filter((c) => c.key !== 'candidate')
      : applicationColumns;
  }

  handleView(item: Application) {
    this.handleView$.emit(item);
  }

  handleUpdate(item: Application) {
    this.handleUpdate$.emit(item);
  }

  handleDelete(item: Application) {
    this.handleDelete$.emit(item);
  }

  handleCreate() {
    this.handleCreate$.emit();
  }

  handleSort(event: { key: keyof Application; direction: "asc" | "desc" }) {
    this.handleSort$.emit(event);
  }
}
