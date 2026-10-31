import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ErrorService, AppError } from "../../../core/services/error.service";

@Component({
  selector: "app-error-overlay",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="error"
      class="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4"
    >
      <div
        class="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-in fade-in"
      >
        <!-- Icon -->
        <div class="flex justify-center mb-4">
          <div
            class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center"
          >
            <i
              class="fa-solid fa-triangle-exclamation text-red-600 text-2xl"
            ></i>
          </div>
        </div>

        <!-- Title -->
        <h2 class="text-xl font-bold text-gray-800 text-center mb-2">
          {{ error?.title }}
        </h2>

        <!-- Message -->
        <p class="text-gray-600 text-center text-sm mb-6">
          {{ error?.message }}
        </p>

        <!-- Error Code Section -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <p class="text-xs text-gray-500 font-medium mb-2">CODE D'ERREUR</p>
          <div class="flex items-center gap-2">
            <code class="flex-1 text-sm font-mono text-gray-800 break-all">
              {{ error?.id }}
            </code>
            <button
              (click)="copyErrorCode()"
              class="p-2 hover:bg-gray-200 rounded transition"
              [title]="copied ? 'Copié!' : 'Copier le code'"
            >
              <i
                [class]="
                  copied
                    ? 'fa-solid fa-check text-green-600'
                    : 'fa-solid fa-copy text-gray-600'
                "
              ></i>
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            {{ error?.timestamp | date: "dd/MM/yyyy HH:mm:ss" }}
          </p>
        </div>

        <!-- Support Info -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p class="text-sm text-blue-800 font-medium mb-2">
            <i class="fa-solid fa-info-circle mr-2"></i>
            Contacter le support
          </p>
          <p class="text-xs text-blue-700">
            Veuillez communiquer ce code d'erreur à notre équipe support pour
            une assistance rapide.
          </p>
        </div>

        <!-- Timestamp (debug) -->
        <div
          *ngIf="isDebugMode"
          class="bg-gray-100 rounded p-2 mb-4 text-xs text-gray-600"
        >
          <p><strong>Context:</strong> {{ error?.context | json }}</p>
        </div>

        <!-- Actions -->
        <div class="flex gap-3">
          <button
            (click)="closeError()"
            class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition font-medium text-sm"
          >
            Fermer
          </button>
          <a
            href="mailto:support@tryrecruiters.com?subject=Code%20erreur%20{{
              error?.id
            }}"
            class="flex-1 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded transition font-medium text-sm text-center"
          >
            <i class="fa-solid fa-envelope mr-2"></i>
            Contacter
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .animate-in.fade-in {
        animation: fadeIn 0.3s ease-out;
      }
    `,
  ],
})
export class ErrorOverlayComponent implements OnInit, OnDestroy {
  error: AppError | null = null;
  copied = false;
  isDebugMode = false;
  private destroy$ = new Subject<void>();

  constructor(private errorService: ErrorService) {}

  ngOnInit(): void {
    this.errorService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe((error) => {
        this.error = error;
      });

    // Détecter le mode debug
    this.isDebugMode = localStorage.getItem("DEBUG_MODE") === "true";
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  copyErrorCode(): void {
    if (this.error?.id) {
      navigator.clipboard.writeText(this.error?.id);
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    }
  }

  closeError(): void {
    this.errorService.clearError();
  }
}
