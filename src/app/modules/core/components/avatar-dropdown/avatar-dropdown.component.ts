import { CommonModule } from "@angular/common";
import { Component, HostListener, TemplateRef, ViewChild } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { AuthService } from "../../../auth/auth.service";
import { Role, User } from "@modules/auth/auth.types";
import { MatDialog } from "@angular/material/dialog";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { FormsModule } from "@angular/forms";

@Component({
  selector: "app-avatar-dropdown",
  standalone: true,
  imports: [CommonModule, RouterModule, TranslocoModule, FormsModule],
  templateUrl: "./avatar-dropdown.component.html",
  styleUrl: "./avatar-dropdown.component.scss",
})
export class AvatarDropdownComponent {
  @ViewChild("preferencesModal")
  preferencesModal!: TemplateRef<any>;

  isOpen = false;
  userId!: string;
  userType!: Role | string;
  // Variables for preferences modal
  selectedMenuItem: string = "notifications";
  menuItems = [
    {
      id: "notifications",
      label: "preferences.menu.notifications",
      icon: "fas fa-bell",
    },
    {
      id: "navigation",
      label: "preferences.menu.navigation",
      icon: "fas fa-compass",
    },
    { id: "home", label: "preferences.menu.home", icon: "fas fa-home" },
    {
      id: "appearance",
      label: "preferences.menu.appearance",
      icon: "fas fa-palette",
    },
    {
      id: "messages",
      label: "preferences.menu.messages",
      icon: "fas fa-comment",
    },
    {
      id: "language",
      label: "preferences.menu.language",
      icon: "fas fa-globe",
    },
    {
      id: "accessibility",
      label: "preferences.menu.accessibility",
      icon: "fas fa-universal-access",
    },

    {
      id: "connectedAccounts",
      label: "preferences.menu.connectedAccounts",
      icon: "fas fa-link",
    },
    {
      id: "privacy",
      label: "preferences.menu.privacy",
      icon: "fas fa-shield-alt",
    },
    { id: "advanced", label: "preferences.menu.advanced", icon: "fas fa-cogs" },
  ];
  notificationSettings = {
    notifyAbout: "all",
    useDifferentMobile: false,
    huddleNotifications: true,
    threadReplies: true,
    keywords: "",
  };
  private connectedUser!: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    private transloco: TranslocoService,
    private dialog: MatDialog,
  ) {}

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  get usernameInitial() {
    const user = this.authService.getUser();
    const firstName = user?.firstName;
    const lastName = user?.lastName;
    if (!firstName || !lastName) return "";
    return `${firstName[0]}${lastName[0]}`;
  }

  get fullName() {
    const firstName = this.authService.getUser()?.firstName?.split(" ")[0];
    const lastName = this.authService.getUser()?.lastName?.split(" ")[0];
    return `${firstName} ${lastName}`;
  }

  get userRole() {
    const role = this.authService.getRole();
    return this.transloco.translate(`general.roles.${role}`);
  }

  get isAdmin() {
    const role = this.authService.getRole();
    return role === Role.PLATFORM_ADMIN || role === Role.SUPER_ADMIN;
  }

  get isRecruiter() {
    const role = this.authService.getRole();
    return role === Role.RECRUITER;
  }

  get dashboardLabel() {
    // const role = this.authService.getRole();

    // if (role === Role.PLATFORM_ADMIN || role === Role.SUPER_ADMIN) {
    //   return this.transloco.translate("general.avatarDropdown.dashboard");
    // } else if (role === Role.CANDIDATE) {
    //   return this.transloco.translate("general.avatarDropdown.candidateSpace");
    // } else if (role === Role.RECRUITER) {
    //   return this.transloco.translate("general.avatarDropdown.recruiterSpace");
    // }
    return this.transloco.translate("general.avatarDropdown.dashboard");
  }

  ngOnInit() {
    this.connectedUser = this.authService.getUser() as User;
    console.log("-----------<<s", this.connectedUser);

    if (this.connectedUser.role === Role.CANDIDATE) {
      this.userId = this.connectedUser.id;
      this.userType = "candidates";
    } else if (this.connectedUser.role == Role.RECRUITER) {
      this.userId = this.connectedUser.id;
      this.userType = "employers";
    } else if (
      this.connectedUser.role == Role.PLATFORM_ADMIN ||
      this.connectedUser.role == Role.SUPER_ADMIN
    ) {
      this.userId = this.connectedUser.id;
      this.userType = "admin";
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/");
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest(".dropdown-wrapper");
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  account() {
    this.closeDropdown();
    this.router.navigate([
      "/dashboard",
      this.userType,
      this.userId,
      "profile",
      "account",
    ]);
  }

  goHome() {
    this.closeDropdown();
    this.router.navigate(["/"]);
  }

  goDashboard() {
    this.closeDropdown();
    // Pour les admins, rediriger vers le panel admin
    if (this.isAdmin) {
      this.router.navigate(["/dashboard", "admin", this.userId]);
    } else {
      this.router.navigate(["/dashboard", this.userType, this.userId]);
    }
  }

  goAdminPanel() {
    this.closeDropdown();
    this.router.navigate(["/dashboard", "admin", this.userId]);
  }

  openPreferencesModal() {
    const modalData: GenericModalData = {
      title: this.transloco.translate("preferences.title"),
      template: this.preferencesModal,

      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
        },
        {
          id: "confirm",
          label: this.transloco.translate("general.save"),
          color: "primary",
        },
      ],
    };
    return this.dialog.open(GenericModalComponent, {
      width: "900px",
      maxWidth: "1100px",
      maxHeight: "90vh",
      data: modalData,
      disableClose: true,
    });
  }

  // Méthode pour les préférences
  selectMenuItem(itemId: string): void {
    this.selectedMenuItem = itemId;
  }

  savePreferences(): void {
    console.log("Saving preferences...", {
      selectedSection: this.selectedMenuItem,
      notifications: this.notificationSettings,
    });
  }

  // Méthode appelée depuis le dropdown pour ouvrir les settings
  settings() {
    this.closeDropdown();
    this.openPreferencesModal();
  }

  closeModal() {
    this.dialog.closeAll();
  }
}
