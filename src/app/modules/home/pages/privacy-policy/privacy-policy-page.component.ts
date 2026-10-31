import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  standalone: false,

  selector: "app-privacy-policy-page",
  templateUrl: "./privacy-policy-page.component.html",
  styleUrls: ["./privacy-policy-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class PrivacyPolicyPageComponent {
  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(["/"]);
  }

  openPdf(): void {
    const pdfUrl = "/assets/docs/Tryrecruiters%20Privacy%20Policy.pdf";
    window.open(pdfUrl, "_blank");
  }
}
