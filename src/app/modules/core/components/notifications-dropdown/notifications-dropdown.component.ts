import { CommonModule } from "@angular/common";
import { Component, HostListener, Input } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { Subject, filter, takeUntil } from "rxjs";
import { AuthService } from "../../../auth/auth.service";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning" | "error";
  link?: string;
}

@Component({
  selector: "app-notifications-dropdown",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./notifications-dropdown.component.html",
  styleUrl: "./notifications-dropdown.component.scss",
})
export class NotificationsDropdownComponent {
  @Input("notificationMenuOpen") isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  @HostListener("document:click", ["$event"])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest(".dropdown-wrapper");
    if (!clickedInside) {
      this.closeDropdown();
    }
  }

  private destroy$ = new Subject<void>();

  // États des menus
  mobileMenuOpen = false;
  notificationMenuOpen = false;
  languageDropdownOpen: boolean = false;

  // Données
  currentLanguage = "fr";
  searchQuery = "";

  // Notifications mockées
  notifications: NotificationItem[] = [
    {
      id: 1,
      title: "New application received",
      message: "A candidate has applied for the Frontend Developer position",
      time: "5 minutes ago",
      read: false,
      type: "info",
      link: "/applications",
    },
    {
      id: 2,
      title: "Profile updated",
      message: "Your profile has been successfully updated",
      time: "Yesterday",
      read: false,
      type: "success",
      link: "/profile",
    },
    {
      id: 3,
      title: "Message from support",
      message: "Your support ticket has received a response",
      time: "2 days ago",
      read: true,
      type: "warning",
      link: "/support",
    },
  ];

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Fermer les menus lors de la navigation
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.closeAllMenus();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleNotificationMenu(): void {
    this.notificationMenuOpen = !this.notificationMenuOpen;
    if (this.notificationMenuOpen) {
      this.mobileMenuOpen = false;
    }
  }

  closeAllMenus(): void {
    this.mobileMenuOpen = false;
    this.notificationMenuOpen = false;
  }

  // Gestion des notifications
  get unreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  markNotificationAsRead(notification: NotificationItem): void {
    notification.read = true;
    this.closeAllMenus();
    if (notification.link) {
      this.router.navigate([notification.link]);
    }
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach((n) => (n.read = true));
  }

  getNotificationIcon(type: string): string {
    const icons = {
      info: "fas fa-info-circle text-blue-500",
      success: "fas fa-check-circle text-green-500",
      warning: "fas fa-exclamation-triangle text-yellow-500",
      error: "fas fa-times-circle text-red-500",
    };
    return icons[type as keyof typeof icons] || icons.info;
  }

  // // Fermeture des menus au clic extérieur
  // @HostListener("document:click", ["$event"])
  // onDocumentClick(event: Event): void {
  //   const target = event.target as HTMLElement;
  //   const notificationButton = document.getElementById("notificationButton");
  //   const notificationMenu = document.getElementById("notificationMenu");
  //   const mobileMenuButton = document.getElementById("mobileMenuButton");
  //   const mobileMenu = document.getElementById("mobileMenu");

  //   // Fermer le menu des notifications si clic à l'extérieur
  //   if (
  //     notificationButton &&
  //     notificationMenu &&
  //     !notificationButton.contains(target) &&
  //     !notificationMenu.contains(target)
  //   ) {
  //     this.notificationMenuOpen = false;
  //   }

  //   // Fermer le menu mobile si clic à l'extérieur
  //   if (
  //     mobileMenuButton &&
  //     mobileMenu &&
  //     !mobileMenuButton.contains(target) &&
  //     !mobileMenu.contains(target)
  //   ) {
  //     this.mobileMenuOpen = false;
  //   }
  // }

  // // Gestion du clavier
  // @HostListener("document:keydown.escape")
  // onEscapeKey(): void {
  //   this.closeAllMenus();
  // }
}
