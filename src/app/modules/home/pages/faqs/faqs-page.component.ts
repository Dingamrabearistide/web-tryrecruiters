import { Component, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  standalone: false,

  selector: "app-faqs-page",
  templateUrl: "./faqs-page.component.html",
  styleUrls: ["./faqs-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class FaqsPageComponent implements AfterViewInit {
  openFaq: number | null = null;
  email = "contact@tryrecruiters.com";
  constructor(private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    // Scroll to fragment if present
    this.route.fragment.subscribe((frag) => {
      if (!frag) return;
      // Give Angular time to render the DOM
      setTimeout(() => {
        const el = document.getElementById(frag);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    });
  }

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }

  navigateToContact(): void {
    // Navigate to contact page
    window.location.href = "/contact#contact-form";
  }
}
