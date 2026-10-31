import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { User } from "@modules/auth/auth.types";
import { TranslocoService } from "@ngneat/transloco";
import { BillingPaymentAwarePageBase } from "../../../../../@1hand/modules/billings/pages/billing-payment-aware-page.base";

@Component({
  standalone: false,

  selector: "app-employers-dashboard",
  templateUrl: "./employers-dashboard.component.html",
})
export class EmployersDashboardComponent extends BillingPaymentAwarePageBase implements OnInit {
  menu: any = [];
  namespace = "dashboardemployers";
  sidebarOpen = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private transloco: TranslocoService,
  ) {
    super();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    console.log("ConnectedUser: ", user);
    if (!user || !this.authService.isRecruiter()) {
      this.router.navigateByUrl("/");
      return;
    }

    this.route.params.subscribe((params) => {
      console.log("params parant: : ", params);
    });

    this.loadMenu(user);
  }

  loadMenu(user: User) {
    const moduleRootUrl = `/dashboard/employers/${user.id}`;

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
        icon: "fa fa-address-card",
        href: `${moduleRootUrl}/interviews/list`,
      },
      {
        id: "profiles",
        label: "sidebar.profile",
        icon: "fa fa-search",
        href: `${moduleRootUrl}/users/list`,
      },
      {
        id: "mon-abonnement",
        label: "sidebar.mySubscription",
        icon: "fa fa-credit-card",
        href: `${moduleRootUrl}/billings/current`,
      },
      {
        id: "abonnement",
        label: "sidebar.subscriptionPlans",
        icon: "fa fa-file-invoice",
        href: `${moduleRootUrl}/billings/plans`,
      },
      {
        id: "parameters",
        label: "sidebar.parametres",
        icon: "fa fa-cog",
        href: `${moduleRootUrl}/settings`,
      },
    ];
  }
}
