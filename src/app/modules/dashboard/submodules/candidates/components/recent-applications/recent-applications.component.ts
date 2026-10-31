import { Component, Input } from "@angular/core";

@Component({
  standalone: false,

  selector: "app-recent-applications",
  templateUrl: "./recent-applications.component.html",
  styleUrls: ["./recent-applications.component.scss", "../../../../../../../styles/legacy-styles.css"],
})
export class RecentApplicationsComponent {
  @Input() applications: any[] = [];
  @Input() loading: boolean = false;

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "badge-warning";
      case "ACCEPTED":
        return "badge-success";
      case "REJECTED":
        return "badge-danger";
      case "INTERVIEW":
        return "badge-info";
      default:
        return "badge-secondary";
    }
  }

  getStatusText(status: string): string {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "En attente";
      case "ACCEPTED":
        return "Acceptée";
      case "REJECTED":
        return "Rejetée";
      case "INTERVIEW":
        return "Entretien";
      default:
        return status || "Inconnu";
    }
  }

  formatDate(date: string | Date): string {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  trackByApplicationId(index: number, application: any): string {
    return application.id;
  }
}
