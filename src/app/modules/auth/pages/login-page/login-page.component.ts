import { ChangeDetectorRef, Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import {
  AUTH_OTP_CONTEXT,
  AUTH_OTP_PHONE_OR_EMAIL,
  AuthService,
} from "../../auth.service";
import { LoginDto, Role } from "../../auth.types";
import { wait } from "../../../../@1hand/utils";
import { MessageDialogComponent } from "../../../../@1hand/components/message-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "@env/environment";
import { GoogleService } from "@modules/auth/google.service";
import { LinkedInService } from "@modules/auth/linkedin.service";

declare const google: any;

@Component({
  selector: "app-login-page",
  standalone: false,
  templateUrl: "./login-page.component.html",
  styleUrls: [
    "./login-page.component.scss",
  ],
})
export class LoginPageComponent {
  isLoading = false;
  hasError = false;
  errorMessage = "";
  sessionExpiredMessage = "";

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private transloco: TranslocoService,
    private dialog: MatDialog,
    private googleService: GoogleService,
    private linkedInService: LinkedInService,
  ) { }

  async ngOnInit(): Promise<void> {
    // Vérifier si l'utilisateur a été redirigé après expiration de session
    this.route.queryParams.subscribe((params) => {
      if (params["sessionExpired"] === "true") {
        this.sessionExpiredMessage = this.transloco.translate(
          "auth.sessionExpiredMessage",
        );
      }
    });

    const currentLang = this.transloco.getActiveLang();
    await this.googleService.loadSdk(currentLang);

    google.accounts.id.initialize({
      client_id: environment.google_id,
      callback: this.handleCredentialResponse.bind(this),
      locale: currentLang,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv")!,
      { theme: "outline", size: "large" },
    );

    // google.accounts.id.prompt();
  }

  handleCredentialResponse(response: any) {
    const token = response.credential;
    console.log(response);

    this.hasError = false;
    this.isLoading = true;

    this.googleService.loginWithGoogle(token).subscribe({
      next: async (res) => {
        this.hasError = false;

        try {
          this.authService.setAuthenticated(
            res.accessToken,
            res.currentUser,
            res.role,
          );

          const redirectUrl =
            res.role === Role.CANDIDATE
              ? `/dashboard/candidates/${res.currentUser.id}`
              : res.role === Role.RECRUITER
                ? `/dashboard/employers/${res.currentUser.id}`
                : `/dashboard/admin/${res.currentUser.id}`;

          const navigated = await this.router.navigateByUrl(redirectUrl);
          if (!navigated) {
            this.reportLoginFailure(
              new Error(`Navigation to ${redirectUrl} was blocked`),
            );
          }
        } catch (err) {
          this.reportLoginFailure(err);
        }
      },
      error: (error) => {
        console.error("Erreur", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.errors.genericError");
        this.cdr.detectChanges();

        console.log("Error Message: ", this.errorMessage, this.hasError);
      },
    });
  }

  loginWithLinkedIn() {
    this.linkedInService.loginWithLinkedIn();
  }

  onSubmit(data: LoginDto) {
    if (!data) return;

    this.hasError = false;
    this.isLoading = true;

    this.authService.login(data).subscribe({
      next: async (response) => {
        await wait();

        this.hasError = false;

        // Check if 2FA is enabled or not
        if (response.accessToken) {
          // 2FA is disabled - login directly
          try {
            this.authService.setAuthenticated(
              response.accessToken,
              response.currentUser,
              response.role,
            );

            const redirectUrl =
              response.role === Role.CANDIDATE
                ? `/dashboard/candidates/${response.currentUser.id}`
                : response.role === Role.RECRUITER
                  ? `/dashboard/employers/${response.currentUser.id}`
                  : `/dashboard/admin/${response.currentUser.id}`;

            const navigated = await this.router.navigateByUrl(redirectUrl);
            if (!navigated) {
              this.reportLoginFailure(
                new Error(`Navigation to ${redirectUrl} was blocked`),
              );
            }
          } catch (err) {
            this.reportLoginFailure(err);
          }
        } else {
          // 2FA is enabled - redirect to verification
          this.isLoading = false;
          localStorage.setItem(AUTH_OTP_CONTEXT, "login");
          localStorage.setItem(AUTH_OTP_PHONE_OR_EMAIL, data.email);

          this.dialog.open(MessageDialogComponent, {
            data: {
              title: this.transloco.translate("auth.login.verifyTitle"),
              message: this.transloco.translate("auth.login.verifyMessage"),
              handleOk: () => {
                this.router.navigate(["/auth/send-code"]);
              },
            },
          });
        }
      },
      error: (error) => {
        this.hasError = true;
        this.isLoading = false;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.errors.genericError");
      },
    });
  }

  /** Login succeeded but redirecting into the dashboard didn't — without
   * this, a blocked/failed navigateByUrl() left the button spinning
   * forever with no feedback since nothing else resets isLoading on that
   * path. */
  private reportLoginFailure(err: unknown): void {
    console.error("Post-login redirect failed:", err);
    this.isLoading = false;
    this.hasError = true;
    this.errorMessage = this.transloco.translate("auth.errors.genericError");
    this.cdr.detectChanges();
  }
}
