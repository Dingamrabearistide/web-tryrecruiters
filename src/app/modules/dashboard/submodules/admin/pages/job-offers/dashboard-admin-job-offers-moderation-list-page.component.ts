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
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatConfirmDialogComponent } from "@components/generic-modal/confirm-dialog.component";
import { TranslocoModule } from "@ngneat/transloco";
import { Subject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import {
  AdminPlatformJobOffersService,
  AdminJobOffer,
} from "../../services/admin-platform-job-offers.service";

@Component({
  selector: "app-dashboard-admin-job-offers-list-page",
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    TranslocoModule,
    DatePipe,
  ],
  templateUrl:
    "./dashboard-admin-job-offers-moderation-list-page.component.html",
  styleUrls: ["./dashboard-admin-job-offers-moderation-list-page.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminJobOffersListPageComponent
  implements OnInit, OnDestroy
{
  isLoading = false;
  totalItems = 0;
  displayedColumns: string[] = [
    "title",
    "companyName",
    "status",
    "contractType",
    "isPublished",
    "applicationsCount",
    "createdAt",
    "actions",
  ];
  jobOffers: AdminJobOffer[] = [];

  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  filterForm: FormGroup;
  private destroy$ = new Subject<void>();

  statuses = ["PENDING", "VALIDATED", "REJECTED", "DELETED"];
  contractTypes = ["CDI", "CDD", "STAGE", "FREELANCE"];

  constructor(
    private jobOffersService: AdminPlatformJobOffersService,
    private fb: FormBuilder,
    private dialog: MatDialog,
  ) {
    this.filterForm = this.fb.group({
      status: [""],
      contractType: [""],
      isPublished: [""],
      startDate: [""],
      endDate: [""],
    });
  }

  ngOnInit(): void {
    this.loadJobOffers();
    this.setupFilterListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge la liste des offres d'emploi
   */
  private loadJobOffers(): void {
    this.isLoading = true;
    const filters = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    this.jobOffersService
      .getPendingJobOffers(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.jobOffers = response.data;
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
        this.loadJobOffers();
      });
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadJobOffers();
  }

  /**
   * Valide une offre d'emploi
   */
  validateJobOffer(jobOffer: AdminJobOffer): void {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: "Valider l'offre d'emploi",
        message: `Êtes-vous sûr de vouloir valider "${jobOffer.title}" ?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jobOffersService
          .validateJobOffer(jobOffer.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadJobOffers();
            },
          });
      }
    });
  }

  /**
   * Rejette une offre d'emploi
   */
  rejectJobOffer(jobOffer: AdminJobOffer): void {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: "Rejeter l'offre d'emploi",
        message: `Êtes-vous sûr de vouloir rejeter "${jobOffer.title}" ?`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jobOffersService
          .rejectJobOffer(jobOffer.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadJobOffers();
            },
          });
      }
    });
  }

  /**
   * Supprime une offre d'emploi
   */
  deleteJobOffer(jobOffer: AdminJobOffer): void {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: "Supprimer l'offre d'emploi",
        message: `Êtes-vous sûr de vouloir supprimer "${jobOffer.title}" ? Cette action est irréversible.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.jobOffersService
          .deleteJobOffer(jobOffer.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadJobOffers();
            },
          });
      }
    });
  }

  /**
   * Publie une offre d'emploi
   */
  publishJobOffer(jobOffer: AdminJobOffer): void {
    this.jobOffersService
      .publishJobOffer(jobOffer.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadJobOffers();
        },
      });
  }

  /**
   * Dépublie une offre d'emploi
   */
  unpublishJobOffer(jobOffer: AdminJobOffer): void {
    this.jobOffersService
      .unpublishJobOffer(jobOffer.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadJobOffers();
        },
      });
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadJobOffers();
  }

  /**
   * Rafraîchit les données
   */
  refresh(): void {
    this.loadJobOffers();
  }

  /**
   * Détermine la couleur du badge de statut
   */
  getStatusColor(status: string): string {
    switch (status) {
      case "VALIDATED":
        return "primary";
      case "REJECTED":
        return "warn";
      case "DELETED":
        return "accent";
      default:
        return "";
    }
  }
}
