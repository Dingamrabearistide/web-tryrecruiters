import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { ApplicationsService } from "@modules/applications/applications.service";
import { InterviewsService } from "@modules/interview/interviews.service";
import { forkJoin, Subject, takeUntil } from "rxjs";
import { TranslocoService } from "@ngneat/transloco";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { Application } from "@modules/applications/applications.types";

@Component({
  standalone: false,

  selector: "app-dashboard-employers-home",
  templateUrl: "./dashboard-employers-home.component.html",
  styleUrls: ["./dashboard-employers-home.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class DashboardEmployersHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  loading = true;
  error: string | null = null;

  recruiterName = "";
  companyName = "";

  // Stats de l'employeur
  stats: any = {
    totalOffers: 0,
    activeOffers: 0,
    totalApplications: 0,
    upcomingInterviews: 0,
  };

  // Dernières publications (offres récentes)
  recentPublications: Array<any> = [];

  // Interviews proches
  upcomingInterviews: Array<any> = [];

  // Candidatures récentes (par offre)
  recentApplicationsByOffer: Array<any> = [];

  constructor(
    private authService: AuthService,
    private jobOffersService: JobOffersService,
    private applicationsService: ApplicationsService,
    private interviewsService: InterviewsService,
    private router: Router,
    private route: ActivatedRoute,
    private transloco: TranslocoService,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    const user = this.authService.getUser();

    if (!user || !this.authService.isRecruiter()) {
      this.error = this.transloco.translate(
        "dashboard.employers.errors.recruiterInfoNotAvailable",
      );
      this.loading = false;
      return;
    }

    this.recruiterName = `${user.firstName} ${user.lastName}`;
    this.companyName = "Entreprise"; // TODO: Get from company service if needed

    const recruiterId = user.id;

    // Charger toutes les données en parallèle
    forkJoin({
      allOffers: this.jobOffersService.selectMany({
        createdById: recruiterId,
        page: 1,
        limit: 20000,
      }),
      recentOffers: this.jobOffersService.selectMany({
        createdById: recruiterId,
        page: 1,
        limit: 2,
      }),
      interviews: this.interviewsService.selectMany({
        recruiterId,
        page: 1,
        limit: 10,
      }),
      applications: this.applicationsService.selectMany({
        recruiterId,
        page: 1,
        limit: 100,
      }),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          const allOffers = results.allOffers.data;

          // Calculer les statistiques
          this.stats.totalOffers = allOffers.length;
          this.stats.activeOffers = allOffers.filter(
            (offer: any) =>
              offer.isPublished && !this.isExpired(offer.expiresAt),
          ).length;

          // Filtrer les candidatures du recruteur
          const recruiterApplications = results.applications.data.filter(
            (app: any) => app.jobOffer?.recruiterId === recruiterId,
          );

          this.stats.totalApplications = recruiterApplications.length;

          // Dernières publications - retourner les objets complets pour job-offers-item-grid
          this.recentPublications = results.recentOffers.data;

          // Compter les candidatures pour chaque offre
          this.recentPublications.forEach((offer: any) => {
            const count = recruiterApplications.filter(
              (app: any) => app.jobOffer?.id === offer.id,
            ).length;
            offer.candidatesCount = count;
          });

          // Interviews proches (filtrer les futurs)
          const now = new Date();
          this.upcomingInterviews = results.interviews.data
            .filter((interview: any) => new Date(interview.scheduledAt) > now)
            .sort(
              (a: any, b: any) =>
                new Date(a.scheduledAt).getTime() -
                new Date(b.scheduledAt).getTime(),
            )
            .slice(0, 2);

          this.stats.upcomingInterviews = this.upcomingInterviews.length;

          // Candidatures récentes par offre - retourner les objets application complets pour datatable
          this.recentApplicationsByOffer = recruiterApplications.slice(0, 5);

          this.loading = false;
        },
        error: (error) => {
          console.error(
            this.transloco.translate(
              "dashboard.employers.errors.loadingDashboard",
            ),
            error,
          );
          this.error = this.transloco.translate(
            "dashboard.employers.errors.loadingData",
          );
          this.loading = false;
        },
      });
  }

  private isExpired(expiresAt: string): boolean {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  }

  handleViewJobOffer(item: JobOffer): void {
    this.router.navigate(["./job-offers", item.id], {
      relativeTo: this.route,
    });
  }

  handleViewApplication(application: Application): void {
    this.router.navigate(["./applications", application.id], {
      relativeTo: this.route,
    });
  }

  handleViewInterview(interview: any): void {
    this.router.navigate(["./interviews", interview.id], {
      relativeTo: this.route,
    });
  }

  onRefresh(): void {
    this.loadDashboardData();
  }
}
