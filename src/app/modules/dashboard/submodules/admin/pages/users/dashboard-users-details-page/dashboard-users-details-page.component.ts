import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "@modules/users/users.service";
import { User } from "@modules/users/users.type";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-users-details-page",
  template: `
    <div *transloco="let t; read: 'users'">
      <button class="m-2 bg-primary app-primary" (click)="handleBack()">
        <i class="fas fa-chevron-left mr-1 text-white"></i>
        {{ t("common.previous") }}
      </button>


      <div *ngIf="isLoading" class="grid place-items-center h-[400px]">
        <app-loader></app-loader>
      </div>

      <div *ngIf="hasError" class="p-4">
        <div
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {{ errorMessage }}
        </div>
      </div>

      <app-users-detail
        *ngIf="!isLoading && !hasError && item"
        [item]="item"
        [displayActions]="true"
        (onEdit)="handleEdit()"
        (onDelete)="handleDelete()"
      ></app-users-detail>
    </div>
  `,
})
export class DashboardUsersDetailsPageComponent implements OnInit {
  item: User = {} as User;
  isLoading = true;
  hasError = false;
  errorMessage = "";
  currentUserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private usersService: UsersService,
    private transloco: TranslocoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  handleEdit(): void {
    if (this.currentUserId) {
      this.router.navigate(["/admin/users", this.currentUserId, "edit"]);
    }
  }

  handleDelete(): void {
    if (
      !this.currentUserId ||
      !confirm(this.transloco.translate("users.delete.confirm"))
    ) {
      return;
    }

    this.isLoading = true;
    this.usersService.delete(this.currentUserId).subscribe({
      next: () => {
        this.router.navigate(["/admin/users"]);
      },
      error: (err) => {
        this.handleError(this.transloco.translate("users.delete.error"), err);
      },
      complete: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  handleBack(): void {
    this.location.back();
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const userId = params.get("id");
      console.log("User ID from route:", userId);
      this.currentUserId = userId;

      if (!userId) {
        this.hasError = true;
        this.errorMessage = this.transloco.translate("users.errors.noIdFound");
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      this.clearErrorState();

      this.usersService.selectById(userId).subscribe({
        next: (response) => {
          if (response) {
            this.item = response;
            console.log("User data loaded:", this.item);
          } else {
            this.handleError(this.transloco.translate("users.errors.notFound"));
          }
        },
        error: (err) => {
          this.handleError(
            this.transloco.translate("users.errors.loadError"),
            err
          );
        },
        complete: () => {
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
    });
  }

  private handleError(message: string, error?: any): void {
    this.hasError = true;
    this.errorMessage = message;
    if (error) console.error(message, error);
    this.cdr.detectChanges();
  }

  private clearErrorState(): void {
    this.hasError = false;
    this.errorMessage = "";
  }
}
