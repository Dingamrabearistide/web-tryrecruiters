import { Component, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import {
  AUTH_OTP_CONTEXT,
  AUTH_OTP_METHOD,
  AUTH_OTP_PHONE_OR_EMAIL,
  AuthService,
  SendCodeContext,
} from "../../auth.service";
import { TranslocoService } from "@ngneat/transloco";
import { MessageDialogComponent } from "../../../../@1hand/components/message-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { wait } from "../../../../@1hand/utils";
import { LoginResponseDto, NotificationChannel, Role } from "../../auth.types";
import { ResendCountdownComponent } from "../../../../@1hand/components/resend-count-down.component";

@Component({
  selector: "app-two-factor-page",
  standalone: false,
  templateUrl: "./two-factor-page.component.html",
  styleUrls: ["./two-factor-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class TwoFactorPageComponent {
  @ViewChild(ResendCountdownComponent) resendCodeRef!: ResendCountdownComponent;

  hasError = false;
  isLoading = false;
  errorMessage = "";

  constructor(
    private router: Router,
    private authService: AuthService,
    private transloco: TranslocoService,
    private dialog: MatDialog
  ) {}

  get method(): string | null {
    return localStorage.getItem(AUTH_OTP_METHOD);
  }

  get phoneOrEmail(): string | null {
    return localStorage.getItem(AUTH_OTP_PHONE_OR_EMAIL);
  }

  get context(): SendCodeContext {
    return localStorage.getItem(AUTH_OTP_CONTEXT) as SendCodeContext;
  }

  async onSubmit(payload: { code: string }) {
    this.hasError = false;
    this.isLoading = true;

    if (!this.phoneOrEmail) {
      throw new Error(
        this.transloco.translate("auth.errors.noPhoneOrEmailProvided")
      );
    }

    this.authService
      .verify2FACode(this.context, payload.code, this.phoneOrEmail)
      .subscribe({
        next: async (response) => {
          await wait();

          this.handleSuccess(this.context, response);
          this.isLoading = false;
        },
        error: (error) => {
          this.hasError = true;
          this.errorMessage =
            error?.error?.message ||
            this.transloco.translate("auth.errors.invalidCode");
          this.isLoading = false;
        },
      });
  }

  handleSuccess(context: SendCodeContext, response: LoginResponseDto) {
    let title = "";
    let message = "";
    let redirectUrl = "/";

    switch (context) {
      case "login":
        this.authService.setAuthenticated(
          response.accessToken,
          response.currentUser,
          response.role
        );
        title = this.transloco.translate("auth.login.verifySuccessTitle");
        message = this.transloco.translate("auth.login.verifySuccessMessage");
        redirectUrl =
          response.role === Role.CANDIDATE
            ? `/dashboard/candidates/${response.currentUser.id}`
            : response.role === Role.RECRUITER
              ? `/dashboard/employers/${response.currentUser.id}`
              : `/dashboard/admin/${response.currentUser.id}`;
        break;

      case "register":
        this.authService.setAuthenticated(
          response.accessToken,
          response.currentUser,
          response.role
        );
        title = this.transloco.translate("auth.register.verifyTitle");
        message = this.transloco.translate("auth.register.verifyMessage");
        redirectUrl =
          response.role === Role.CANDIDATE
            ? `/dashboard/candidates/${response.currentUser.id}`
            : response.role === Role.RECRUITER
              ? `/dashboard/employers/${response.currentUser.id}`
              : `/dashboard/admin/${response.currentUser.id}`;
        break;

      case "forgot-password":
        title = this.transloco.translate("auth.forgot.verifyTitle");
        message = this.transloco.translate("auth.forgot.verifyMessage");
        redirectUrl = "/auth/reset-password";
        break;

      case "confirm-account":
        title = this.transloco.translate("auth.confirm.verifyTitle");
        message = this.transloco.translate("auth.confirm.verifyMessage");
        redirectUrl = "/auth/login";
        break;

      default:
        title = this.transloco.translate("auth.genericVerifyTitle");
        message = this.transloco.translate("auth.genericVerifyMessage");
        redirectUrl = "/";
        break;
    }

    this.dialog.open(MessageDialogComponent, {
      data: {
        title,
        message,
        handleOk: () => {
          this.router.navigateByUrl(redirectUrl);
        },
      },
    });
  }

  handleResend() {
    if (this.isLoading) return;
    this.isLoading = true;

    const payload = {
      email: this.phoneOrEmail!,
      channel: NotificationChannel.EMAIL,
    };

    this.authService.sendConfirmationEmail(payload).subscribe({
      next: async () => {
        await wait();
        this.isLoading = false;
        this.hasError = false;

        this.dialog.open(MessageDialogComponent, {
          data: {
            title: this.transloco.translate("auth.confirm.resendTitle"),
            message: this.transloco.translate("auth.confirm.resendMessage"),
            handleOk: () => {
              this.resendCodeRef.startCountdown();
            },
          },
        });
      },
      error: (error) => {
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.confirm.error");
      },
    });
  }
}
