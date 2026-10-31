import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { GenericModalComponent, GenericModalData } from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";
import { wait } from "../../../../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-dashboard-employer-job-details-page",
  template: `
    <!-- Republish modal template — must be outside *transloco to keep its bindings when rendered in the dialog -->
    <ng-template #republishTpl>
      <p class="text-sm text-gray-600 mb-4">{{ republishModalMessage }}</p>
      <label class="block text-xs font-medium text-gray-600 mb-1">{{ "joboffers.republish.expiresAtLabel" | transloco }}</label>
      <input type="date" [min]="republishMinDate" [(ngModel)]="republishExpiresAt"
        class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
      <p class="text-xs text-gray-400 mt-1">{{ "joboffers.republish.expiresAtHint" | transloco }}</p>
      <div class="flex justify-end gap-2 pt-4">
        <button
          (click)="cancelRepublish()"
          [disabled]="republishIsLoading"
          class="px-4 py-2 font-medium rounded-md shadow-sm transition bg-gray-200 hover:bg-gray-300 text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ "general.cancel" | transloco }}
        </button>
        <button
          (click)="confirmRepublish()"
          [disabled]="republishIsLoading"
          class="px-4 py-2 font-medium rounded-md shadow-sm transition app-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span *ngIf="!republishIsLoading">{{ "joboffers.republish.confirm" | transloco }}</span>
          <span *ngIf="republishIsLoading" class="flex items-center justify-center w-5 h-5 mx-auto">
            <span class="animate-spin rounded-full h-5 w-5 border-2 border-transparent border-t-white block"></span>
          </span>
        </button>
      </div>
    </ng-template>

    <div *transloco="let t; read: 'joboffers'">

      <button class="m-2 bg-primary app-primary" (click)="handleBack()">
        <i class="fas fa-chevron-left mr-1 text-white"></i>
        {{ t("list.back") }}
      </button>

      <div *ngIf="isLoading" class="grid grid-rows-[1fr] h-[400px]">
        <div class="w-full text-center h-full">
          <app-loader></app-loader>
        </div>
      </div>

      <div *ngIf="!isLoading && hasError" class="w-full">
        <app-generic-error [message]="errorMessage"></app-generic-error>
      </div>

      <div *ngIf="!isLoading && !hasError && item">
        <job-offers-detail
          [canApply]="false"
          [canRepublish]="true"
          [item]="item"
          (onRepublish)="handleRepublish($event)"
          (onEdit)="handleEdit()"
          (onDelete)="handleDelete()"
          (onBack)="handleBack()"
          (onViewCompany)="handleViewCompany()"
        ></job-offers-detail>
      </div>
    </div>
  `,
})
export class DashboardEmployersJobOffersDetailsPageComponent implements OnInit {
  item!: JobOffer;
  company: any | null = null;

  isLoading = true;
  hasError = false;
  errorMessage = "";
  currentCompanyId: string | null = null;

  republishModalMessage = '';
  republishExpiresAt = '';
  republishMinDate = '';
  republishIsLoading = false;
  private republishDialogRef?: MatDialogRef<GenericModalComponent>;
  private republishItem?: JobOffer;

  @ViewChild('republishTpl', { static: true }) republishTpl!: TemplateRef<any>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: JobOffersService,
    private companiesService: CompaniesService,
    private cdr: ChangeDetectorRef,
    private transloco: TranslocoService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }
  handleRepublish(item: JobOffer): void {
    this.republishMinDate = new Date().toISOString().split('T')[0];
    this.republishExpiresAt = '';
    this.republishIsLoading = false;
    this.republishItem = item;
    this.republishModalMessage = this.transloco.translate("joboffers.republish.message", { title: item.title });

    this.republishDialogRef = this.dialog.open(GenericModalComponent, {
      width: "420px",
      data: {
        title: this.transloco.translate("joboffers.republish.title"),
        template: this.republishTpl,
      } as GenericModalData,
    });
  }

  cancelRepublish(): void {
    this.republishDialogRef?.close();
  }

  confirmRepublish(): void {
    if (!this.republishItem) return;
    this.republishIsLoading = true;

    const expiresAt = this.republishExpiresAt || undefined;
    this.service.republish(this.republishItem.id, expiresAt).subscribe({
      next: () => {
        this.republishDialogRef?.close();
        this.republishIsLoading = false;
        this.loadItem();
      },
      error: (err: any) => {
        this.republishIsLoading = false;
        this.republishDialogRef?.close();
        this.dialog.open(GenericModalComponent, {
          width: "400px",
          data: {
            title: this.transloco.translate("joboffers.republish.errorTitle"),
            content: err?.error?.message || this.transloco.translate("auth.genericError"),
            actions: [{ id: "ok", label: this.transloco.translate("general.ok"), color: "primary" }],
          } as GenericModalData,
        });
      },
    });
  }

  handleBack(): void {
    this.router.navigate(["../list"], { relativeTo: this.route });
  }

  // private loadJob(): void {
  //   this.route.paramMap.subscribe((params) => {
  //     const jobId = params.get("jobOffersId");
  //     console.log("job ID from route:", jobId);
  //     this.currentCompanyId = jobId;

  //     if (!jobId) {
  //       this.hasError = true;
  //       this.errorMessage = this.transloco.translate(
  //         "job-offers.pages.jobOffers.noJobIdFound"
  //       );
  //       this.isLoading = false;
  //       return;
  //     }

  //     this.isLoading = true;
  //     this.clearErrorState();
  //   });
  // }

  loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const paramItemIdName = "jobOffersId";
      const itemId = params.get(paramItemIdName);

      if (!itemId) {
        throw new Error(`No query param id ${paramItemIdName}`);
      }

      this.isLoading = true;
      this.hasError = false;
      this.errorMessage = "";

      this.service.selectById(itemId).subscribe({
        next: (response) => {
          wait();

          this.item = response;

          this.isLoading = false;
          this.hasError = false;
          this.errorMessage = "";
        },
        error: (error) => {
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            error?.error.message ??
            this.transloco.translate("general.genericError");
        },
      });
    });
  }

  handleViewCompany(): void {
    if (this.item?.companyId) {
      this.router.navigate([`/employers/companies/${this.item.companyId}`]);
    }
  }

  handleEdit(): void {
    if (this.currentCompanyId) {
      this.router.navigate([
        "/employers/job-offers",
        this.currentCompanyId,
        "edit",
      ]);
    }
  }

  handleDelete(): void {
    // if (
    //   !this.currentCompanyId ||
    //   !confirm(
    //     this.transloco.translate("job-offers.pages.jobOffers.confirmDeleteJob")
    //   )
    // ) {
    //   return;
    // }
    // this.isLoading = true;
    // this.jobOffersService
    //   .deleteItem(this.job?.id as string)
    //   .pipe(
    //     takeUntil(this.unsubscribe$),
    //     catchError((err) => {
    //       this.handleError(
    //         this.transloco.translate(
    //           "job-offers.pages.jobOffers.errorDeletingJob"
    //         ),
    //         err
    //       );
    //       return [];
    //     }),
    //     finalize(() => {
    //       this.isLoading = false;
    //       this.cdr.detectChanges();
    //     })
    //   )
    //   .subscribe(() => {
    //     this.router.navigate(["/employers/job-offers"]);
    //   });
  }

  // private handleError(message: string, error?: any): void {
  //   this.hasError = true;
  //   this.errorMessage = message;
  //   if (error) console.error(message, error);
  //   this.cdr.detectChanges();
  // }

  private clearErrorState(): void {
    this.hasError = false;
    this.errorMessage = "";
  }
}
