import {
  Component,
  EventEmitter,
  Injector,
  Input,
  Output,
} from "@angular/core";
import { GenericDatatableColumnDef } from "../generic-datatable.component";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";
import { GenericDatatableActionsCellComponent } from "../generic-datatable-actions-cell/generic-datatable-actions-cell.component";
import { StatusBadgeComponent } from "../../status-badge/status-badge.component";

@Component({
  selector: "app-generic-datatable-cell",
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    GenericDatatableActionsCellComponent,
    StatusBadgeComponent,
  ],
  templateUrl: "./generic-datatable-cell.component.html",
  styleUrl: "./generic-datatable-cell.component.scss",
})
export class GenericDatatableCellComponent<T = any> {
  @Input() item!: T;
  @Input() column!: GenericDatatableColumnDef<T>;
  @Input() injector!: Injector;
  @Input() currentStatus?: string;
  @Input() processingJobIds?: Set<string>;
  @Input() enableRecruiterPlanActions?: boolean = false;

  @Output() view = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() approve = new EventEmitter<T>();
  @Output() reject = new EventEmitter<T>();
  @Output() revoke = new EventEmitter<T>();
  @Output() republish = new EventEmitter<T>();
  @Output() submit = new EventEmitter<T>();
  @Output() assignUnlimited = new EventEmitter<T>();
  @Output() deactivatePlans = new EventEmitter<T>();

  createInjector(): Injector {
    const inputsObj = this.column.inputs
      ? this.column.inputs(this.item) || {}
      : {};

    const providers = Object.entries(inputsObj).map(([key, value]) => ({
      provide: key,
      useValue: value,
    }));

    return Injector.create({
      providers,
      parent: this.injector,
    });
  }

  hasAction(): boolean {
    return !!(
      this.column.canEdit ||
      this.column.canView ||
      this.column.canDelete
    );
  }

  handleView(): void {
    this.view.emit(this.item);
  }

  handleEdit(): void {
    this.edit.emit(this.item);
  }

  handleDelete(): void {
    this.delete.emit(this.item);
  }

  isUrl(value: any): boolean {
    if (typeof value !== "string") return false;
    return value.startsWith("http://") || value.startsWith("https://");
  }
}
