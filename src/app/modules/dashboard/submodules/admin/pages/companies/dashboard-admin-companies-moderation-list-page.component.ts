import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatConfirmDialogComponent } from "@components/generic-modal/confirm-dialog.component";
import { TranslocoModule } from "@ngneat/transloco";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  AdminPlatformCompaniesService,
  AdminCompany,
} from "../../services/admin-platform-companies.service";

@Component({
  selector: "app-dashboard-admin-companies-list-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    TranslocoModule,
    DatePipe,
  ],
  templateUrl: "./dashboard-admin-companies-list-page.component.html",
  styleUrls: ["./dashboard-admin-companies-moderation-list-page.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminCompaniesListPageComponent
  implements OnInit, OnDestroy
{
  isLoading = false;
  totalItems = 0;
  displayedColumns: string[] = [
    "name",
    "email",
    "status",
    "archived",
    "deleted",
    "createdAt",
    "actions",
  ];
  companies: AdminCompany[] = [];

  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  statuses = ["PENDING", "ACTIVE", "INACTIVE"];

  constructor(
    private companiesService: AdminPlatformCompaniesService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.filterForm = this.fb.group({
      keyword: [""],
      archived: [""],
      deleted: [""],
    });
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.setupFilterListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge la liste des entreprises
   */
  private loadCompanies(): void {
    this.isLoading = true;
    const filters = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    this.companiesService
      .getPendingCompanies(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.companies = response.data;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  /**
   * Configure l'écoute des changements de filtres
   */
  private setupFilterListener(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadCompanies();
      });
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadCompanies();
  }

  /**
   * Active une entreprise
   */
  activateCompany(company: AdminCompany): void {
    this.companiesService
      .activateCompany(company.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCompanies();
        },
      });
  }

  /**
   * Désactive une entreprise
   */
  deactivateCompany(company: AdminCompany): void {
    this.companiesService
      .deactivateCompany(company.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadCompanies();
        },
      });
  }

  /**
   * Archive une entreprise
   */
  archiveCompany(company: AdminCompany): void {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: "Archiver l'entreprise",
        message: `Êtes-vous sûr de vouloir archiver ${company.name} ?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.companiesService
          .archiveCompany(company.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadCompanies();
            },
          });
      }
    });
  }

  /**
   * Supprime une entreprise
   */
  deleteCompany(company: AdminCompany): void {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: "Supprimer l'entreprise",
        message: `Êtes-vous sûr de vouloir supprimer ${company.name} ? Cette action est irréversible.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.companiesService
          .deleteCompany(company.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadCompanies();
            },
          });
      }
    });
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadCompanies();
  }

  /**
   * Rafraîchit les données
   */
  refresh(): void {
    this.loadCompanies();
  }

  /**
   * Détermine la couleur du badge de statut
   */
  getStatusColor(status: string): string {
    switch (status) {
      case "ACTIVE":
        return "primary";
      case "INACTIVE":
        return "warn";
      default:
        return "accent";
    }
  }
}
