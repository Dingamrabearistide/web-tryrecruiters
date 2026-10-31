import { Location } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { InterviewsService } from "@modules/interview/interviews.service";
import { Interview } from "@modules/interview/interview.types";
import { TranslocoService } from "@ngneat/transloco";
import { wait } from "../../../../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-interviews-details-page",
  template: `
    <div *transloco="let t; read: 'interviews'">
      <button class="m-2 bg-primary app-primary" (click)="handleBack()">
        <i class="fas fa-chevron-left mr-1 text-white"></i>
        {{ t("common.previous") }}
      </button>

      <div
        *ngIf="item && !isLoading && !hasError"
        class="bg-white rounded-lg shadow-md p-6"
      >
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            {{ t("details.title") }}
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t("details.fields.date")
              }}</label>
              <p class="text-gray-900">
                {{ item.scheduledAt | date : "medium" }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t("details.fields.status")
              }}</label>
              <p class="text-gray-900">{{ t("status." + item.status) }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t("details.fields.meetUrl")
              }}</label>
              <p class="text-gray-900">{{ item.meetUrl || "N/A" }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{
                t("details.fields.duration")
              }}</label>
              <p class="text-gray-900">
                {{ item.durationMin ? item.durationMin + " min" : "N/A" }}
              </p>
            </div>
          </div>

          <div class="mt-6" *ngIf="item.notes">
            <label class="block text-sm font-medium text-gray-700 mb-1">{{
              t("details.fields.notes")
            }}</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ item.notes }}</p>
          </div>
        </div>
      </div>

      <div
        *ngIf="hasError"
        class="flex justify-center items-center min-h-screen"
      >
        <div class="text-center">
          <p class="text-red-500 mb-4">{{ errorMessage }}</p>
          <button
            class="bg-primary text-white px-4 py-2 rounded"
            (click)="retryLoad()"
          >
            {{ t("common.retry") }}
          </button>
        </div>
      </div>

      <div *ngIf="isLoading" class="flex justify-center items-center min-h-screen">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        ></div>
      </div>
    </div>
  `,
})
export class DashboardAdminInterviewsDetailsPageComponent implements OnInit {
  item!: Interview;

  isLoading = true;
  hasError = false;
  errorMessage = "";
  currentInterviewId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private service: InterviewsService,
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadItem();
  }

  handleBack(): void {
    this.location.back();
  }

  retryLoad(): void {
    this.loadItem();
  }

  private loadItem(): void {
    this.route.paramMap.subscribe((params) => {
      const paramItemIdName = "interviewId";
      const itemId = params.get(paramItemIdName);
      console.log("Interview ID from route:", itemId);
      this.currentInterviewId = itemId;

      if (!itemId) {
        this.hasError = true;
        this.errorMessage = this.translocoService.translate("interviews.details.errors.noIdFound");
        this.isLoading = false;
        return;
      }

      this.isLoading = true;
      this.clearErrorState();

      this.service.selectById(itemId).subscribe({
        next: (response: any) => {
          wait();
          if (response) {
            this.item = response;
            console.log("Interview data loaded:", this.item);
          } else {
            this.handleError(this.translocoService.translate("interviews.details.errors.notFound"));
          }
        },
        error: (err: any) => {
          this.handleError(
            this.translocoService.translate("interviews.details.errors.loadError"),
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
