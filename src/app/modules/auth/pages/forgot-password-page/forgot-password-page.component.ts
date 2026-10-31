import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  AUTH_OTP_METHOD,
  AUTH_OTP_PHONE_OR_EMAIL,
  AuthService,
} from "../../auth.service";
import { NotificationChannel } from "../../auth.types";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  selector: "app-forgot-password-page",
  standalone: false,
  templateUrl: "./forgot-password-page.component.html",
  styleUrls: ["./forgot-password-page.component.scss"],
})
export class ForgotPasswordPageComponent {
  hasError = false;
  isLoading = false;
  errorMessage = "";
  mobileMenuOpen = false;
  successSent = false;

  get method(): NotificationChannel {
    const otpMethod = localStorage.getItem(AUTH_OTP_METHOD);
    return otpMethod
      ? (otpMethod as NotificationChannel)
      : NotificationChannel.EMAIL;
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private transloco: TranslocoService,
  ) {}

  onSubmit(data: any) {
    if (!data) return;

    const payload = {
      email: data.email,
      channel: NotificationChannel.EMAIL,
    };

    this.hasError = false;
    this.isLoading = true;

    this.authService.forgotPassword(payload).subscribe({
      next: () => {
        this.hasError = false;
        this.isLoading = false;
        this.successSent = true;

        localStorage.setItem(AUTH_OTP_PHONE_OR_EMAIL, data.email);
        this.router.navigateByUrl("/auth/reset-password");
      },
      error: (error) => {
        this.hasError = true;
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.errors.loadingRequest");
      },
    });
  }
}
