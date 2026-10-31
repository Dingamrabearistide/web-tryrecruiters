import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Interview as ModuleObject } from "@modules/interview/interview.types";
import { GenericDatatableColumnDef } from "../../../../@1hand/components/generic-datatable/generic-datatable.component";
import { interviewColumns as DatatableColumns } from "@modules/interview/interview.config";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-interviews-datatable",
  templateUrl: "./interviews-datatable.component.html",
  styleUrls: ["./interviews-datatable.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class InterviewsDatatableComponent {
  datatableColumns: GenericDatatableColumnDef<ModuleObject>[] = [];

  @Input() items: ModuleObject[] = [];
  @Input() hideCandidate = false;
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

  selectedItem = this.items[0];
  onItemSelected(item: ModuleObject) {
    console.log(item);
  }

  displayItemValue = (item: ModuleObject) =>
    `${item.candidate?.firstName} ${item.candidate?.lastName} - ${new Date(
      item.scheduledAt
    ).toLocaleDateString()}`;

  constructor(private transloco: TranslocoService) {}

  private shouldTranslate(value: string): boolean {
    if (!value) return false;
    if (value.includes("://")) return false;
    if (value.indexOf(".") < 0) return false;
    return /^[A-Za-z0-9_.-]+$/.test(value);
  }

  ngOnInit(): void {
    const columns = this.hideCandidate
      ? DatatableColumns.filter((c) => c.key !== 'candidate')
      : DatatableColumns;

    // translate labels from the static config so the generic datatable receives human strings
    this.datatableColumns = columns.map((c) => {
      const translatedLabel =
        typeof c.label === "string" && c.label.includes(".")
          ? this.transloco.translate(
              c.label.startsWith("interviews.")
                ? c.label
                : `interviews.${c.label}`
            )
          : c.label;
      const originalRenderValue = c.renderValue;
      const wrappedRenderValue = originalRenderValue
        ? (row: ModuleObject) => {
            const value = originalRenderValue(row as any);
            // If the render returned a translation key (e.g. status.SCHEDULED), translate it
            if (typeof value === "string" && this.shouldTranslate(value)) {
              try {
                const translated = this.transloco.translate(
                  value.startsWith("interviews.") ? value : `interviews.${value}`
                );
                return translated || value;
              } catch (e) {
                return value;
              }
            }
            return value;
          }
        : undefined;

      return {
        ...c,
        label: translatedLabel,
        renderValue: wrappedRenderValue || c.renderValue,
      };
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
