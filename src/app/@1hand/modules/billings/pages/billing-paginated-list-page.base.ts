import { Directive, OnInit } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { Observable } from "rxjs";
import { finalize, take } from "rxjs/operators";

import { BillingListParams } from "../billings.types";
import { BaseResponseInterface } from "../../../base.type";

@Directive()
export abstract class BillingPaginatedListPage<T> implements OnInit {
  items: T[] = [];

  page = 1;
  limit = 10;
  totalItems = 0;
  totalPages = 0;

  search = "";

  isLoading = false;
  hasError = false;
  errorMessage = "";

  protected abstract readonly loadErrorKey: string;

  constructor(
    protected readonly route: ActivatedRoute,
    protected readonly router: Router,
    protected readonly transloco: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.page = Number(params["page"]) || 1;
      this.limit = Number(params["limit"]) || 10;
      this.search = String(params["search"] || "");
      this.onParamsInit(params);
      this.loadItems();
    });
  }

  protected onParamsInit(_params: Params): void {}

  protected abstract getListParams(): BillingListParams;

  protected abstract selectMany(
    params: BillingListParams,
  ): Observable<BaseResponseInterface<T>>;

  loadItems(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.selectMany(this.getListParams())
      .pipe(
        take(1),
        finalize(() => { this.isLoading = false; }),
      )
      .subscribe({
        next: (response) => {
          this.items = response.data || [];
          this.totalItems = response.total || 0;
          const responseLimit = response.limit || this.limit;
          this.totalPages = Math.max(1, Math.ceil(this.totalItems / responseLimit));
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage =
            error?.error?.message ||
            this.transloco.translate(this.loadErrorKey);
        },
      });
  }

  applyFilters(): void {
    this.page = 1;
    this.updateQueryParams();
  }

  resetFilters(): void {
    this.search = "";
    this.resetCustomFilters();
    this.page = 1;
    this.updateQueryParams();
  }

  protected resetCustomFilters(): void {}

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.updateQueryParams();
  }

  protected getCustomQueryParams(): Record<string, unknown> {
    return {};
  }

  protected updateQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: this.page,
        limit: this.limit,
        search: this.search || null,
        ...this.getCustomQueryParams(),
      },
      queryParamsHandling: "merge",
    });
  }
}
