import { Component, Input } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import {
  CandidateTool,
  SkillLevel,
} from "@modules/candidates/candidates.types";

@Component({
  standalone: false,

  selector: "app-candidate-tool-list-item",
  templateUrl: "./candidate-tool-list-item.component.html",
  styleUrls: ["./candidate-tool-list-item.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidateToolListItemComponent {
  @Input() item!: CandidateTool;
  constructor(private transloco: TranslocoService) {}

  getSkillLevelLabel(level?: SkillLevel): string {
    if (!level) return "";

    switch (level) {
      case SkillLevel.BEGINNER:
        return this.transloco.translate(
          "candidateDetails.beginner",
          undefined,
          "candidates"
        );
      case SkillLevel.INTERMEDIATE:
        return this.transloco.translate(
          "candidateDetails.intermediate",
          undefined,
          "candidates"
        );
      case SkillLevel.ADVANCED:
        return this.transloco.translate(
          "candidateDetails.advanced",
          undefined,
          "candidates"
        );
      case SkillLevel.EXPERT:
        return this.transloco.translate(
          "candidateDetails.expert",
          undefined,
          "candidates"
        );
      default:
        return "";
    }
  }

  getSkillLevelColor(level?: SkillLevel): string {
    if (!level) return "bg-gray-100 text-gray-800";

    switch (level) {
      case SkillLevel.BEGINNER:
        return "bg-gray-100 text-gray-800";
      case SkillLevel.INTERMEDIATE:
        return "bg-blue-100 text-blue-800";
      case SkillLevel.ADVANCED:
        return "bg-green-100 text-green-800";
      case SkillLevel.EXPERT:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
