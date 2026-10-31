import { CommonModule, Location } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "app-back-button",
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule],
  templateUrl: "./back-button.component.html",
  styleUrl: "./back-button.component.scss",
})
export class BackButtonComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  handleBack() {
    this.router.navigate(["../"], { relativeTo: this.route.parent });
  }

  // Option 2: retour historique (plus robuste)
  handleBackHistory() {
    this.location.back();
  }
}
