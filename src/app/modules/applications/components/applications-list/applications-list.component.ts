import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Application } from "../../applications.types";

@Component({
  standalone: false,

  selector: "app-applications-list",
  template: `
    <div class="applications-list">
      <div *ngIf="isLoading" class=" loading flex items-center justify-center">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
        ></div>
      </div>

      <div *ngIf="hasError" class="error">
        {{ "list.genericError" | transloco }}
      </div>
      <div
        *ngIf="!isLoading && !hasError && items.length === 0"
        class="no-data"
      >
        <p>{{ "list.noApplications" | transloco }}</p>
        <p>{{ "list.startCreating" | transloco }}</p>
      </div>
      <div *ngIf="!isLoading && !hasError && items.length > 0">
        <div *ngFor="let item of items" class="application-item">
          <div class="application-header">
            <h4>
              {{ item.candidate.firstName }} {{ item.candidate.lastName }}
            </h4>
            <span
              class="status"
              [class]="'status-' + item.status.toLowerCase()"
            >
              {{ "status." + item.status | transloco }}
            </span>
          </div>
          <div class="application-details">
            <p>
              <strong>{{ "columns.jobOffer" | transloco }}:</strong>
              {{ item.jobOffer.title || "—" }}
            </p>
            <p>
              <strong>{{ "columns.submittedAt" | transloco }}:</strong>
              {{
                item.submittedAt
                  ? (item.submittedAt | date)
                  : (item.createdAt | date)
              }}
            </p>
            <p *ngIf="item.message" class="message">
              <strong>{{ "columns.message" | transloco }}:</strong>
              {{
                item.message.length > 100
                  ? (item.message | slice: 0 : 100) + "..."
                  : item.message
              }}
            </p>
          </div>
          <div class="application-actions">
            <button
              type="button"
              class="btn btn-primary"
              (click)="view.emit(item)"
            >
              {{ "common.view" | transloco }}
            </button>
            <button
              type="button"
              class="btn btn-secondary"
              (click)="edit.emit(item)"
            >
              {{ "common.edit" | transloco }}
            </button>
            <button
              type="button"
              class="btn btn-danger"
              (click)="delete.emit(item)"
            >
              {{ "common.delete" | transloco }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .applications-list {
        padding: 1rem;
      }

      .loading,
      .error,
      .no-data {
        text-align: center;
        padding: 2rem;
        color: #666;
      }

      .error {
        color: #dc3545;
      }

      .application-item {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        margin: 1rem 0;
        padding: 1.5rem;
        background: #fff;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .application-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .application-header h4 {
        margin: 0;
        color: #333;
      }

      .status {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: uppercase;
      }

      .status-pending {
        background-color: #fff3cd;
        color: #856404;
      }

      .status-reviewed {
        background-color: #d1ecf1;
        color: #0c5460;
      }

      .status-accepted {
        background-color: #d4edda;
        color: #155724;
      }

      .status-rejected {
        background-color: #f8d7da;
        color: #721c24;
      }

      .status-canceled {
        background-color: #e2e3e5;
        color: #383d41;
      }

      .application-details p {
        margin: 0.5rem 0;
        color: #666;
      }

      .message {
        font-style: italic;
      }

      .application-actions {
        margin-top: 1rem;
        display: flex;
        gap: 0.5rem;
      }

      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 0.875rem;
        transition: background-color 0.2s;
      }

      .btn-primary {
        background-color: #007bff;
        color: white;
      }

      .btn-primary:hover {
        background-color: #0056b3;
      }

      .btn-secondary {
        background-color: #6c757d;
        color: white;
      }

      .btn-secondary:hover {
        background-color: #545b62;
      }

      .btn-danger {
        background-color: #dc3545;
        color: white;
      }

      .btn-danger:hover {
        background-color: #c82333;
      }
    `,
  ],
})
export class ApplicationsListComponent {
  @Input() items: Application[] = [];
  @Input() isLoading: boolean = false;
  @Input() hasError: boolean = false;

  @Output() view = new EventEmitter<Application>();
  @Output() edit = new EventEmitter<Application>();
  @Output() delete = new EventEmitter<Application>();
}
