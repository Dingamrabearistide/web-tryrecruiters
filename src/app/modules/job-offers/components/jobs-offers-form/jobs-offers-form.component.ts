import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  standalone: false,

  selector: "app-jobs-offers-form",
  template: `
    <div class="jobs-offers-form">
      <div *ngIf="isLoading" class="flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        ></div>
      </div>
      <div *ngIf="!isLoading">
        <form (ngSubmit)="onSubmit.emit({})">
          <h3>Job Offer Form</h3>
          <p>Job offer form placeholder - replace with actual form</p>
          <div *ngIf="categories?.length">
            <p>Categories available: {{ categories.length }}</p>
          </div>
          <div *ngIf="companies?.length">
            <p>Companies available: {{ companies.length }}</p>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  `,
  styles: [
    `
      .jobs-offers-form {
        padding: 1rem;
      }
      form {
        border: 1px solid #ccc;
        padding: 1rem;
      }
    `,
  ],
})
export class JobsOffersFormComponent {
  @Input() isLoading: boolean = false;
  @Input() categories: any[] = [];
  @Input() companies: any[] = [];
  @Output() onSubmit = new EventEmitter<any>();
}
