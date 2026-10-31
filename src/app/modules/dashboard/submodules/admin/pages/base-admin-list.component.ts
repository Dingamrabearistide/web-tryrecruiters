import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  Directive,
} from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatSortModule } from "@angular/material/sort";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { TranslocoModule } from "@ngneat/transloco";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";

/**
 * Composant abstrait pour les listes d'administration
 * Fournit les fonctionnalités communes: pagination, filtres, actions
 */
@Directive()
export abstract class BaseAdminListComponent implements OnInit, OnDestroy {
  isLoading = false;
  totalItems = 0;
  displayedColumns: string[] = [];
  dataSource: any[] = [];

  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50, 100];

  filterForm: FormGroup | null = null;

  protected destroy$ = new Subject<void>();
  protected filter$ = new Subject<any>();

  constructor(
    protected fb: FormBuilder,
    protected dialog: MatDialog,
  ) {
    this.initializeFilterForm();
  }

  ngOnInit(): void {
    this.loadData();
    this.setupFilterListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialise le formulaire de filtres
   * À redéfinir par les sous-classes
   */
  protected abstract initializeFilterForm(): void;

  /**
   * Charge les données
   * À implémenter par les sous-classes
   */
  protected abstract loadData(): void;

  /**
   * Configure l'écoute des changements de filtres
   */
  private setupFilterListener(): void {
    if (!this.filterForm) return;

    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadData();
      });
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    if (this.filterForm) {
      this.filterForm.reset();
      this.pageIndex = 0;
      this.loadData();
    }
  }

  /**
   * Rafraîchit les données
   */
  refresh(): void {
    this.loadData();
  }
}
