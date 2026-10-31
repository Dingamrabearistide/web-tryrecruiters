import { Component, Input } from "@angular/core";
import { CandidateEducation } from "@modules/candidates/candidates.types";

@Component({
  standalone: false,

  selector: "app-candidate-education-list-item",
  templateUrl: "./candidate-education-list-item.component.html",
  styleUrls: ["./candidate-education-list-item.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidateEducationListItemComponent {
  @Input() item!: CandidateEducation;

  showMore: Record<string, boolean> = {};

  toggleDetails(key: string): void {
    this.showMore[key] = !this.showMore[key];
  }
}
