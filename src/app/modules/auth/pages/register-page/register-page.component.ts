import { Component } from "@angular/core";
import {
  AccountType,
  RegisterFormData,
} from "../../components/register-form/register-form.component";
import { TranslocoService } from "@ngneat/transloco";
import { Router } from "@angular/router";
import { MessageDialogComponent } from "../../../../@1hand/components/message-dialog.component";
import {
  AUTH_OTP_CONTEXT,
  AUTH_OTP_PHONE_OR_EMAIL,
  AuthService,
} from "../../auth.service";
import {
  CandidateRegisterDto,
  RecruiterRegisterDto,
} from "../../auth.types";
import { MatDialog } from "@angular/material/dialog";
import { wait } from "../../../../@1hand/utils";

type PayloadDto = RecruiterRegisterDto | CandidateRegisterDto;

@Component({
  selector: "app-register-page",
  standalone: false,
  templateUrl: "./register-page.component.html",
  styleUrls: ["./register-page.component.scss"],
})
export class RegisterPageComponent {
  isLoading = false;
  hasError = false;
  errorMessage = "";
  mobileMenuOpen = false;

  accountType: AccountType = "CANDIDATE";

  CANDIDATE_ACCOUNT: AccountType = "CANDIDATE";
  RECRUITER_ACCOUNT: AccountType = "RECRUITER";

  constructor(
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private transloco: TranslocoService,
  ) {}

  t(key: string): string {
    return this.transloco.translate(`auth.${key}`);
  }

  selectAccountType(accountType: AccountType) {
    this.accountType = accountType;
  }

  onSubmit(data: RegisterFormData) {
    console.log(data);
    if (!data) return;

    const payload: PayloadDto = {
      ...data,
      phoneNumber: data.phone,
    };

    this.hasError = false;
    this.isLoading = true;

    const request$ =
      this.accountType === "RECRUITER"
        ? this.authService.recruiterRegister(payload as RecruiterRegisterDto)
        : this.authService.candidateRegister(payload);

    request$.subscribe({
      next: async () => {
        localStorage.setItem(AUTH_OTP_PHONE_OR_EMAIL, data.email);
        localStorage.setItem(AUTH_OTP_CONTEXT, "register");

        await wait();
        this.router.navigate(["/auth/confirm-account"]);
      },
      error: (error: any) => {
        this.hasError = true;
        this.isLoading = false;

        this.errorMessage =
          error?.error?.message || this.t("errors.genericError");
      },
    });
  }

  openPdf(): void {
    this.router.navigate(["/terms"]);
  }
}
