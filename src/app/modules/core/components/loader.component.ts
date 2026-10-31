import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "app-loader",
  standalone: true,
  imports: [TranslocoModule, CommonModule],
  template: `
    <div *transloco="let t" class="flex items-center">
      <div class="mr-2">
        <div
          role="status"
          class="inline-block w-6 h-6 animate-spin rounded-full border-2 border-solid  border-current border-r-transparent align-[-0.125em]"
        ></div>
      </div>
      <span *ngIf="showText">{{ t("general.loading") }}...</span>
    </div>
  `,
})
export class LoaderComponent {
  @Input() showText = true;
}
