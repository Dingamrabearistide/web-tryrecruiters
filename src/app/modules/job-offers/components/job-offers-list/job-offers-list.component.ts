import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { AuthService } from "@modules/auth/auth.service";
import { JobOffer as ModuleObject } from "@modules/job-offers/job-offers.types";
import { ResumesService } from "@modules/resumes/resumes.service";
import { Resume } from "@modules/resumes/resumes.types";

@Component({
  standalone: false,

  selector: "app-job-offers-list",
  templateUrl: "./job-offers-list.component.html",
  styleUrls: ["./job-offers-list.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class JobOffersListComponent implements OnInit {
  @Input() items: ModuleObject[] = [];
  @Input() displayMode: "list" | "grid" = "list";
  @Input() showAdvancedFilters = false;
  @Input() isLoading: boolean = false;
  @Input() hasError: boolean = false;
  @Input() isRecruiter!: boolean;

  @Output("onView") onView$ = new EventEmitter<ModuleObject>();
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<ModuleObject>();
  @Output("onAddToFavorite") onAddToFavorite$: EventEmitter<ModuleObject> =
    new EventEmitter();

  userResumes: Resume[] = [];

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  constructor(
    private authService: AuthService,
    private resumesService: ResumesService,
  ) {}

  ngOnInit(): void {
    this.loadUserResumes();
  }

  private loadUserResumes(): void {
    if (this.candidateId) {
      this.resumesService.getResumes(this.candidateId).subscribe({
        next: (response) => {
          this.userResumes = response.data || [];
        },
        error: (error) => {
          console.error("Erreur lors du chargement des CVs:", error);
          this.userResumes = [];
        },
      });
    }
  }

  onView(item: ModuleObject) {
    this.onView$.emit(item);
  }

  onAddToFavorite(item: ModuleObject) {
    this.onAddToFavorite$.emit(item);
  }

  getFavorite(item: ModuleObject) {
    return (
      item.favoritedBy?.some((fav) => fav.accountId === this.candidateId) ??
      false
    );
  }
}
