import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { User } from "@modules/auth/auth.types";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-dashboard-admin-layout",
  templateUrl: "./dashboard-admin-layout.component.html",
})
export class DashboardAdminLayoutComponent implements OnInit {
  menu: any = [];
  namespace = "dashboardadmin";
  sidebarOpen = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private transloco: TranslocoService,
  ) {}

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    // console.log("ConnectedUser: ", user);
    if (
      !user ||
      !(this.authService.isPlatformAdmin() || this.authService.isSuperAdmin())
    ) {
      this.router.navigateByUrl("/");
      return;
    }

    // this.route.params.subscribe((params) => {
    //   console.log("params parant: : ", params);
    // });

    this.loadMenu(user);
  }

  loadMenu(user: User) {
    const moduleRootUrl = `/dashboard/admin/${user.id}`;

    this.menu = [
      {
        id: "dashboard",
        label: "sidebar.dashboard",
        icon: "fa fa-th-large",
        href: `${moduleRootUrl}`,
        active: true,
      },
      {
        id: "companies",
        label: "sidebar.companies",
        icon: "fa fa-building",
        href: `${moduleRootUrl}/companies/list`,
      },
      {
        id: "job_offers",
        label: "sidebar.jobsoffers",
        icon: "fa fa-plus-circle",
        href: `${moduleRootUrl}/job-offers/list`,
      },
      {
        id: "applications",
        label: "sidebar.applications",
        icon: "fa fa-address-card",
        href: `${moduleRootUrl}/applications/list`,
      },
      {
        id: "interviews",
        label: "sidebar.interviews",
        icon: "fa fa-phone-square",
        href: `${moduleRootUrl}/interviews/list`,
      },
      {
        id: "users",
        label: "sidebar.users",
        icon: "fa fa-users",
        href: `${moduleRootUrl}/users/list`,
      },
      // {
      //   id: "permissions",
      //   label: "sidebar.permissions",
      //   icon: "fa-shield-alt fas",
      //   href: `${moduleRootUrl}/permissions/list`,
      // },
      // {
      //   id: "favorites",
      //   label: "sidebar.favorites",
      //   icon: "fa fa-star",
      //   href: "favorites/list",
      // },
      // {
      //   id: "profile",
      //   label: "sidebar.profile",
      //   icon: "fa fa-user",
      //   href: "profile",
      // },

      // {
      //   id: "categories",
      //   label: "sidebar.categories",
      //   icon: "fa fa-tags",
      //   href: "categories/list",
      // },
      // {
      //   id: "profiles",
      //   label: "sidebar.profile",
      //   icon: `fa fa-search`,
      //   href: "users/list",
      // },
      // {
      //   id: "abonnement",
      //   label: "sidebar.payements",
      //   icon: "fa fa-file-invoice",
      //   href: `${moduleRootUrl}/subscriptions/list`,
      // },
      {
        id: "parameters",
        label: "sidebar.parametres",
        icon: "fa fa-cog",
        href: `${moduleRootUrl}/settings`,
      },
    ];
  }
}
