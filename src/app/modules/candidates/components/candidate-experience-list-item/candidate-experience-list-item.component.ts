import { Component, Input } from "@angular/core";
import { CandidateExperience } from "@modules/candidates/candidates.types";

@Component({
  standalone: false,

  selector: "app-candidate-experience-list-item",
  templateUrl: "./candidate-experience-list-item.component.html",
  styleUrls: ["./candidate-experience-list-item.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidateExperienceListItemComponent {
  @Input() item!: CandidateExperience;

  showMoreStates: Record<string, boolean> = {};

  toggleDetails(key: string): void {
    this.showMoreStates[key] = !this.showMoreStates[key];
  }
}
