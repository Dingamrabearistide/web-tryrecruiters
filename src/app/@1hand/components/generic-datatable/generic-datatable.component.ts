import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnInit,
  Output,
  TemplateRef,
  Type,
} from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";
import { GenericDatatableCellComponent } from "./generic-datatable-cell/generic-datatable-cell.component";

export interface GenericDatatableColumnDef<T = any> {
  key?: keyof T;
  label: string;
  align?: "left" | "center";
  width?: string;
  render?: Type<any>;
  renderValue?: (item: T) => string;
  linkLabel?: string;
  template?: TemplateRef<any>;
  renderList?: (row: T) => string[];
  inputs?: (row: T) => Record<string, any>;
  type?: "badge";
  badgeConfig?: (row: T) => {
    status: string;
    config?: {
      [key: string]: {
        label: string;
        bgColor: string;
        textColor: string;
        dotColor?: string;
      };
    };
    showDot?: boolean;
    defaultLabel?: string;
  };
  canEdit?: boolean;
  canView?: boolean;
  canDelete?: boolean;
  /** Opt-in column sorting: clicking the header emits `sort` with this
   * column's key. Ignored on columns without `key` set. */
  sortable?: boolean;
}

@Component({
  selector: "app-generic-datatable",
  templateUrl: "./generic-datatable.component.html",
  standalone: true,
  imports: [CommonModule, GenericDatatableCellComponent, TranslocoModule],
})
export class GenericDatatableComponent<T = any> implements OnInit {
  @Input() items: T[] = [];
  @Input() columns: GenericDatatableColumnDef<T>[] = [];

  @Input() isLoading = false;
  @Input() hasError = false;

  @Input() emptyIcon = "fas fa-database";
  @Input() emptyTitle = "Aucune donnée trouvée";
  @Input() emptySubtitle = "";

  @Input() showCreateButton = false;
  @Input() createLabel = "Créer";
  @Input() enableRecruiterPlanActions = false;

  @Input() currentStatus?: string;
  @Input() processingJobIds?: Set<string>;

  @Output() create = new EventEmitter<void>();
  @Output() view = new EventEmitter<T>();
  @Output() update = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() assignUnlimited = new EventEmitter<T>();
  @Output() deactivatePlans = new EventEmitter<T>();

  @Output() approve = new EventEmitter<T>();
  @Output() reject = new EventEmitter<T>();
  @Output() revoke = new EventEmitter<T>();
  @Output() republish = new EventEmitter<T>();
  @Output() submit = new EventEmitter<T>();
  @Output() sort = new EventEmitter<{ key: keyof T; direction: "asc" | "desc" }>();

  sortKey: keyof T | null = null;
  sortDirection: "asc" | "desc" = "asc";

  onHeaderClick(column: GenericDatatableColumnDef<T>): void {
    if (!column.sortable || !column.key) return;

    if (this.sortKey === column.key) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortKey = column.key;
      this.sortDirection = "asc";
    }

    this.sort.emit({ key: column.key, direction: this.sortDirection });
  }

  constructor(private injector: Injector) {}

  ngOnInit(): void {
    console.log("Datatable: ", this.columns);
  }

  createInjector(column: GenericDatatableColumnDef<T>, item: T): Injector {
    const inputsObj = column.inputs ? column.inputs(item) || {} : {};

    const providers = Object.entries(inputsObj).map(([key, value]) => ({
      provide: key,
      useValue: value,
    }));

    return Injector.create({
      providers,
      parent: this.injector,
    });
  }
}

