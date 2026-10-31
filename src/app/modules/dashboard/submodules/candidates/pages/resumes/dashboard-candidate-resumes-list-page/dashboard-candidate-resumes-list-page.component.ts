import { Component, OnInit } from "@angular/core";
import { Resume as ModuleObject } from "@modules/resumes/resumes.types";
import { TranslocoService } from "@ngneat/transloco";
import { ResumesService } from "@modules/resumes/resumes.service";
import { goToTop, wait } from "../../../../../../../@1hand/utils";
import { AuthService } from "@modules/auth/auth.service";
import {environment} from "@env/environment";

@Component({
  standalone: false,

  selector: "app-dashboard-candidate-resumes-list-page",
  templateUrl: "./dashboard-candidate-resumes-list-page.component.html",
  styleUrls: ["./dashboard-candidate-resumes-list-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidateResumesListPageComponent implements OnInit {
  isLoading = false;
  hasError = false;
  errorMessage = "";

  items: ModuleObject[] = [];

  page = 1;
  totalPages = 1;

  searchTerm = "";
  isDefault = "";
  createdAfter = "";
  createdBefore = "";

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  constructor(
    private service: ResumesService,
    private transloco: TranslocoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(page = 1) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    // Construire les paramètres de requête
    const queryParams: any = {
      page,
      limit: 10,
    };

    queryParams.candidateId = this.candidateId;

    if (this.searchTerm) queryParams.search = this.searchTerm;
    if (this.isDefault !== "") queryParams.isDefault = this.isDefault === "true";
    if (this.createdAfter) queryParams.createdAfter = this.createdAfter;
    if (this.createdBefore) queryParams.createdBefore = this.createdBefore;

    this.service.selectMany(queryParams).subscribe({
      next: async (res) => {
        await wait();
        this.items = res.data || [];
        this.totalPages = Math.ceil((res.total || 0) / (res.limit || 10));

        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Erreur", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadItems(newPage);
  }

  onSearch() {
    this.page = 1;
    this.loadItems(1);
  }

  onReset() {
    this.searchTerm = "";
    this.isDefault = "";
    this.createdAfter = "";
    this.createdBefore = "";
    this.page = 1;
    this.loadItems(1);
  }

  handleView(item: ModuleObject) {
    // Ouvrir le CV dans un nouvel onglet
    console.log(item);
    if (item.resumeFile) {
      window.open(this.getFullPhotoUrl(item.resumeFile.url), "_blank");
    }
  }

  protected getFullPhotoUrl(photo?: string): string {
    if (!photo) return "";
    const trimmed = photo.trim();
    const isAbsolute = /^https?:\/\//i.test(trimmed);
    if (isAbsolute) return trimmed;

    let clean = trimmed
        .replace(/^undefined\/?/, "")
        .replace(/\/undefined\/?/g, "/");

    const rawBase = environment.apiUrl;
    const base =
        rawBase && rawBase !== "undefined" ? rawBase.replace(/\/$/, "") : "";

    const path = clean.startsWith("/") ? clean : `/${clean}`;

    return base ? `${base}${path}` : path;
  }

  handleUpdate(item: ModuleObject) {
    // Navigation vers la page d'édition
    console.log("Update resume", item);
  }

  handleDelete(item: ModuleObject) {
    const message = item.isDefault
      ? this.transloco.translate("resumes.delete.messageDefault", {
          name: item.name,
        })
      : this.transloco.translate("resumes.delete.message", {
          name: item.name,
        });

    if (confirm(message)) {
      this.service.delete(item.id!).subscribe({
        next: () => {
          this.loadItems(this.page);
          // Afficher un message de succès
        },
        error: (error) => {
          console.error("Erreur lors de la suppression", error);
          this.errorMessage =
            error?.error?.message || "Erreur lors de la suppression";
        },
      });
    }
  }

  handleDownload(item: ModuleObject) {
    this.service.downloadResume(item.id!).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${item.name}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error("Erreur lors du téléchargement", error);
      },
    });
  }

  handleSetDefault(item: ModuleObject) {
    this.service.setDefaultResume(item.id!).subscribe({
      next: () => {
        this.loadItems(this.page);
        // Afficher un message de succès
      },
      error: (error) => {
        console.error("Erreur lors de la définition par défaut", error);
        this.errorMessage =
          error?.error?.message || "Erreur lors de la définition par défaut";
      },
    });
  }
}
