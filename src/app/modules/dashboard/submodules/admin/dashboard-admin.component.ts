import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject, takeUntil, forkJoin, catchError, of } from "rxjs";
import { TranslocoService } from "@ngneat/transloco";
import {
  AdminDashboardFacadeService,
  AdminDashboardOverview,
} from "./services/admin-dashboard-facade.service";
import {
  AdminPlatformStats,
  DashboardAdminStatsService,
} from "./services/dashboard-admin-stats.service";
import { AdminPlatformUsersService } from "./services/admin-platform-users.service";
import { AdminPlatformCompaniesService } from "./services/admin-platform-companies.service";
import { AdminPlatformJobOffersService } from "./services/admin-platform-job-offers.service";

export interface DetailedMetric {
  label: string;
  value: number;
  icon: string;
  color: string;
  source: string;
}

export interface AnalysisCard {
  title: string;
  items: { label: string; current: number; total: number; color: string }[];
}

export interface ChartBar {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

export interface ChartFilter {
  key: string;
  label: string;
}

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
  percentage: number;
}

export interface HorizontalBar {
  label: string;
  value: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface InsightCard {
  icon: string;
  color: string;
  bgColor: string;
  title: string;
  description: string;
  status: "good" | "warning" | "info";
}

@Component({
  standalone: false,

  selector: "app-dashboard-admin",
  templateUrl: "./dashboard-admin.component.html",
  styleUrls: ["./dashboard-admin.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class DashboardAdminComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  loading = true;
  error: string | null = null;

  stats: AdminPlatformStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalCompanies: 0,
    totalJobOffers: 0,
    pendingApplications: 0,
    newUsersThisMonth: 0,
    newCompaniesThisMonth: 0,
    newJobOffersThisMonth: 0,
  };

  pendingUsersCount = 0;
  pendingCompaniesCount = 0;
  pendingJobOffersCount = 0;

  // Detailed stats (See More)
  showDetailedStats = false;
  detailedLoading = false;
  detailedMetrics: DetailedMetric[] = [];
  analysisCards: AnalysisCard[] = [];
  chartData: ChartBar[] = [];
  activeChartFilter = "all";
  chartFilters: ChartFilter[] = [
    { key: "all", label: "dashboard.admin.chart.filterAll" },
    { key: "users", label: "dashboard.admin.chart.filterUsers" },
    { key: "companies", label: "dashboard.admin.chart.filterCompanies" },
    { key: "jobOffers", label: "dashboard.admin.chart.filterJobOffers" },
    { key: "monthly", label: "dashboard.admin.chart.filterMonthly" },
  ];

  private allChartMetrics: DetailedMetric[] = [];

  // Multi-chart data
  donutSegments: DonutSegment[] = [];
  donutTotal = 0;
  horizontalBars: HorizontalBar[] = [];
  insights: InsightCard[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private translocoService: TranslocoService,
    private dashboardFacade: AdminDashboardFacadeService,
    private statsService: DashboardAdminStatsService,
    private usersService: AdminPlatformUsersService,
    private companiesService: AdminPlatformCompaniesService,
    private jobOffersService: AdminPlatformJobOffersService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  toggleDetailedStats(): void {
    this.showDetailedStats = !this.showDetailedStats;
    if (this.showDetailedStats && this.detailedMetrics.length === 0) {
      this.loadAllStats();
    }
  }

  private loadAllStats(): void {
    this.detailedLoading = true;
    forkJoin({
      platformStats: this.statsService
        .getAdminStats()
        .pipe(catchError(() => of(null))),
      users: this.usersService
        .getUsers({ page: 1, limit: 1 })
        .pipe(catchError(() => of(null))),
      allCompanies: this.companiesService
        .getAllCompanies({ page: 1, limit: 1 })
        .pipe(catchError(() => of(null))),
      pendingCompanies: this.companiesService
        .getPendingCompanies({ page: 1, limit: 1 })
        .pipe(catchError(() => of(null))),
      allJobOffers: this.jobOffersService
        .getAllJobOffers({ page: 1, limit: 1 })
        .pipe(catchError(() => of(null))),
      pendingJobOffers: this.jobOffersService
        .getPendingJobOffers({ page: 1, limit: 1 })
        .pipe(catchError(() => of(null))),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        this.detailedMetrics = [
          {
            label: "dashboard.admin.detailed.totalUsersFromList",
            value: results.users?.total ?? 0,
            icon: "fa-solid fa-users",
            color: "#1d9bed",
            source: "/admin/platform/users",
          },
          {
            label: "dashboard.admin.detailed.activeUsers",
            value: results.platformStats?.activeUsers ?? 0,
            icon: "fa-solid fa-user-check",
            color: "#10b981",
            source: "/admin/platform/stats",
          },
          {
            label: "dashboard.admin.detailed.allCompanies",
            value: results.allCompanies?.total ?? 0,
            icon: "fa-solid fa-building",
            color: "#f97316",
            source: "/admin/platform/companies",
          },
          {
            label: "dashboard.admin.detailed.pendingCompanies",
            value: results.pendingCompanies?.total ?? 0,
            icon: "fa-solid fa-building-circle-exclamation",
            color: "#ef4444",
            source: "/admin/platform/companies/pending",
          },
          {
            label: "dashboard.admin.detailed.allJobOffers",
            value: results.allJobOffers?.total ?? 0,
            icon: "fa-solid fa-briefcase",
            color: "#8b5cf6",
            source: "/admin/platform/job-offers",
          },
          {
            label: "dashboard.admin.detailed.pendingJobOffers",
            value: results.pendingJobOffers?.total ?? 0,
            icon: "fa-solid fa-file-circle-exclamation",
            color: "#f59e0b",
            source: "/admin/platform/job-offers/pending",
          },
          {
            label: "dashboard.admin.detailed.pendingApplications",
            value: results.platformStats?.pendingApplications ?? 0,
            icon: "fa-solid fa-hourglass-half",
            color: "#ec4899",
            source: "/admin/platform/stats",
          },
          {
            label: "dashboard.admin.detailed.newUsersThisMonth",
            value: results.platformStats?.newUsersThisMonth ?? 0,
            icon: "fa-solid fa-user-plus",
            color: "#06b6d4",
            source: "/admin/platform/stats",
          },
          {
            label: "dashboard.admin.detailed.newCompaniesThisMonth",
            value: results.platformStats?.newCompaniesThisMonth ?? 0,
            icon: "fa-solid fa-building-circle-arrow-right",
            color: "#0ea5e9",
            source: "/admin/platform/stats",
          },
          {
            label: "dashboard.admin.detailed.newJobOffersThisMonth",
            value: results.platformStats?.newJobOffersThisMonth ?? 0,
            icon: "fa-solid fa-file-circle-plus",
            color: "#a855f7",
            source: "/admin/platform/stats",
          },
        ];

        // Build analysis cards with progress data
        const totalUsers =
          results.users?.total || results.platformStats?.totalUsers || 1;
        const activeUsers = results.platformStats?.activeUsers ?? 0;
        const totalCompanies =
          results.allCompanies?.total ||
          results.platformStats?.totalCompanies ||
          1;
        const pendingCompaniesVal = results.pendingCompanies?.total ?? 0;
        const totalJobOffers =
          results.allJobOffers?.total ||
          results.platformStats?.totalJobOffers ||
          1;
        const pendingJobOffersVal = results.pendingJobOffers?.total ?? 0;

        this.analysisCards = [
          {
            title: "dashboard.admin.analysis.usersAnalysis",
            items: [
              {
                label: "dashboard.admin.analysis.activeRate",
                current: activeUsers,
                total: totalUsers,
                color: "#10b981",
              },
              {
                label: "dashboard.admin.analysis.newThisMonth",
                current: results.platformStats?.newUsersThisMonth ?? 0,
                total: totalUsers,
                color: "#06b6d4",
              },
            ],
          },
          {
            title: "dashboard.admin.analysis.companiesAnalysis",
            items: [
              {
                label: "dashboard.admin.analysis.pendingRate",
                current: pendingCompaniesVal,
                total: totalCompanies,
                color: "#f97316",
              },
              {
                label: "dashboard.admin.analysis.newThisMonth",
                current: results.platformStats?.newCompaniesThisMonth ?? 0,
                total: totalCompanies,
                color: "#0ea5e9",
              },
            ],
          },
          {
            title: "dashboard.admin.analysis.jobOffersAnalysis",
            items: [
              {
                label: "dashboard.admin.analysis.pendingRate",
                current: pendingJobOffersVal,
                total: totalJobOffers,
                color: "#8b5cf6",
              },
              {
                label: "dashboard.admin.analysis.newThisMonth",
                current: results.platformStats?.newJobOffersThisMonth ?? 0,
                total: totalJobOffers,
                color: "#a855f7",
              },
            ],
          },
        ];

        this.detailedLoading = false;
        this.allChartMetrics = [...this.detailedMetrics];
        this.buildChartData("all");
        this.buildDonutChart(results);
        this.buildHorizontalBars(results);
        this.buildInsights(results);
      });
  }

  setChartFilter(filterKey: string): void {
    this.activeChartFilter = filterKey;
    this.buildChartData(filterKey);
  }

  private buildChartData(filterKey: string): void {
    let filtered: DetailedMetric[];

    switch (filterKey) {
      case "users":
        filtered = this.allChartMetrics.filter(
          (m) => m.label.includes("Users") || m.label.includes("active"),
        );
        break;
      case "companies":
        filtered = this.allChartMetrics.filter(
          (m) => m.label.includes("Companies") || m.label.includes("ompan"),
        );
        break;
      case "jobOffers":
        filtered = this.allChartMetrics.filter(
          (m) =>
            m.label.includes("JobOffers") ||
            m.label.includes("jobOffer") ||
            m.label.includes("Job"),
        );
        break;
      case "monthly":
        filtered = this.allChartMetrics.filter(
          (m) => m.label.includes("ThisMonth") || m.label.includes("new"),
        );
        break;
      default:
        filtered = [...this.allChartMetrics];
        break;
    }

    const maxValue = Math.max(...filtered.map((m) => m.value), 1);
    this.chartData = filtered.map((m) => ({
      label: m.label,
      value: m.value,
      percentage: Math.max((m.value / maxValue) * 100, 3),
      color: m.color,
    }));
  }

  getPercentage(current: number, total: number): number {
    if (total === 0) return 0;
    return Math.min(Math.round((current / total) * 100), 100);
  }

  getDonutOffset(index: number): number {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.donutSegments[i]?.percentage ?? 0;
    }
    return offset;
  }

  private buildDonutChart(results: any): void {
    const users =
      results.users?.total || results.platformStats?.totalUsers || 0;
    const companies =
      results.allCompanies?.total || results.platformStats?.totalCompanies || 0;
    const jobOffers =
      results.allJobOffers?.total || results.platformStats?.totalJobOffers || 0;
    const applications = results.platformStats?.pendingApplications || 0;

    this.donutTotal = users + companies + jobOffers + applications;
    const total = this.donutTotal || 1;

    this.donutSegments = [
      {
        label: "dashboard.admin.chart.donutUsers",
        value: users,
        color: "#1d9bed",
        percentage: (users / total) * 100,
      },
      {
        label: "dashboard.admin.chart.donutCompanies",
        value: companies,
        color: "#f97316",
        percentage: (companies / total) * 100,
      },
      {
        label: "dashboard.admin.chart.donutJobOffers",
        value: jobOffers,
        color: "#8b5cf6",
        percentage: (jobOffers / total) * 100,
      },
      {
        label: "dashboard.admin.chart.donutApplications",
        value: applications,
        color: "#ec4899",
        percentage: (applications / total) * 100,
      },
    ];
  }

  private buildHorizontalBars(results: any): void {
    const items = [
      {
        label: "dashboard.admin.detailed.totalUsersFromList",
        value: results.users?.total ?? 0,
        color: "#1d9bed",
        icon: "fa-solid fa-users",
      },
      {
        label: "dashboard.admin.detailed.activeUsers",
        value: results.platformStats?.activeUsers ?? 0,
        color: "#10b981",
        icon: "fa-solid fa-user-check",
      },
      {
        label: "dashboard.admin.detailed.allCompanies",
        value: results.allCompanies?.total ?? 0,
        color: "#f97316",
        icon: "fa-solid fa-building",
      },
      {
        label: "dashboard.admin.detailed.allJobOffers",
        value: results.allJobOffers?.total ?? 0,
        color: "#8b5cf6",
        icon: "fa-solid fa-briefcase",
      },
      {
        label: "dashboard.admin.detailed.pendingCompanies",
        value: results.pendingCompanies?.total ?? 0,
        color: "#ef4444",
        icon: "fa-solid fa-building-circle-exclamation",
      },
      {
        label: "dashboard.admin.detailed.pendingJobOffers",
        value: results.pendingJobOffers?.total ?? 0,
        color: "#f59e0b",
        icon: "fa-solid fa-file-circle-exclamation",
      },
    ];

    const maxVal = Math.max(...items.map((i) => i.value), 1);
    this.horizontalBars = items.map((i) => ({
      ...i,
      percentage: Math.max((i.value / maxVal) * 100, 2),
    }));
  }

  private buildInsights(results: any): void {
    const totalUsers =
      results.users?.total || results.platformStats?.totalUsers || 0;
    const activeUsers = results.platformStats?.activeUsers ?? 0;
    const totalCompanies =
      results.allCompanies?.total || results.platformStats?.totalCompanies || 0;
    const pendingCompaniesVal = results.pendingCompanies?.total ?? 0;
    const totalJobOffers =
      results.allJobOffers?.total || results.platformStats?.totalJobOffers || 0;
    const pendingJobOffersVal = results.pendingJobOffers?.total ?? 0;
    const newUsersMonth = results.platformStats?.newUsersThisMonth ?? 0;

    this.insights = [];

    // User activity insight
    const activeRate =
      totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0;
    if (activeRate >= 70) {
      this.insights.push({
        icon: "fa-solid fa-circle-check",
        color: "#10b981",
        bgColor: "#10b98118",
        title: "dashboard.admin.insights.highActivity",
        description: "dashboard.admin.insights.highActivityDesc",
        status: "good",
      });
    } else if (activeRate >= 40) {
      this.insights.push({
        icon: "fa-solid fa-circle-info",
        color: "#f59e0b",
        bgColor: "#f59e0b18",
        title: "dashboard.admin.insights.moderateActivity",
        description: "dashboard.admin.insights.moderateActivityDesc",
        status: "warning",
      });
    } else {
      this.insights.push({
        icon: "fa-solid fa-triangle-exclamation",
        color: "#ef4444",
        bgColor: "#ef444418",
        title: "dashboard.admin.insights.lowActivity",
        description: "dashboard.admin.insights.lowActivityDesc",
        status: "warning",
      });
    }

    // Pending companies insight
    if (pendingCompaniesVal > 0) {
      this.insights.push({
        icon: "fa-solid fa-clock",
        color: "#f97316",
        bgColor: "#f9731618",
        title: "dashboard.admin.insights.pendingCompanies",
        description: "dashboard.admin.insights.pendingCompaniesDesc",
        status: "warning",
      });
    }

    // Pending job offers insight
    if (pendingJobOffersVal > 0) {
      this.insights.push({
        icon: "fa-solid fa-file-pen",
        color: "#8b5cf6",
        bgColor: "#8b5cf618",
        title: "dashboard.admin.insights.pendingJobOffers",
        description: "dashboard.admin.insights.pendingJobOffersDesc",
        status: "warning",
      });
    }

    // Growth insight
    if (newUsersMonth > 0) {
      this.insights.push({
        icon: "fa-solid fa-arrow-trend-up",
        color: "#06b6d4",
        bgColor: "#06b6d418",
        title: "dashboard.admin.insights.growth",
        description: "dashboard.admin.insights.growthDesc",
        status: "good",
      });
    }

    // Platform overview insight
    this.insights.push({
      icon: "fa-solid fa-chart-pie",
      color: "#1d9bed",
      bgColor: "#1d9bed18",
      title: "dashboard.admin.insights.overview",
      description: "dashboard.admin.insights.overviewDesc",
      status: "info",
    });
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    this.dashboardFacade
      .getDashboardOverview()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (overview: AdminDashboardOverview) => {
          this.stats = overview.stats;
          this.pendingUsersCount = overview.pendingUsersCount;
          this.pendingCompaniesCount = overview.pendingCompaniesCount;
          this.pendingJobOffersCount = overview.pendingJobOffersCount;
          this.loading = false;
        },
        error: (err) => {
          this.error = this.translocoService.translate(
            "dashboardadmin.dashboard.admin.summary",
          );
          this.loading = false;
        },
      });
  }

  navigateTo(route: string): void {
    const employerId = this.route.snapshot.paramMap.get("employerId");
    this.router.navigate([`/dashboard/admin/${employerId}${route}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
