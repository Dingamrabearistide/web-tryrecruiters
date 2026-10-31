import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../auth.service";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-confirm-email-page",
  standalone: false,
  templateUrl: "./confirm-email-page.component.html",
  styleUrls: ["./confirm-email-page.component.scss"],
})
export class ConfirmEmailPageComponent implements OnInit {
  isLoading = true;
  isSuccess = false;
  hasError = false;
  errorMessage = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private transloco: TranslocoService,
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get("token");
    const email = this.route.snapshot.queryParamMap.get("email");

    if (!token || !email) {
      this.isLoading = false;
      this.hasError = true;
      this.errorMessage = this.transloco.translate(
        "auth.confirmEmail.missingParams",
      );
      return;
    }

    this.authService.confirmEmail({ token, email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.errors.loadingRequest");
      },
    });
  }

  goToLogin(): void {
    this.router.navigateByUrl("/auth/login");
  }
}
