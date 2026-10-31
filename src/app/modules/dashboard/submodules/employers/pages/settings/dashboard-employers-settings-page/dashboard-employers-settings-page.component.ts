import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";

import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "@env/environment";
import { AuthService } from "@modules/auth/auth.service";
import { NotificationChannel, User } from "@modules/auth/auth.types";
import { CandidatesService } from "@modules/candidates/candidates.service";
import {
  GenericModalData,
  GenericModalComponent,
  GenericModalType,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";

// Import child components
import { ProfileSettingsComponent } from "../../../../../components/profile-settings/profile-settings.component";
import { PasswordSettingsComponent } from "../../../../../components/password-settings/password-settings.component";
import { TwoFactorSettingsComponent } from "../../../../../components/two-factor-settings/two-factor-settings.component";
import { GenericErrorComponent } from "../../../../../../../@1hand/components/generic-error/generic-error.component";

interface PasswordChangeDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface TwoFactorSettings {
  enabled: boolean;
  method: NotificationChannel;
}

interface AccountSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
}

interface SettingsService {
  updatePassword(data: PasswordChangeDto): Observable<any>;
  updateTwoFactor(data: TwoFactorSettings): Observable<any>;
  updateAccountSettings(data: AccountSettings): Observable<any>;
  closeAccount(): Observable<any>;
  getTwoFactorSettings(): Observable<TwoFactorSettings>;
  getAccountSettings(): Observable<AccountSettings>;
}

@Component({
  selector: "app-dashboard-employers-settings-page",
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    ProfileSettingsComponent,
    PasswordSettingsComponent,
    TwoFactorSettingsComponent,
    GenericErrorComponent,
  ],
  templateUrl: "./dashboard-employers-settings-page.component.html",
  styleUrls: [
    "./dashboard-employers-settings-page.component.scss",
    "../../../../../../../../styles/legacy-styles.css",
  ],
})
export class DashboardEmployersSettingsPageComponent implements OnInit {
  currentUser: User | null = null;
  activeTab: string = "profile";

  // Default values for child components
  twoFactorDefaultValues: any = {};
  accountSettingsDefaultValues: any = {};

  // Check if user is a candidate
  get isCandidate(): boolean {
    return this.authService.isCandidate();
  }

  // Loading states
  isUpdatingProfile = false;
  isChangingPassword = false;
  isUpdating2FA = false;
  isUpdatingSettings = false;
  isClosingAccount = false;

  errorMessage = "";
  hasError = false;
  // Settings service
  private settingsService: SettingsService;

  constructor(
    private authService: AuthService,
    private candidatesService: CandidatesService,
    private dialog: MatDialog,
    private router: Router,
    private transloco: TranslocoService,
    private http: HttpClient,
  ) {
    this.settingsService = {
      updatePassword: (data: PasswordChangeDto) =>
        this.http.patch(`${environment.apiUrl}/auth/change-password`, data),
      updateTwoFactor: (data: TwoFactorSettings) =>
        this.http.patch(`${environment.apiUrl}/auth/two-factor`, data),
      updateAccountSettings: (data: AccountSettings) =>
        this.http.patch(`${environment.apiUrl}/auth/account-settings`, data),
      closeAccount: () =>
        this.http.delete(`${environment.apiUrl}/auth/close-account`),
      getTwoFactorSettings: () =>
        this.http.get<TwoFactorSettings>(
          `${environment.apiUrl}/auth/two-factor`,
        ),
      getAccountSettings: () =>
        this.http.get<AccountSettings>(
          `${environment.apiUrl}/auth/account-settings`,
        ),
    };
  }

  ngOnInit() {
    // Set default tab based on user role
    if (this.isCandidate) {
      this.activeTab = "password";
    }

    const candidateId = this.authService.getUser()?.id || null;
    if (candidateId) {
      this.authService.getAccountById(candidateId).subscribe({
        next: (account) => {
          this.currentUser = account;
          this.loadUserSettings();
        },
        error: (error) => {
          console.error("Error loading user:", error);
        },
      });
    }
  }

  private loadUserSettings() {
    // Load 2FA settings
    this.settingsService.getTwoFactorSettings().subscribe({
      next: (settings) => {
        this.twoFactorDefaultValues = settings;
      },
      error: (error) => {
        console.error("Error loading 2FA settings:", error);
      },
    });

    // Load account settings
    this.settingsService.getAccountSettings().subscribe({
      next: (settings) => {
        this.accountSettingsDefaultValues = settings;
      },
      error: (error) => {
        console.error("Error loading account settings:", error);
      },
    });
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  onProfileSubmit(formData: any) {
    this.errorMessage = "";
    this.isUpdatingProfile = true;
    const profileData = {
      ...formData,
      accountId: this.currentUser?.id,
    };
    this.authService.updateProfile(profileData).subscribe({
      next: () => {
        const accountId = this.currentUser?.id;
        if (!accountId) {
          this.isUpdatingProfile = false;
          return;
        }
        this.authService.getAccountById(accountId).subscribe({
          next: (freshAccount) => {
            this.errorMessage = "";

            this.currentUser = freshAccount;
            this.authService.setUser(freshAccount);
            this.isUpdatingProfile = false;

            const dialogRef = this.dialog.open(GenericModalComponent, {
              disableClose: true,
              data: { type: "info", title: "", content: "", actions: [] },
            });

            this.showResultModal(
              dialogRef,
              "settings.messages.profileUpdated",
              "settings.messages.profileUpdated",
              "",
              "success",
            );
          },
          error: (err) => {
            console.error("Error refreshing account after update:", err);
            this.isUpdatingProfile = false;
            this.errorMessage = err.error?.message;
          },
        });
      },
      error: (error) => {
        this.isUpdatingProfile = false;
        console.error("Profile update error:", error);
        this.errorMessage = error.error?.message;

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.profileUpdateError",
          "settings.messages.profileUpdateError",
          "",
          "danger",
        );
      },
    });
  }

  onPasswordSubmit(formData: PasswordChangeDto) {
    if (formData.newPassword !== formData.confirmPassword) {
      const dialogRef = this.dialog.open(GenericModalComponent, {
        disableClose: true,
        data: { type: "info", title: "", content: "", actions: [] },
      });

      this.showResultModal(
        dialogRef,
        "settings.messages.passwordMismatch",
        "settings.messages.passwordMismatch",
        "",
        "danger",
      );
      return;
    }

    this.isChangingPassword = true;

    this.settingsService.updatePassword(formData).subscribe({
      next: () => {
        this.isChangingPassword = false;

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.passwordChanged",
          "settings.messages.passwordChanged",
          "",
          "success",
        );
      },
      error: (error) => {
        console.log("error", error);
        this.isChangingPassword = false;
        console.error("Password change error:", error);

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.passwordChangeError",
          error.message,

          "danger",
        );
      },
    });
  }

  onTwoFactorSubmit(formData: TwoFactorSettings) {
    this.isUpdating2FA = true;

    this.settingsService.updateTwoFactor(formData).subscribe({
      next: () => {
        this.isUpdating2FA = false;

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.twoFactorUpdated",
          "settings.messages.twoFactorUpdated",
          "",
          "success",
        );
      },
      error: (error) => {
        this.isUpdating2FA = false;
        console.error("2FA update error:", error);

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.twoFactorUpdateError",
          "settings.messages.twoFactorUpdateError",
          "",
          "danger",
        );
      },
    });
  }

  onAccountSettingsSubmit(formData: AccountSettings) {
    this.isUpdatingSettings = true;

    this.settingsService.updateAccountSettings(formData).subscribe({
      next: () => {
        this.isUpdatingSettings = false;

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.accountSettingsUpdated",
          "settings.messages.accountSettingsUpdated",
          "",
          "success",
        );
      },
      error: (error) => {
        this.isUpdatingSettings = false;
        console.error("Account settings update error:", error);

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.accountSettingsUpdateError",
          "settings.messages.accountSettingsUpdateError",
          "",
          "danger",
        );
      },
    });
  }

  confirmCloseAccount() {
    const modalData: GenericModalData = {
      title: this.transloco.translate("settings.closeAccount.confirmTitle"),
      content: this.transloco.translate("settings.closeAccount.confirmMessage"),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
        },
        {
          id: "confirm",
          label: this.transloco.translate("settings.closeAccount.confirm"),
          color: "warn",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "500px",
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === "confirm") {
        this.closeAccount();
      }
    });
  }

  private closeAccount() {
    this.isClosingAccount = true;

    this.settingsService.closeAccount().subscribe({
      next: () => {
        this.isClosingAccount = false;

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.accountClosed",
          "settings.messages.accountClosed",
          "",
          "success",
          () => {
            // Logout and redirect
            this.authService.logout();
            this.router.navigateByUrl("/");
          },
        );
      },
      error: (error) => {
        this.isClosingAccount = false;
        console.error("Account close error:", error);

        const dialogRef = this.dialog.open(GenericModalComponent, {
          disableClose: true,
          data: { type: "info", title: "", content: "", actions: [] },
        });

        this.showResultModal(
          dialogRef,
          "settings.messages.accountCloseError",
          "settings.messages.accountCloseError",
          "",
          "danger",
        );
      },
    });
  }

  protected showResultModal(
    dialogRef: MatDialogRef<GenericModalComponent>,
    titleKey: string,
    messageKey: string,
    name: string,
    type: GenericModalType = "info",
    onClose?: () => void,
  ) {
    const instance = dialogRef.componentInstance;

    if (!instance) return;

    instance.data.title = this.transloco.translate(titleKey);
    instance.data.content = this.transloco.translate(messageKey, { name });
    instance.data.type = type;
    instance.data.actions = [
      {
        id: "ok",
        label: this.transloco.translate("general.ok"),
        color: "primary",
      },
    ];

    const sub = instance.action.subscribe((res) => {
      if (res === "ok") {
        dialogRef.close();
        sub.unsubscribe();
        if (onClose) onClose();
      }
    });
  }
}
