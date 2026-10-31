import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CategorieService } from "@modules/categories/categories.service";
import {
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@modules/categories/categories.types";
import { TranslocoService } from "@ngneat/transloco";
import { Location } from "@angular/common";

@Component({
  standalone: false,

  selector: 'app-dashboard-employers-category-update-page',
  templateUrl: './dashboard-employers-category-update-page.component.html',
})
export class DashboardEmployersCategoryUpdatePageComponent implements OnInit {
  item: Category | null = null;
  isLoading = false;
  hasError = false;
  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoriesService: CategorieService,
    private transloco: TranslocoService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  loadItem(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.route.paramMap.subscribe((params) => {
      const categoryId = params.get("id");
      if (categoryId) {
        this.categoriesService.selectById(categoryId).subscribe({
          next: (response) => {
            this.item = response as Category;
            this.isLoading = false;
          },
          error: (error) => {
            this.hasError = true;
            this.errorMessage =
              error?.error?.message ||
              this.transloco.translate("auth.genericError");
            this.isLoading = false;
          },
        });
      } else {
        this.isLoading = false;
      }
    });
  }

  handleSubmit(category: CreateCategoryDto | UpdateCategoryDto): void {
    this.isLoading = true;
    if (this.item?.id) {
      // Update existing category
      this.categoriesService
        .updateItem(category as UpdateCategoryDto)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(["../.."], { relativeTo: this.route });
          },
          error: (error) => {
            this.hasError = true;
            this.errorMessage =
              error?.error?.message ||
              this.transloco.translate("auth.genericError");
            this.isLoading = false;
          },
        });
    } else {
      // Create new category
      this.categoriesService
        .createItem(category as CreateCategoryDto)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate([".."], { relativeTo: this.route });
          },
          error: (error) => {
            this.hasError = true;
            this.errorMessage =
              error?.error?.message ||
              this.transloco.translate("auth.genericError");
            this.isLoading = false;
          },
        });
    }
  }

  handleBack(): void {
    this.location.back();
  }
}
