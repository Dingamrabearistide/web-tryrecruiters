import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { TranslocoService } from "@ngneat/transloco";
import { defaultLanguage } from "../../../transloco-loader";

@Component({
  selector: "app-language-switcher",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <select
      id="language-select"
      [(ngModel)]="selectedLang"
      (change)="onLanguageChange($event)"
      class="mt-1 block w-full pl-3 p-2 py-2  rounded-full border border-gray-300 focus:blue-none focus:ring-blue-500 focus:border-blue-500 text-sm"
    >
      <option *ngFor="let lang of languages" [value]="lang.code">
        {{ lang.label }}
      </option>
    </select>
  `,
})
export class LanguageSwitcherComponent implements OnInit {
  languages = [
    {
      label: "🇫🇷  Français",
      code: "fr",
    },
    {
      label: "🇺🇸  Anglais",
      code: "en",
    },
  ];
  selectedLang = "en";

  constructor(private translocoService: TranslocoService) {}

  ngOnInit(): void {
    this.selectedLang = defaultLanguage;
  }

  onLanguageChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedLang = value;
    this.translocoService.setActiveLang(value);

    localStorage.setItem("language", value);
  }
}
