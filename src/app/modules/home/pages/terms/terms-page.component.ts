import { Component } from "@angular/core";

@Component({
  standalone: false,
  selector: "app-terms-page",
  templateUrl: "./terms-page.component.html",
  styleUrls: ["./terms-page.component.scss"],
})
export class TermsPageComponent {
  scrollTo(id: string): void {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}
