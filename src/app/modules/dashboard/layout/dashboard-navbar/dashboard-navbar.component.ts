import { Component } from "@angular/core";
import { LanguageSwitcherComponent } from "@modules/core/components/language-switcher.component";
import { AvatarDropdownComponent } from "@modules/core/components/avatar-dropdown/avatar-dropdown.component";

@Component({
  selector: "" + "app-dashboard-navbar",
  templateUrl: "./dashboard-navbar.component.html",
  styleUrls: ["./dashboard-navbar.component.scss", "../../../../../styles/legacy-styles.css"],
  imports: [
    LanguageSwitcherComponent,
    AvatarDropdownComponent,
  ],
  standalone: true,
})
export class DashboardNavbarComponent {
  showNotifMenu = false;
  showAvatarMenu = false;

  constructor() {}

  ngOnInit(): void {}

  toggleNotifMenu(): void {
    this.showNotifMenu = !this.showNotifMenu;
    this.showAvatarMenu = false;
  }

  toggleAvatarMenu(): void {
    this.showAvatarMenu = !this.showAvatarMenu;
    this.showNotifMenu = false;
  }

  closeMenus(): void {
    this.showNotifMenu = false;
    this.showAvatarMenu = false;
  }
}
