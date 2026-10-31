import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, map } from "rxjs";
import { environment } from "@env/environment";
import { CandidatesService } from "../../../../candidates/candidates.service";
import { ApplicationsService } from "../../../../applications/applications.service";

export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
  profileCompleteness: number;
  totalViews: number;
}

export interface RecentActivity {
  id: string;
  type: "application" | "profile_view" | "interview" | "message";
  title: string;
  description: string;
  date: Date;
  status?: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentApplications: any[];
  recentActivity: RecentActivity[];
  profileData: any;
  upcomingInterviews: any[];
}

@Injectable({
  providedIn: "root",
})
export class DashboardCandidatesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private candidatesService: CandidatesService,
    private applicationsService: ApplicationsService
  ) {}

  getDashboardData(candidateId: string): Observable<DashboardData> {
    // Utiliser le nouvel endpoint dashboard du backend
    return this.http.get<DashboardData>(
      `${this.apiUrl}/candidates/${candidateId}/dashboard`
    );
  }

  // Méthode de fallback si l'endpoint dashboard n'est pas disponible
  getDashboardDataFallback(candidateId: string): Observable<DashboardData> {
    return forkJoin({
      profileData: this.candidatesService.selectById(candidateId),
      applications: this.applicationsService.selectMany({
        candidateId: candidateId,
        limit: 10,
        page: 1,
      }),
      // interviews: this.getUpcomingInterviews(candidateId),
    }).pipe(
      map(({ profileData, applications }) => {
        const stats = this.calculateStats(applications.data || [], profileData);
        const recentActivity = this.generateRecentActivity(
          applications.data || []
        );

        return {
          stats,
          recentApplications: applications.data?.slice(0, 5) || [],
          recentActivity,
          profileData,
          upcomingInterviews: [], // TODO: Implement interviews
        };
      })
    );
  }

  getApplicationStats(candidateId: string): Observable<DashboardStats> {
    return this.applicationsService
      .selectMany({
        candidateId: candidateId,
        limit: 100,
        page: 1,
      })
      .pipe(
        map((response) => {
          const applications = response.data || [];
          return {
            totalApplications: applications.length,
            pendingApplications: applications.filter(
              (app) => app.status === "PENDING"
            ).length,
            acceptedApplications: applications.filter(
              (app) => app.status === "ACCEPTED"
            ).length,
            rejectedApplications: applications.filter(
              (app) => app.status === "REJECTED"
            ).length,
            profileCompleteness: 0, // Will be calculated separately
            totalViews: 0, // TODO: Implement profile views tracking
          };
        })
      );
  }

  getRecentApplications(
    candidateId: string,
    limit: number = 5
  ): Observable<any[]> {
    return this.applicationsService
      .selectMany({
        candidateId: candidateId,
        limit: limit,
        page: 1,
      })
      .pipe(map((response) => response.data || []));
  }

  private calculateStats(
    applications: any[],
    profileData: any
  ): DashboardStats {
    const profileCompleteness = this.calculateProfileCompleteness(profileData);

    return {
      totalApplications: applications.length,
      pendingApplications: applications.filter(
        (app) => app.status === "PENDING"
      ).length,
      acceptedApplications: applications.filter(
        (app) => app.status === "ACCEPTED"
      ).length,
      rejectedApplications: applications.filter(
        (app) => app.status === "REJECTED"
      ).length,
      profileCompleteness,
      totalViews: 0, // TODO: Implement profile views
    };
  }

  private calculateProfileCompleteness(profileData: any): number {
    if (!profileData) return 0;

    let completedFields = 0;
    const totalFields = 10;

    // Basic info
    if (profileData.bio) completedFields++;
    if (profileData.profession) completedFields++;
    if (profileData.nationality) completedFields++;
    if (profileData.placeOfBirth) completedFields++;
    if (profileData.photoFileId) completedFields++;

    // Profile sections
    if (profileData.experiences?.length > 0) completedFields++;
    if (profileData.educations?.length > 0) completedFields++;
    if (profileData.skills?.length > 0) completedFields++;
    if (profileData.languages?.length > 0) completedFields++;
    if (profileData.resumeUrl) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  }

  private generateRecentActivity(applications: any[]): RecentActivity[] {
    const activities: RecentActivity[] = [];

    applications.slice(0, 5).forEach((app) => {
      activities.push({
        id: app.id,
        type: "application",
        title: `Application soumise`,
        description: `Candidature pour ${app.jobOffer?.title || "un poste"}`,
        date: new Date(app.createdAt),
        status: app.status,
      });
    });

    return activities.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // TODO: Implement when interviews module is ready
  private getUpcomingInterviews(candidateId: string): Observable<any[]> {
    // return this.http.get<any[]>(`${this.apiUrl}/interviews?candidateId=${candidateId}&upcoming=true`);
    return new Observable((observer) => {
      observer.next([]);
      observer.complete();
    });
  }
}
