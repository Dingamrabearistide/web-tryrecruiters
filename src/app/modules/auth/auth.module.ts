import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  TranslocoModule,
  Translation,
  TRANSLOCO_SCOPE,
} from "@ngneat/transloco";

import { AuthRoutingModule } from "./auth-routing.module";
import { AuthComponent } from "./auth.component";

// Form
import { ConfirmAccountFormComponent } from "./components/confirm-account-form/confirm-account-form.component";
import { ForgotPasswordFormComponent } from "./components/forgot-password-form/forgot-password-form.component";
import { LoginFormComponent } from "./components/login-form/login-form.component";
import { OtpFormComponent } from "./components/otp-form/otp-form.component";
import { RegisterFormComponent } from "./components/register-form/register-form.component";
import { ResetPasswordFormComponent } from "./components/reset-password-form/reset-password-form.component";

// Pages
import { ConfirmAccountPageComponent } from "./pages/confirm-account-page/confirm-account-page.component";
import { ConfirmEmailPageComponent } from "./pages/confirm-email-page/confirm-email-page.component";
import { ForgotPasswordPageComponent } from "./pages/forgot-password-page/forgot-password-page.component";
import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { TwoFactorPageComponent } from "./pages/two-factor-page/two-factor-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { ResetPasswordPageComponent } from "./pages/reset-password-page/reset-password-page.component";
import { SupportedLanguages } from "../../transloco-loader";
import { FormFieldErrorsComponent } from "../../@1hand/components/form-field-errors/form-field-errors.component";
import { GenericErrorComponent } from "../../@1hand/components/generic-error/generic-error.component";
import { LanguageSwitcherComponent } from "../core/components/language-switcher.component";
import { SendCodeChannelComponent } from "./components/send-code-channel/send-code-channel.component";
import { SendCodePageComponent } from "./pages/send-code-page/send-code-page.component";
import { LoaderComponent } from "../core/components/loader.component";
import { MessageDialogComponent } from "../../@1hand/components/message-dialog.component";
import { MatDialogModule } from "@angular/material/dialog";
import { ResendCountdownComponent } from "../../@1hand/components/resend-count-down.component";
import { CountrySelectComponent } from "../../@1hand/components/country-select/country-select.component";
import { SearchableSelectComponent } from "../../@1hand/components/searchable-select/searchable-select.component";
import { PhoneInputComponent } from "../../@1hand/components/phone-input/phone-input.component";
import { OtpInputComponent } from "../../@1hand/components/otp-input/otp-input.component";
import { GoogleService } from "./google.service";
import { LinkedInService } from "./linkedin.service";
import { NavbarComponent } from "../home/layout/header/navbar.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce((acc, lang) => {
    acc[lang] = () => import(`./i18n/${lang}.json`);
    return acc;
  }, {} as Record<string, () => Promise<Translation>>);

@NgModule({
  declarations: [
    AuthComponent,

    // Core
    FormFieldErrorsComponent,

    // Form
    ConfirmAccountFormComponent,
    ConfirmAccountPageComponent,
    ForgotPasswordFormComponent,
    ForgotPasswordPageComponent,
    LoginFormComponent,
    LoginPageComponent,
    OtpFormComponent,
    SendCodeChannelComponent,

    // Pages
    TwoFactorPageComponent,
    ConfirmEmailPageComponent,
    RegisterFormComponent,
    RegisterPageComponent,
    ResetPasswordFormComponent,
    ResetPasswordPageComponent,
    SendCodePageComponent,
  ],
  imports: [
    GenericErrorComponent,
    LanguageSwitcherComponent,
    LoaderComponent,
    MessageDialogComponent,
    NavbarComponent,
    ResendCountdownComponent,
    CountrySelectComponent,
    SearchableSelectComponent,
    OtpInputComponent,
    PhoneInputComponent,

    //
    CommonModule,
    AuthRoutingModule,
    TranslocoModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "auth",
        loader,
      },
    },
    GoogleService,
    LinkedInService,
  ],
})
export class AuthModule {}
