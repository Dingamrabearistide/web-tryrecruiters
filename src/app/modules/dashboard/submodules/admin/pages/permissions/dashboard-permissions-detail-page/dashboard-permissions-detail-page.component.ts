import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { PermissionsService } from "@modules/permissions/permissions.service";
import { Permission } from "@modules/permissions/permissions.type";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-dashboard-permissions-detail-page",
  templateUrl: "./dashboard-permissions-detail-page.component.html",
})
export class DashboardPermissionsDetailPageComponent implements OnInit {
  isLoading = false;
  hasError = false;
  errorMessage = "";
  item: Permission | null = null;
  itemId!: string;

  constructor(
    private service: PermissionsService,
    private transloco: TranslocoService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("id");
      if (!id) {
        this.router.navigate(["../list"], { relativeTo: this.route });
        return;
      }
      this.itemId = id;
      this.loadItem(id);
    });
  }

  loadItem(id: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.service.selectById(id).subscribe({
      next: (item: Permission) => {
        this.item = item;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("permissions.errors.loadingError");
        this.isLoading = false;
      },
    });
  }

  handleEdit(): void {
    this.router.navigate(["../edit", this.itemId], { relativeTo: this.route });
  }

  handleBack(): void {
    this.router.navigate(["../list"], { relativeTo: this.route });
  }
}
