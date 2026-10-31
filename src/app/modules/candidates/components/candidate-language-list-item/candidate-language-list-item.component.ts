import { Component, Input } from "@angular/core";
import { TranslocoService } from "@ngneat/transloco";
import {
  CandidateLanguage,
  LanguageLevel,
} from "@modules/candidates/candidates.types";

@Component({
  standalone: false,

  selector: "app-candidate-language-list-item",
  templateUrl: "./candidate-language-list-item.component.html",
  styleUrls: ["./candidate-language-list-item.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidateLanguageListItemComponent {
  @Input() item!: CandidateLanguage;

  constructor(private transloco: TranslocoService) {}

  getLanguageLevelLabel(level: LanguageLevel): string {
    switch (level) {
      case LanguageLevel.BEGINNER:
        return this.transloco.translate(
          "candidateDetails.beginner",
          undefined,
          "candidates"
        );
      case LanguageLevel.INTERMEDIATE:
        return this.transloco.translate(
          "candidateDetails.intermediate",
          undefined,
          "candidates"
        );
      case LanguageLevel.PROFESSIONAL:
        return this.transloco.translate(
          "candidateDetails.professional",
          undefined,
          "candidates"
        );
      case LanguageLevel.NATIVE:
        return this.transloco.translate(
          "candidateDetails.native",
          undefined,
          "candidates"
        );
      default:
        return "";
    }
  }

  getLanguageLevelColor(level: LanguageLevel): string {
    switch (level) {
      case LanguageLevel.BEGINNER:
        return "bg-gray-100 text-gray-800";
      case LanguageLevel.INTERMEDIATE:
        return "bg-yellow-100 text-yellow-800";
      case LanguageLevel.PROFESSIONAL:
        return "bg-green-100 text-green-800";
      case LanguageLevel.NATIVE:
        return "bg-blue-100 text-[#1D9BED]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }
}
