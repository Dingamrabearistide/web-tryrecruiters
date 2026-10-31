import { Component, Input } from "@angular/core";

@Component({
  standalone: false,

  selector: "app-company-success-modal",
  template: `
    <div class="company-success-modal">
      <div class="modal-content">
        <h3>Success!</h3>
        <p>Company operation completed successfully</p>
        <div *ngIf="item">
          <p>Item: {{ item.name || item.id || "Company" }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .company-success-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        max-width: 400px;
      }
    `,
  ],
})
export class CompanySuccessModalComponent {
  @Input() item: any;
}
