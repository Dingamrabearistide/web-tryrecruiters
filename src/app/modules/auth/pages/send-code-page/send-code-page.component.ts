import { Component } from "@angular/core";
import { Router } from "@angular/router";
import {
  AUTH_OTP_CONTEXT,
  AUTH_OTP_METHOD,
  AUTH_OTP_PHONE_OR_EMAIL,
  AuthService,
  SendCodeContext,
} from "../../auth.service";
import { NotificationChannel } from "../../auth.types";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import { MessageDialogComponent } from "../../../../@1hand/components/message-dialog.component";

@Component({
  selector: "app-send-code-page",
  templateUrl: "./send-code-page.component.html",
  styleUrls: ["./send-code-page.component.scss", "../../../../../styles/legacy-styles.css"],
  standalone: false,
})
export class SendCodePageComponent {
  isLoading = false;
  hasError = false;
  errorMessage = "";

  get method() {
    return localStorage.getItem(AUTH_OTP_METHOD);
  }

  get phoneOrEmail() {
    return localStorage.getItem(AUTH_OTP_PHONE_OR_EMAIL);
  }

  get AuthOtpContext() {
    return localStorage.getItem(AUTH_OTP_CONTEXT) as SendCodeContext;
  }

  constructor(
    private authService: AuthService,
    private router: Router,

    private transloco: TranslocoService,
    private dialog: MatDialog
  ) {}

  async onChannelSelected(channel: NotificationChannel) {
    if (this.isLoading) return;
    if (!this.phoneOrEmail) {
      alert(this.transloco.translate("auth.errors.noPhoneOrEmail"));
      return;
    }

    if (!this.AuthOtpContext) {
      alert(this.transloco.translate("auth.errors.noContext"));
      return;
    }

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    localStorage.setItem(AUTH_OTP_METHOD, channel);

    try {
      await this.authService
        .send2FACode(channel, this.AuthOtpContext, this.phoneOrEmail)
        .subscribe({
          next: () => {
            this.isLoading = false;
            this.dialog.open(MessageDialogComponent, {
              data: {
                title: this.transloco.translate("auth.otp.codeSentTitle"),
                message: this.transloco.translate("auth.otp.codeSentMessage", {
                  channel: this.method, // 'email', 'sms', ou 'whatsapp' selon la valeur en localStorage
                }),
                handleOk: () => {
                  this.router.navigate(["/auth/verify-otp"]);
                },
              },
            });
          },
          error: (error) => {
            console.log(error);
            this.hasError = true;
            this.errorMessage = JSON.stringify(error.error.message);

            // "An error occurred while sending the code";
            this.isLoading = false;
          },
        });
    } catch (err: any) {}

    // try {
    //   await this.authService.send2FACode(channel); // Appel API selon canal
    //   this.router.navigate(['/auth/verify-otp'], {
    //     queryParams: { channel },
    //   });
    // } catch (err: any) {
    //   this.hasError = true;
    //   this.errorMessage = err?.message || 'An error occurred';
    // } finally {
    //   this.isLoading = false;
    // }
  }
}
