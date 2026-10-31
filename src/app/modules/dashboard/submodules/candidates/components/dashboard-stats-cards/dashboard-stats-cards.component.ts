import { Component, Input } from "@angular/core";
import { DashboardStats } from "../../services/dashboard-candidates.service";

@Component({
  standalone: false,

  selector: "app-dashboard-stats-cards",
  templateUrl: "./dashboard-stats-cards.component.html",
  styleUrls: ["./dashboard-stats-cards.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class DashboardStatsCardsComponent {
  @Input() stats: DashboardStats | null = null;
  @Input() loading: boolean = false;

  get statsCards() {
    if (!this.stats) return [];

    return [
      {
        title: "Total Candidatures",
        value: this.stats.totalApplications,
        icon: "briefcase",
        color: "primary",
        description: "Candidatures soumises",
      },
      {
        title: "En Attente",
        value: this.stats.pendingApplications,
        icon: "clock",
        color: "warning",
        description: "Réponses en attente",
      },
      {
        title: "Acceptées",
        value: this.stats.acceptedApplications,
        icon: "check-circle",
        color: "success",
        description: "Candidatures acceptées",
      },
      {
        title: "Profil Complété",
        value: this.stats.profileCompleteness,
        icon: "user",
        color: "info",
        description: "Pourcentage de completion",
        suffix: "%",
      },
    ];
  }
}
