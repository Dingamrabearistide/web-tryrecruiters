import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Company } from "@modules/compagnies/companies.types";

@Component({
  standalone: false,

  selector: "app-companies-list",
  templateUrl: "./companies-list.component.html",
  styleUrls: ["./companies-list.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CompaniesListComponent {
  @Input() items: Company[] = [];
  @Input() isLoading: boolean = false;
  @Input() hasError: boolean = false;

  @Output("onView") onView$ = new EventEmitter<Company>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<Company>();

  onView(item: Company) {
    this.onView$.emit(item);
  }
}
