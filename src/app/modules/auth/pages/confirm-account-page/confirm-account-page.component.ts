import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  AUTH_OTP_METHOD,
  AUTH_OTP_PHONE_OR_EMAIL,
  AuthService,
} from "../../auth.service";
import { NotificationChannel } from "../../auth.types";
import { TranslocoService } from "@ngneat/transloco";
import { ResendCountdownComponent } from "../../../../@1hand/components/resend-count-down.component";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogComponent } from "../../../../@1hand/components/message-dialog.component";

@Component({
  selector: "app-confirm-account-page",
  standalone: false,
  templateUrl: "./confirm-account-page.component.html",
  styleUrls: ["./confirm-account-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ConfirmAccountPageComponent {
  @ViewChild('resendCodeRef') resendCodeRef!: ResendCountdownComponent;

  hasError = false;
  isLoading = false;
  errorMessage = "";
  showCodeInput = false;

  get method() {
    return localStorage.getItem(AUTH_OTP_METHOD) || NotificationChannel.EMAIL;
  }

  get phoneOrEmail() {
    return localStorage.getItem(AUTH_OTP_PHONE_OR_EMAIL);
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private transloco: TranslocoService,
    private dialog: MatDialog,
  ) {
    if (this.phoneOrEmail) {
      this.showCodeInput = true;
    }
  }

  private sendCode(email: string): void {
    this.hasError = false;
    this.isLoading = true;

    this.authService.sendConfirmationEmail({
      email,
      channel: NotificationChannel.EMAIL,
    }).subscribe({
      next: () => {
        this.hasError = false;
        this.isLoading = false;
        this.resendCodeRef?.startCountdown();
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

  onResendCode(): void {
    if (!this.phoneOrEmail) return;
    this.sendCode(this.phoneOrEmail);
  }

  onSubmitEmail(data: any) {
    if (!data || !data.email) return;

    const email = data.email;
    localStorage.setItem(AUTH_OTP_PHONE_OR_EMAIL, email);
    localStorage.setItem(AUTH_OTP_METHOD, NotificationChannel.EMAIL);
    this.showCodeInput = true;

    this.sendCode(email);
  }

  onSubmitCode(data: any) {
    if (!data || !data.code) return;

    const email = this.phoneOrEmail;
    if (!email) {
      this.errorMessage = this.transloco.translate(
        "auth.errors.noPhoneOrEmail",
      );
      this.hasError = true;
      return;
    }

    this.hasError = false;
    this.isLoading = true;

    this.authService.confirmAccount({ email, code: data.code }).subscribe({
      next: () => {
        this.hasError = false;
        this.isLoading = false;
        localStorage.removeItem(AUTH_OTP_PHONE_OR_EMAIL);
        localStorage.removeItem(AUTH_OTP_METHOD);
        this.dialog.open(MessageDialogComponent, {
          data: {
            title: this.transloco.translate("auth.confirm.verifyTitle"),
            message: this.transloco.translate("auth.confirm.verifyMessage"),
            handleOk: () => {
              this.router.navigateByUrl("/auth/login");
            },
          },
        });
      },
      error: (error) => {
        this.hasError = true;
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.errors.invalidCode");
      },
    });
  }

  onSubmit(data: any) {
    if (this.showCodeInput) {
      this.onSubmitCode(data);
    } else {
      this.onSubmitEmail(data);
    }
  }
}
