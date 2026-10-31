import { Component, Input } from "@angular/core";

@Component({
  standalone: false,

  selector: "app-loader2",
  template: `
    <div *ngIf="isLoading" class="loader-container">
      <div class="loader">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        ></div>
        <p *ngIf="message" class="mt-2 text-sm text-gray-600">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .loader-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 2rem;
      }
      .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `,
  ],
})
export class LoaderComponent2 {
  @Input() isLoading: boolean = false;
  @Input() message: string = "";
}
