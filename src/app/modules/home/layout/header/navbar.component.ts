// navbar.component.ts
import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { filter, Subject, takeUntil } from "rxjs";
import { AuthService } from "../../../auth/auth.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { CommonModule } from "@angular/common";
import { LanguageSwitcherComponent } from "@modules/core/components/language-switcher.component";
import { AvatarDropdownComponent } from "@modules/core/components/avatar-dropdown/avatar-dropdown.component";
import { FormsModule } from "@angular/forms";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

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
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  standalone: true,
  imports: [
    CommonModule,
    LanguageSwitcherComponent,
    AvatarDropdownComponent,
    RouterModule,
    FormsModule,
    TranslocoModule,
  ],
  styleUrls: ["./navbar.component.scss"],
  animations: [
    trigger("slideInOut", [
      state("in", style({ transform: "translateX(0%)", opacity: 1 })),
      state("out", style({ transform: "translateX(-100%)", opacity: 0 })),
      transition("in <=> out", animate("300ms ease-in-out")),
    ]),
  ],
})
export class NavbarComponent implements OnInit, OnDestroy {
  // États des menus
  mobileMenuOpen = false;
  notificationMenuOpen = false;
  languageDropdownOpen: boolean = false;
  // Données
  currentLanguage = "fr";
  searchQuery = "";
  // Notifications mockées
  notifications: NotificationItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService,
    private transloco: TranslocoService
  ) {}

  get isAuth() {
    return this.authService.isAuthenticated();
  }

  get isRecruiter() {
    return this.authService.isRecruiter();
  }

  get isCandidate() {
    return this.authService.isCandidate();
  }

  // Gestion des notifications
  get unreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

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

    // Initialize translated notifications
    this.notifications = [
      {
        id: 1,
        title: this.transloco.translate("navigation.notifications.newApplication"),
        message: this.transloco.translate(
          "navigation.notifications.newApplicationMessage"
        ),
        time: this.transloco.translate("navigation.notifications.minutesAgo", {
          minutes: 5,
        }),
        read: false,
        type: "info",
        link: "/applications",
      },
      {
        id: 2,
        title: this.transloco.translate("navigation.notifications.profileUpdated"),
        message: this.transloco.translate(
          "navigation.notifications.profileUpdatedMessage"
        ),
        time: this.transloco.translate("navigation.notifications.yesterday"),
        read: false,
        type: "success",
        link: "/profile",
      },
      {
        id: 3,
        title: this.transloco.translate("navigation.notifications.supportMessage"),
        message: this.transloco.translate(
          "navigation.notifications.supportMessageContent"
        ),
        time: this.transloco.translate("navigation.notifications.daysAgo", {
          days: 2,
        }),
        read: true,
        type: "warning",
        link: "/support",
      },
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Gestion des menus
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    if (this.mobileMenuOpen) {
      this.notificationMenuOpen = false;
    }
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

  // Gestion de la recherche
  onSearchSubmit(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/search"], {
        queryParams: { q: this.searchQuery.trim() },
      });
      this.closeAllMenus();
    }
  }

  // Gestion de la langue
  changeLanguage(language: string): void {
    this.currentLanguage = language;
    this.languageDropdownOpen = false;
    // Ici vous pouvez intégrer votre service de traduction
    // this.translateService.use(language);
  }

  // Fermeture des menus au clic extérieur
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const notificationButton = document.getElementById("notificationButton");
    const notificationMenu = document.getElementById("notificationMenu");
    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileMenu = document.getElementById("mobileMenu");

    // Fermer le menu des notifications si clic à l'extérieur
    if (
      notificationButton &&
      notificationMenu &&
      !notificationButton.contains(target) &&
      !notificationMenu.contains(target)
    ) {
      this.notificationMenuOpen = false;
    }

    // Fermer le menu mobile si clic à l'extérieur
    if (
      mobileMenuButton &&
      mobileMenu &&
      !mobileMenuButton.contains(target) &&
      !mobileMenu.contains(target)
    ) {
      this.mobileMenuOpen = false;
    }
  }

  // Gestion du clavier
  @HostListener("document:keydown.escape")
  onEscapeKey(): void {
    this.closeAllMenus();
  }

  // Méthodes utilitaires
  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  navigateAndClose(route: string): void {
    this.router.navigate([route]);
    this.closeAllMenus();
  }
}
