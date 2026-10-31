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
import { takeUntil, debounceTime } from "rxjs/operators";
import {
  AdminPlatformUsersService,
  AdminUser,
} from "../../services/admin-platform-users.service";
import { LoaderComponent } from "@modules/core/components/loader.component";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-dashboard-admin-users-list-page",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
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
    LoaderComponent,
  ],
  templateUrl: "./dashboard-admin-users-list-page.component.html",
  styleUrls: ["./dashboard-admin-users-list-page.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminUsersListPageComponent implements OnInit, OnDestroy {
  isLoading = false;
  totalItems = 0;
  displayedColumns: string[] = [
    "email",
    "firstName",
    "lastName",
    "role",
    "archived",
    "emailConfirmed",
    "createdAt",
    "actions",
  ];
  users: AdminUser[] = [];

  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  filterForm: FormGroup;
  private destroy$ = new Subject<void>();
  private filter$ = new Subject<any>();

  roles = ["CANDIDATE", "RECRUITER", "ADMIN"];
  genders = ["MALE", "FEMALE", "OTHER"];

  constructor(
    private usersService: AdminPlatformUsersService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.filterForm = this.fb.group({
      search: [""],
      role: [""],
      gender: [""],
      emailConfirmed: [""],
      city: [""],
      region: [""],
      deleted: [""],
      archived: [""],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.setupFilterListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge la liste des utilisateurs
   */
  private loadUsers(): void {
    this.isLoading = true;
    const filters = {
      ...this.filterForm.value,
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };

    this.usersService
      .getUsers(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.users = response.data;
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
  navigateToDetail(user: AdminUser): void {
    const employerId = this.route.snapshot.paramMap.get('employerId');
    this.router.navigate(['/dashboard/admin', employerId, 'users', user.id]);
  }

  private setupFilterListener(): void {
    this.filterForm.valueChanges
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadUsers();
      });
  }

  /**
   * Gère le changement de page
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  /**
   * Supprime un utilisateur
   */
  deleteUser(user: AdminUser): void {
    const dialogRef = this.dialog.open(MatConfirmDialogComponent, {
      data: {
        title: "Supprimer l'utilisateur",
        message: `Êtes-vous sûr de vouloir supprimer ${user.email} ? Cette action est irréversible.`,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.usersService
          .deleteUser(user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.loadUsers();
            },
          });
      }
    });
  }

  /**
   * Bloque un utilisateur (archived: true)
   */
  blockUser(user: AdminUser): void {
    this.usersService
      .blockUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
        },
      });
  }

  /**
   * Débloque un utilisateur (archived: false)
   */
  unblockUser(user: AdminUser): void {
    this.usersService
      .unblockUser(user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadUsers();
        },
      });
  }

  /**
   * Réinitialise les filtres
   */
  resetFilters(): void {
    this.filterForm.reset();
    this.pageIndex = 0;
    this.loadUsers();
  }

  /**
   * Rafraîchit les données
   */
  refresh(): void {
    this.loadUsers();
  }

  /**
   * Détermine la couleur du badge de rôle
   */
  getRoleColor(role: string): string {
    switch (role) {
      case "ADMIN":
        return "warn";
      case "EMPLOYER":
        return "accent";
      default:
        return "primary";
    }
  }
}
