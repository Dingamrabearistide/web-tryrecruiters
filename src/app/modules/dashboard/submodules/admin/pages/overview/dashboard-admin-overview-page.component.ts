import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatCardModule } from "@angular/material/card";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDividerModule } from "@angular/material/divider";
import { TranslocoModule } from "@ngneat/transloco";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { AdminDashboardFacadeService } from "../../services/admin-dashboard-facade.service";
import { AdminDashboardOverview, AdminPlatformStats } from "../../services";

interface KpiCard {
  label: string;
  value: number;
  icon: string;
  color: string;
  description?: string;
}

@Component({
  selector: "app-dashboard-admin-overview-page",
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    TranslocoModule,
  ],
  templateUrl: "./dashboard-admin-overview-page.component.html",
  styleUrls: ["./dashboard-admin-overview-page.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminOverviewPageComponent implements OnInit, OnDestroy {
  isLoading = false;
  kpiCards: KpiCard[] = [];
  dashboardData: AdminDashboardOverview | null = null;
  private destroy$ = new Subject<void>();

  constructor(private facade: AdminDashboardFacadeService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Charge les données du dashboard
   */
  loadDashboardData(): void {
    this.isLoading = true;
    this.facade
      .getDashboardOverview()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.dashboardData = data;
          this.buildKpiCards(data);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  /**
   * Construit les cartes KPI à partir des données
   */
  private buildKpiCards(data: AdminDashboardOverview): void {
    const stats = data.stats;

    this.kpiCards = [
      {
        label: "TOTAL_USERS",
        value: stats.totalUsers,
        icon: "people",
        color: "#1976d2",
        description: "dashboard.admin.overview.totalUsers",
      },
      {
        label: "ACTIVE_USERS",
        value: stats.activeUsers,
        icon: "person_check",
        color: "#388e3c",
        description: "dashboard.admin.overview.activeUsers",
      },
      {
        label: "TOTAL_COMPANIES",
        value: stats.totalCompanies,
        icon: "business",
        color: "#f57c00",
        description: "dashboard.admin.overview.totalCompanies",
      },
      {
        label: "TOTAL_JOB_OFFERS",
        value: stats.totalJobOffers,
        icon: "work",
        color: "#7b1fa2",
        description: "dashboard.admin.overview.totalJobOffers",
      },
      {
        label: "PENDING_APPLICATIONS",
        value: stats.pendingApplications,
        icon: "pending_actions",
        color: "#d32f2f",
        description: "dashboard.admin.overview.pendingApplications",
      },
      {
        label: "NEW_USERS_THIS_MONTH",
        value: stats.newUsersThisMonth,
        icon: "person_add",
        color: "#0288d1",
        description: "dashboard.admin.overview.newUsersThisMonth",
      },
      {
        label: "NEW_COMPANIES_THIS_MONTH",
        value: stats.newCompaniesThisMonth,
        icon: "business_center",
        color: "#ff6f00",
        description: "dashboard.admin.overview.newCompaniesThisMonth",
      },
      {
        label: "NEW_JOB_OFFERS_THIS_MONTH",
        value: stats.newJobOffersThisMonth,
        icon: "post_add",
        color: "#ab47bc",
        description: "dashboard.admin.overview.newJobOffersThisMonth",
      },
    ];
  }

  /**
   * Rafraîchit les données
   */
  refresh(): void {
    this.loadDashboardData();
  }
}
