import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginPageComponent } from "./pages/login-page/login-page.component";
import { RegisterPageComponent } from "./pages/register-page/register-page.component";
import { ConfirmAccountPageComponent } from "./pages/confirm-account-page/confirm-account-page.component";
import { TwoFactorPageComponent } from "./pages/two-factor-page/two-factor-page.component";
import { ForgotPasswordPageComponent } from "./pages/forgot-password-page/forgot-password-page.component";
import { ResetPasswordPageComponent } from "./pages/reset-password-page/reset-password-page.component";
import { AuthComponent } from "./auth.component";
import { SendCodePageComponent } from "./pages/send-code-page/send-code-page.component";
import { ConfirmEmailPageComponent } from "./pages/confirm-email-page/confirm-email-page.component";

const routes: Routes = [
  {
    path: "",
    component: AuthComponent,
    children: [
      { path: "", redirectTo: "login", pathMatch: "full" },
      { path: "confirm-email", component: ConfirmEmailPageComponent },
      { path: "confirm-account", component: ConfirmAccountPageComponent },
      { path: "verify-otp", component: TwoFactorPageComponent },
      { path: "send-code", component: SendCodePageComponent },
      {
        path: "login",
        component: LoginPageComponent,
      },
      {
        path: "register",
        component: RegisterPageComponent,
      },
      {
        path: "forgot-password",
        component: ForgotPasswordPageComponent,
      },
      {
        path: "reset-password",
        component: ResetPasswordPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
