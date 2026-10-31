import { Component, Input } from "@angular/core";
import { CandidateCertification } from "../../candidates.types";

@Component({
  standalone: false,

  selector: "app-candidate-certification-list-item",
  templateUrl: "./candidate-certification-list-item.component.html",
  styleUrls: ["./candidate-certification-list-item.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidateCertificationListItemComponent {
  @Input() item!: CandidateCertification;

  showMoreStates: { [key: string]: boolean } = {};

  toggleDetails(key: string): void {
    this.showMoreStates[key] = !this.showMoreStates[key];
  }
}
