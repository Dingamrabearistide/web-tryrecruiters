import { Component } from "@angular/core";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { Observable } from "rxjs";

import { BillingsService } from "../../billings.service";
import { BillingListParams, BillingPlan } from "../../billings.types";
import { BillingPaginatedListPage } from "../billing-paginated-list-page.base";

@Component({
  selector: "app-billing-plans-list-page",
  standalone: false,
  templateUrl: "./billing-plans-list-page.component.html",
  styleUrls: ["./billing-plans-list-page.component.scss"],
})
export class BillingPlansListPageComponent extends BillingPaginatedListPage<BillingPlan> {
  protected readonly loadErrorKey = "billings.plansList.loadError";

  typeFilter = "";

  constructor(
    route: ActivatedRoute,
    router: Router,
    transloco: TranslocoService,
    private readonly billingsService: BillingsService,
  ) {
    super(route, router, transloco);
  }

  protected override onParamsInit(params: Params): void {
    this.typeFilter = String(params["type"] || "");
  }

  protected getListParams(): BillingListParams {
    return {
      page: this.page,
      limit: this.limit,
      search: this.search || undefined,
      type: this.typeFilter || undefined,
    };
  }

  protected selectMany(params: BillingListParams): Observable<any> {
    return this.billingsService.selectPlans(params);
  }

  protected override getCustomQueryParams() {
    return { type: this.typeFilter || null };
  }

  protected override resetCustomFilters(): void {
    this.typeFilter = "";
  }
}
