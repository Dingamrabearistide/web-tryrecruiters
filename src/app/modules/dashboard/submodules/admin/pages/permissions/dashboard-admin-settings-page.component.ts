import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule, MatDialog } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { TranslocoModule } from "@ngneat/transloco";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  AdminPlatformSettingsService,
  AdminSetting,
} from "../../services/admin-platform-settings.service";
import { SettingsEditDialogComponent } from "./settings-edit-dialog.component";

@Component({
  selector: "app-dashboard-admin-settings-page",
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
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    TranslocoModule,
    DatePipe,
  ],
  templateUrl: "./dashboard-admin-settings-page.component.html",
  styleUrls: ["./dashboard-admin-settings-page.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminSettingsPageComponent implements OnInit, OnDestroy {
  isLoading = false;
  totalItems = 0;
  displayedColumns: string[] = ["key", "value", "type", "updatedAt", "actions"];
  settings: AdminSetting[] = [];

  pageIndex = 0;
  pageSize = 20;
  pageSizeOptions = [10, 20, 50];

  private destroy$ = new Subject<void>();

  constructor(
    private settingsService: AdminPlatformSettingsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge la liste des paramètres
   */
  private loadSettings(): void {
    this.isLoading = true;
    this.settingsService
      .getAllSettings(this.pageIndex + 1, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.settings = response.data;
          this.totalItems = response.total;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSettings();
  }

  /**
   * Ouvre le dialogue de modification
   */
  editSetting(setting: AdminSetting): void {
    const dialogRef = this.dialog.open(SettingsEditDialogComponent, {
      width: "600px",
      data: { setting: { ...setting } },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateSetting(result.key, result.value);
      }
    });
  }

  /**
   * Met à jour un paramètre
   */
  private updateSetting(key: string, value: any): void {
    this.settingsService
      .updateSetting(key, value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadSettings();
        },
        error: () => {
          // Error handling
        },
      });
  }

  /**
   * Crée un nouveau paramètre
   */
  createSetting(): void {
    const dialogRef = this.dialog.open(SettingsEditDialogComponent, {
      width: "600px",
      data: { setting: null },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.settingsService
          .createSetting(result)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadSettings();
            },
          });
      }
    });
  }

  /**
   * Supprime un paramètre
   */
  deleteSetting(key: string): void {
    this.settingsService
      .deleteSetting(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadSettings();
        },
      });
  }

  /**
   * Rafraîchit les données
   */
  refresh(): void {
    this.loadSettings();
  }

  /**
   * Obtient la couleur du type de paramètre
   */
  getTypeColor(type: string): string {
    switch (type) {
      case "string":
        return "primary";
      case "number":
        return "accent";
      case "boolean":
        return "warn";
      case "json":
        return "info";
      default:
        return "";
    }
  }
}
