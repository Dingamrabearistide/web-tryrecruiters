import { Component, Input, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

export interface DashboardSidebarItem {
  id: string;
  label: string;
  icon?: string;
  svg?: any;
  href: string;
  active?: boolean;
}

@Component({
  standalone: false,

  selector: "app-dashboard-sidebar",
  templateUrl: "./dashboard-sidebar.component.html",
  styleUrls: ["./dashboard-sidebar.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class DashboardSidebarComponent implements OnInit {
  @Input() menuItems: DashboardSidebarItem[] = [];
  @Input() namespace: string = "dashboardemployers";
  @Input() moduleRootUrl: string = "/dashboard/employers";
  @Input() disableLogoLink: boolean = false;

  currentUrl: string = "";

  constructor(private router: Router) {}

  initRoutes(): void {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl = (event as NavigationEnd).urlAfterRedirects;
      });

    this.currentUrl = this.router.url;
  }

  isActive(item: DashboardSidebarItem): boolean {
    const isAbsolute = item.href.startsWith("/");
    const targetPath = isAbsolute
      ? item.href
      : `${this.moduleRootUrl}/${item.href}`;

    const urlWithoutQuery = this.currentUrl.split('?')[0];

    if (item.id === "dashboard") {
      return urlWithoutQuery === targetPath;
    }

    return (
      urlWithoutQuery === targetPath ||
      urlWithoutQuery.startsWith(targetPath + "/") ||
      urlWithoutQuery.startsWith(targetPath.replace('/list', '') + "/")
    );
  }

  ngOnInit(): void {
    this.initRoutes();
    this.handleSidbebarMenu();
    this.handleDashboardMenuActive();
  }

  closeSidebar(): void {
    document.getElementById("sidebar-container")?.classList.add("-translate-x-full");
  }

  handleSidbebarMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    menuToggle?.addEventListener("click", () => {
      document.getElementById("sidebar-container")?.classList.toggle("-translate-x-full");
    });
  }

  handleDashboardMenuActive() {
    const svgElement = document.querySelector("#dashboard");

    if (svgElement) {
      const pathElements = svgElement.querySelectorAll("path");
      const rectElements = svgElement.querySelectorAll("rect");
      if (rectElements.length > 0) {
        for (let i = 0; i < rectElements.length; i++) {
          const rect = rectElements[i];
          rect.setAttribute("fill", "#026fb8");
          rect.setAttribute("stroke", "#026fb8");
        }
      }
      if (pathElements.length > 0) {
        for (let i = 0; i < pathElements.length; i++) {
          const path = pathElements[i];
          path.setAttribute("fill", "#026fb8");
        }
      }
    }
  }

  onItemClick(): void {
    document
      .getElementById("sidebar-container")
      ?.classList.add("-translate-x-full");
  }
}
