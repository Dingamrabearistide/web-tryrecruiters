import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "app-dashboard-header",
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  template: `
    <div class="mb-6">
      <a
        *ngIf="backLink"
        [routerLink]="backLink"
        class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-3 cursor-pointer"
      >
        <i class="fa fa-arrow-left mr-2"></i>
        <span *transloco="let t">{{ t(backText) }}</span>
      </a>
      <h1 class="text-2xl font-bold text-gray-800">{{ title }}</h1>
      <p *ngIf="description" class="text-gray-500 mt-1 text-sm">{{ description }}</p>
    </div>
  `,
})
export class DashboardHeaderComponent {
  @Input() title = "";
  @Input() description = "";
  @Input() backText = "common.back";
  @Input() backLink: string | null = null;
}
