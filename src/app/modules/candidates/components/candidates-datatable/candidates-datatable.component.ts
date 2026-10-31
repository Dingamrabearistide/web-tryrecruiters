import { Component, Input, Output, EventEmitter, inject } from "@angular/core";
import { getCandidateColumns } from "../../candidates.config";
import { Candidate } from "../../candidates.types";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-candidates-datatable",
  template: `
    <app-generic-datatable
      [items]="items"
      [columns]="columns"
      [isLoading]="isLoading"
      [hasError]="hasError"
      [showCreateButton]="showCreateButton"
      [createLabel]="createLabel"
      [emptyTitle]="emptyTitle"
      [emptySubtitle]="emptySubtitle"
      (create)="create.emit()"
      (view)="view.emit($event)"
      (update)="update.emit($event)"
      (delete)="delete.emit($event)"
    ></app-generic-datatable>
  `,
  styleUrls: ["./candidates-datatable.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesDatatableComponent {
  private translocoService = inject(TranslocoService);

  @Input() items: Candidate[] = [];
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() showCreateButton = true;

  @Output() create = new EventEmitter<void>();
  @Output() view = new EventEmitter<Candidate>();
  @Output() update = new EventEmitter<Candidate>();
  @Output() delete = new EventEmitter<Candidate>();

  get createLabel() {
    return this.translocoService.translate("candidates.actions.create");
  }

  get emptyTitle() {
    return this.translocoService.translate("candidates.list.empty");
  }

  get emptySubtitle() {
    return this.translocoService.translate("candidates.list.emptySubtitle");
  }

  get columns() {
    return getCandidateColumns(this.translocoService);
  }
}
