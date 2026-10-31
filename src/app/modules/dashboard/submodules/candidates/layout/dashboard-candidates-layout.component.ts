import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { Role, User } from "@modules/auth/auth.types";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-dashboard-candidates-layout",
  templateUrl: "./dashboard-candidates-layout.component.html",
})
export class DashboardCandidatesLayoutComponent implements OnInit {
  menu: any = [];
  namespace = "dashboardcandidates";
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
    console.log("ConnectedUser: ", user);
    if (!user || user.role != Role.CANDIDATE) {
      this.router.navigateByUrl("/");
      return;
    }

    this.route.params.subscribe((params) => {
      console.log("params parant: : ", params);
    });

    this.loadMenu(user);
  }

  loadMenu(user: User) {
    const moduleRootUrl = `/dashboard/candidates/${user.id}`;
    this.menu = [
      {
        id: "dashboard",
        label: "sidebar.dashboard",
        icon: "fa fa-th-large",
        href: `${moduleRootUrl}`,
        active: true,
      },
      {
        id: "profile",
        label: "sidebar.profile",
        icon: "fa fa-user",
        href: `${moduleRootUrl}/profile/account`,
      },
      // {
      //   id: "companies",
      //   label: "sidebar.companies",
      //   icon: "fa fa-building",
      //   href: `${moduleRootUrl}/companies/list`,
      // },
      // {
      //   id: "job_offers",
      //   label: "sidebar.jobsoffers",
      //   icon: "fa fa-plus-circle",
      //   href: `${moduleRootUrl}/job-offers/list`,
      // },
      {
        id: "favorites",
        label: "sidebar.favorites",
        icon: "fa fa-star",
        href: `${moduleRootUrl}/favorites/list`,
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
        id: "resumes",
        label: "sidebar.resumes",
        icon: "fa fa-phone-square",
        href: `${moduleRootUrl}/resumes/list`,
      },

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
