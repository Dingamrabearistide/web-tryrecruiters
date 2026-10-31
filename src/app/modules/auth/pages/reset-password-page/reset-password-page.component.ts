import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { AUTH_OTP_PHONE_OR_EMAIL, AuthService } from "../../auth.service";
import { NotificationChannel } from "../../auth.types";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogComponent } from "../../../../@1hand/components/message-dialog.component";

@Component({
  selector: "app-reset-password-page",
  standalone: false,
  templateUrl: "./reset-password-page.component.html",
  styleUrls: ["./reset-password-page.component.scss"],
})
export class ResetPasswordPageComponent {
  isLoading = false;
  hasError = false;
  errorMessage = "";
  mobileMenuOpen = false;

  get userEmail() {
    return localStorage.getItem(AUTH_OTP_PHONE_OR_EMAIL);
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private transloco: TranslocoService,
    private dialog: MatDialog,
  ) {}

  t(key: string): string {
    return this.transloco.translate(`auth.${key}`);
  }

  onSubmit(data: any) {
    if (!data) return;

    const payload = {
      email: this.userEmail!,
      resetPasswordToken: String(data.code),
      newPassword: data.password,
      channel: NotificationChannel.EMAIL,
    };

    this.hasError = false;
    this.isLoading = true;

    this.authService.resetPassword(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.dialog.open(MessageDialogComponent, {
          data: {
            title: this.t("resetPassword.passwordResetedTitle"),
            message: this.t("resetPassword.passwordResetedMessage"),
            handleOk: () => {
              this.router.navigateByUrl("/auth/login");
            },
          },
        });
      },
      error: (error) => {
        console.log(error);
        let errorMessage = "";
        if (error?.error && error.error?.message) {
          errorMessage = JSON.stringify(error.error.message);
        } else {
          errorMessage = this.transloco.translate("auth.errors.loadingRequest");
        }
        this.hasError = true;
        this.isLoading = false;
        this.errorMessage = errorMessage;
      },
    });
  }
}
