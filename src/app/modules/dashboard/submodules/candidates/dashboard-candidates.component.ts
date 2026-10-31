import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationsService } from "@modules/applications/applications.service";
import { AuthService } from "@modules/auth/auth.service";
import { InterviewsService } from "@modules/interview/interviews.service";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import {
  JobOffer,
  JobOffer as ModuleObject,
} from "@modules/job-offers/job-offers.types";
import { forkJoin, Subject, takeUntil } from "rxjs";
import {
  DashboardCandidatesService,
  DashboardData,
} from "./services/dashboard-candidates.service";
import { Application } from "@modules/applications/applications.types";
import { TranslocoService } from "@ngneat/transloco";
import { MatDialog } from "@angular/material/dialog";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";

@Component({
  standalone: false,

  selector: "app-dashboard-candidates",
  templateUrl: "./dashboard-candidates.component.html",
  styleUrls: ["./dashboard-candidates.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  dashboardData: DashboardData | null = null;
  loading = true;
  error: string | null = null;

  candidateName = "";

  // Stats du candidat
  stats: any = {
    totalApplications: 0,
    pendingApplications: 0,
    acceptedApplications: 0,
    upcomingInterviews: 0,
  };

  // Candidatures récentes du candidat
  recentApplications: Array<any> = [];

  // Interviews à venir
  upcomingInterviews: Array<any> = [];

  // Offres recommandées
  featuredOffers: Array<any> = [];

  constructor(
    private dashboardService: DashboardCandidatesService,
    private authService: AuthService,
    private applicationsService: ApplicationsService,
    private interviewsService: InterviewsService,
    private jobOffersService: JobOffersService,
    private router: Router,
    private route: ActivatedRoute,
    private transloco: TranslocoService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    const user = this.authService.getUser();

    if (!user || !this.authService.isCandidate()) {
      this.error = this.transloco.translate(
        "dashboard.candidates.errors.candidateInfoNotAvailable",
      );
      this.loading = false;
      return;
    }

    this.candidateName = `${user.firstName} ${user.lastName}`;
    const candidateId = user.id;

    // Charger toutes les données en parallèle
    forkJoin({
      applications: this.applicationsService.selectMany({
        candidateId,
        page: 1,
        limit: 100,
      }),
      interviews: this.interviewsService.selectMany({
        candidateId,
        page: 1,
        limit: 10,
      }),
      featuredOffers: this.jobOffersService.selectMany({
        page: 1,
        limit: 2,
        isPublished: true,
        candidateId,
      }),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (results) => {
          const applications = results.applications.data;

          // Calculer les statistiques
          this.stats.totalApplications = applications.length;
          this.stats.pendingApplications = applications.filter(
            (app: any) =>
              app.status === "PENDING" || app.status === "IN_REVIEW",
          ).length;
          this.stats.acceptedApplications = applications.filter(
            (app: any) => app.status === "ACCEPTED",
          ).length;

          // Candidatures récentes (5 dernières)
          this.recentApplications = applications;
          // .slice(0, 5)
          // .map((app: any) => ({
          //   id: app.id,
          //   jobTitle: app.jobOffer?.title || "Poste non spécifié",
          //   company: app.jobOffer?.company?.name || "Entreprise",
          //   appliedAt: app.createdAt,
          //   status: this.getApplicationStatusFr(app.status),
          //   jobOfferId: app.jobOffer?.id,
          // }));

          // Interviews à venir (filtrer futurs)
          const now = new Date();
          this.upcomingInterviews = results.interviews.data
            .filter((interview: any) => new Date(interview.scheduledAt) > now)
            .sort(
              (a: any, b: any) =>
                new Date(a.scheduledAt).getTime() -
                new Date(b.scheduledAt).getTime(),
            )
            .slice(0, 2)
            .map((interview: any) => ({
              id: interview.id,
              jobTitle:
                interview.application?.jobOffer?.title || "Non spécifié",
              date: this.formatInterviewDate(interview.scheduledAt),
              time: this.formatInterviewTime(interview.scheduledAt),
              company:
                interview.application?.jobOffer?.company?.name || "Entreprise",
              status: this.getInterviewStatusFr(interview.status),
            }));

          this.stats.upcomingInterviews = this.upcomingInterviews.length;

          // Offres recommandées
          this.featuredOffers = results.featuredOffers.data;

          this.loading = false;
        },
        error: (error) => {
          console.error(
            this.transloco.translate(
              "dashboard.candidates.errors.loadingDashboard",
            ),
            error,
          );
          this.error = this.transloco.translate(
            "dashboard.candidates.errors.loadingData",
          );
          this.loading = false;
        },
      });
  }

  private getApplicationStatusFr(status: string): any {
    const statuses: any = {
      PENDING: {
        label: this.transloco.translate(
          "dashboard.candidates.applicationStatus.pending",
        ),
        class: "bg-yellow-200 text-yellow-700",
      },
      IN_REVIEW: {
        label: this.transloco.translate(
          "dashboard.candidates.applicationStatus.inReview",
        ),
        class: "bg-blue-200 text-blue-700",
      },
      ACCEPTED: {
        label: this.transloco.translate(
          "dashboard.candidates.applicationStatus.accepted",
        ),
        class: "bg-green-200 text-green-700",
      },
      REJECTED: {
        label: this.transloco.translate(
          "dashboard.candidates.applicationStatus.rejected",
        ),
        class: "bg-red-200 text-red-700",
      },
    };
    return (
      statuses[status] || { label: status, class: "bg-gray-200 text-gray-700" }
    );
  }

  private getInterviewStatusFr(status: string): string {
    const statuses: any = {
      SCHEDULED: this.transloco.translate(
        "dashboard.candidates.interviewStatus.scheduled",
      ),
      RESCHEDULED: this.transloco.translate(
        "dashboard.candidates.interviewStatus.rescheduled",
      ),
      COMPLETED: this.transloco.translate(
        "dashboard.candidates.interviewStatus.completed",
      ),
      CANCELED: this.transloco.translate(
        "dashboard.candidates.interviewStatus.canceled",
      ),
    };
    return statuses[status] || status;
  }

  private getJobTypeFr(jobType: string): string {
    const types: any = {
      ONSITE: this.transloco.translate("dashboard.candidates.jobType.onsite"),
      REMOTE: this.transloco.translate("dashboard.candidates.jobType.remote"),
      HYBRID: this.transloco.translate("dashboard.candidates.jobType.hybrid"),
      FULL_TIME: this.transloco.translate(
        "dashboard.candidates.jobType.fullTime",
      ),
      PART_TIME: this.transloco.translate(
        "dashboard.candidates.jobType.partTime",
      ),
    };
    return types[jobType] || jobType;
  }

  private formatInterviewDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  private formatInterviewTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  onRefresh(): void {
    this.loadDashboardData();
  }

  trackByActivityId(index: number, activity: any): string {
    return activity.id;
  }

  voirOffre(id: number): void {
    console.log("Voir offre:", id);
  }

  modifierOffre(id: number): void {
    console.log("Modifier offre:", id);
  }

  supprimerOffre(id: number): void {
    console.log("Supprimer offre:", id);
  }

  getStatutClass(statut: string): string {
    switch (statut) {
      case "Publié":
      case "PUBLISHED":
        return "bg-green-200 text-green-700";
      case "En attente":
      case "PENDING":
        return "bg-yellow-200 text-yellow-700";
      case "Expiré":
      case "EXPIRED":
        return "bg-red-200 text-red-700";
      default:
        return "bg-gray-200 text-gray-700";
    }
  }

  getNotificationClass(type: string): string {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  }

  getPrioriteClass(priorite: string): string {
    switch (priorite) {
      case "haute":
        return "bg-red-100 text-red-700";
      case "moyenne":
        return "bg-yellow-100 text-yellow-700";
      case "basse":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  formatActivityDate(date: Date): string {
    if (!date) return "";
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor(
      (now.getTime() - activityDate.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return this.transloco.translate(
        "dashboard.candidates.time.fewMinutesAgo",
      );
    } else if (diffInHours < 24) {
      return this.transloco.translate("dashboard.candidates.time.hoursAgo", {
        hours: diffInHours,
      });
    } else if (diffInHours < 48) {
      return this.transloco.translate("dashboard.candidates.time.yesterday");
    } else {
      return activityDate.toLocaleDateString(this.transloco.getActiveLang(), {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  addToFavorites(item: ModuleObject): void {
    if (!item?.id) return;

    const candidateId = this.authService.getUser()?.id;
    if (!candidateId) return;

    const isCurrentlyFavorite = item.favoritedBy?.some(
      (fav: any) => fav.accountId === this.authService.getAccountId()
    ) ?? false;

    const titleKey = isCurrentlyFavorite
      ? "joboffers.jobDetails.removeFromFavorites"
      : "joboffers.jobDetails.addToFavorites";
    const contentKey = isCurrentlyFavorite
      ? "joboffers.jobDetails.removeFromFavoritesConfirm"
      : "joboffers.jobDetails.addToFavoritesConfirm";

    const modalData: GenericModalData = {
      title: this.transloco.translate(titleKey),
      content: this.transloco.translate(contentKey, { title: item.title }),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("joboffers.jobDetails.cancel"),
          value: false,
          color: undefined,
        },
        {
          id: "confirm",
          label: this.transloco.translate("joboffers.jobDetails.confirm"),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    const sub = dialogRef.componentInstance.action.subscribe((result) => {
      if (result === "confirm") {
        this.jobOffersService.addToFavorites(item.id, candidateId, !isCurrentlyFavorite).subscribe({
          next: () => {
            dialogRef.close();
            sub.unsubscribe();
            this.loadDashboardData();
          },
          error: (error) => {
            console.error("Error toggling favorite:", error);
          },
        });
      } else {
        dialogRef.close();
        sub.unsubscribe();
      }
    });
  }

  handleViewApplication(application: Application) {
    this.router.navigate(["./applications", application.id], {
      relativeTo: this.route,
    });
  }

  handleViewJobOffer(item: JobOffer) {
    this.router.navigate(["./job-offers", item.id], {
      relativeTo: this.route,
    });
  }
}
