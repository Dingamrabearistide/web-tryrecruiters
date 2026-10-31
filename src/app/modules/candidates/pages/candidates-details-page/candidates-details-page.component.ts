import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import { CandidatesService } from "../../candidates.service";
import { Candidate } from "../../candidates.types";

@Component({
  standalone: false,

  selector: "app-candidates-details-page",
  templateUrl: "./candidates-details-page.component.html",
  styleUrls: ["./candidates-details-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesDetailsPageComponent implements OnInit {
  item!: Candidate;
  isLoading = false;
  hasError = false;
  errorMessage = "";

  constructor(
    private service: CandidatesService,
    private route: ActivatedRoute,
    private router: Router,
    private transloco: TranslocoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params["id"];
      if (id) {
        this.loadItem(id);
      }
    });
  }

  private loadItem(id: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.service.selectById(id).subscribe({
      next: (item) => {
        this.item = item;
        this.isLoading = false;
      },
      error: (error) => {
        this.hasError = true;
        this.errorMessage = "Erreur lors du chargement des données";
        this.isLoading = false;
        console.error("Error loading item:", error);
      },
    });
  }

  getItemLabel(item: Candidate): string {
    return item
      ? `${item.firstName} ${item.lastName}`
      : "Candidat";
  }

  handleBack(): void {
    this.router.navigate(["../list"], { relativeTo: this.route });
  }

  handleDelete(): void {
    // Implémentation de la suppression
    const name = this.getItemLabel(this.item);
    if (
      confirm(
        `Êtes-vous sûr de vouloir supprimer ${name} ? Cette action est irréversible.`
      )
    ) {
      this.service.delete(this.item.id).subscribe({
        next: () => {
          this.router.navigate(["../"], { relativeTo: this.route });
        },
        error: (error) => {
          console.error("Error deleting item:", error);
          alert("Erreur lors de la suppression");
        },
      });
    }
  }

  getGenderLabel(gender?: string): string {
    switch (gender) {
      case "MALE":
        return "Homme";
      case "FEMALE":
        return "Femme";
      case "OTHER":
        return "Autre";
      default:
        return "—";
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  getStatusClasses(): string {
    if (this.item.deleted) {
      return "bg-red-100 text-red-800";
    }
    if (this.item.archived) {
      return "bg-yellow-100 text-yellow-800";
    }
    return "bg-green-100 text-green-800";
  }

  getStatusLabel(): string {
    if (this.item.deleted) {
      return "Supprimé";
    }
    if (this.item.archived) {
      return "Archivé";
    }
    return "Actif";
  }

  handleUpdate(): void {
    this.router.navigate(["../update", this.item.id], {
      relativeTo: this.route,
    });
  }
}
