import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CandidatesService } from "@modules/candidates/candidates.service";
import { Candidate as ModuleObject } from "@modules/candidates/candidates.types";
import { TranslocoService } from "@ngneat/transloco";
import { goToTop, wait } from "../../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-candidates-list-page",
  templateUrl: "./candidates-list-page.component.html",
  styleUrl: "./candidates-list-page.component.scss",
})
export class CandidatesListPageComponent implements OnInit {
  isLoading = false;
  hasError = false;
  errorMessage = "";

  items: ModuleObject[] = [];

  page = 1;
  totalPages = 1;
  pageSize = 6;
  totalResults = 0;

  // View mode
  listView = false;

  /** Tracks candidate IDs whose photo failed to load */
  photoErrors = new Set<string>();

  onPhotoError(candidateId: string): void {
    this.photoErrors.add(candidateId);
  }

  hasPhotoError(candidateId: string): boolean {
    return this.photoErrors.has(candidateId);
  }

  // Search & filters
  searchTerm = "";
  selectedProfession = "";
  selectedCity = "";
  selectedExperienceLevel = "";
  selectedSort = "match";

  get experienceLevelOptions() {
    return [
      { value: "entry", label: this.transloco.translate("candidates.filters.entry") },
      { value: "mid", label: this.transloco.translate("candidates.filters.mid") },
      { value: "senior", label: this.transloco.translate("candidates.filters.senior") },
    ];
  }

  // Gradient colors for candidate avatars
  avatarGradients = [
    { from: "#149df2", to: "#0b79d0" },
    { from: "#7c3aed", to: "#241449" },
    { from: "#f97316", to: "#ff5148" },
    { from: "#0f172a", to: "#64748b" },
    { from: "#4f46e5", to: "#149df2" },
    { from: "#059669", to: "#0d9488" },
    { from: "#ff5148", to: "#dc2626" },
    { from: "#db2777", to: "#ff5148" },
    { from: "#0891b2", to: "#149df2" },
  ];

  constructor(
    private service: CandidatesService,
    private transloco: TranslocoService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  goBack(): void {
    this.location.back();
  }

  loadItems(page = 1) {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    const queryParams: any = { page, limit: this.pageSize };

    if (this.searchTerm) queryParams.keyword = this.searchTerm;
    if (this.selectedProfession) queryParams.profession = this.selectedProfession;
    if (this.selectedCity) queryParams.city = this.selectedCity;
    if (this.selectedExperienceLevel) queryParams.experienceLevel = this.selectedExperienceLevel;

    this.service.selectMany(queryParams).subscribe({
      next: async (res) => {
        await wait();
        this.items = res.data;
        this.totalResults = res.total;
        this.totalPages = Math.max(1, Math.ceil(res.total / res.limit));

        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Error", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  applyFilters(): void {
    this.page = 1;
    this.loadItems(1);
  }

  resetFilters(): void {
    this.searchTerm = "";
    this.selectedProfession = "";
    this.selectedCity = "";
    this.selectedExperienceLevel = "";
    this.selectedSort = "match";
    this.applyFilters();
  }

  toggleViewMode(): void {
    this.listView = !this.listView;
  }

  onPageChange(newPage: number) {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.page = newPage;
    this.loadItems(newPage);
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["./", item.id], { relativeTo: this.route });
  }

  /** Get candidate full name */
  getCandidateName(candidate: ModuleObject): string {
    return `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Unknown';
  }

  /** Get candidate initials for avatar fallback */
  getInitials(candidate: ModuleObject): string {
    const name = this.getCandidateName(candidate);
    if (!name || name === 'Unknown') return "?";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  /** Get gradient style for avatar */
  getAvatarGradientStyle(index: number): { [key: string]: string } {
    const i = index % this.avatarGradients.length;
    const grad = this.avatarGradients[i];
    return {
      background: `linear-gradient(to bottom right, ${grad.from}, ${grad.to})`,
    };
  }

  /** Get skills list from candidate (max 4) */
  getSkills(candidate: ModuleObject): string[] {
    if (!candidate.skills || !candidate.skills.length) return [];
    return candidate.skills.slice(0, 4).map((s: any) => s.name || s);
  }

  /** Get total experience years from candidate experiences */
  getExperienceYears(candidate: ModuleObject): number {
    if (!candidate.experiences || !candidate.experiences.length) return 0;
    let totalMonths = 0;
    for (const exp of candidate.experiences) {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.endDate ? new Date(exp.endDate) : new Date();
        const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        totalMonths += Math.max(0, months);
      }
    }
    return Math.round(totalMonths / 12);
  }

  /** Generate page numbers array for pagination */
  getPageNumbers(): number[] {
    const pages: number[] = [];
    const totalPages = this.totalPages;
    const currentPage = this.page;

    let start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 4);
    start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  /** Get relative time from a date string */
  getTimeAgo(dateStr: string | undefined): string {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return this.transloco.translate("candidates.time.today");
    if (diffDays === 1) return this.transloco.translate("candidates.time.yesterday");
    if (diffDays < 30) return `${diffDays} ${this.transloco.translate("candidates.time.daysAgo")}`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} ${this.transloco.translate("candidates.time.monthsAgo")}`;
  }
}
