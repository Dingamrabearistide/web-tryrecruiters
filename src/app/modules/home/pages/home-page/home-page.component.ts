import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { CandidatesService } from "@modules/candidates/candidates.service";
import { CompaniesService } from "@modules/compagnies/companies.service";
import { Company } from "@modules/compagnies/companies.types";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { goToTop, wait } from "../../../../@1hand/utils";
import { Candidate } from "../../../candidates/candidates.types";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

interface suggestion {
  name: string;
  icon: string;
  route: string;
}

interface Testimonial {
  stars: any;
  id: string;
  name: string;
  role: string;
  quote: string;
  avatar: string;
  borderColor: string;
}

interface Card {
  type: string;
  title: string;
  description: string;
  route: string;
}

@Component({
  standalone: false,

  selector: "app-home-page",
  templateUrl: "./home-page.component.html",
  styleUrl: "./home-page.component.scss",
})
export class HomePageComponent implements OnInit, OnDestroy {
  isLoadingSearch = false;
  isBookmarked!: boolean;
  showFavModal!: boolean;
  confirmationModalText!: string;
  candidate!: Candidate;
  isRecruiter: boolean = true;

  // Gradient colors for company cards
  companyGradients = [
    { from: '#07152f', to: '#149df2' },
    { from: '#ff5148', to: '#ffb199' },
    { from: '#241449', to: '#8b5cf6' },
    { from: '#0f172a', to: '#64748b' },
  ];

  private destroy$ = new Subject<void>();

  public open: Boolean = false;
  activeCategory: string = "";
  jobQuery: string = "";
  locationQuery: string = "";
  suggestions: string[] = [
    // will be filled with translated values in ngOnInit
  ];

  cards: Card[] = [];

  testimonials: Testimonial[] = [];

  currentSlide: number = 0;
  testimonialsPerPage: number = 3; // Matches md:grid-cols-3
  id!: string;

  get visibleTestimonials(): Testimonial[] {
    const start = this.currentSlide * this.testimonialsPerPage;
    return this.testimonials.slice(start, start + this.testimonialsPerPage);
  }

  get dots(): number[] {
    return Array(Math.ceil(this.testimonials.length / this.testimonialsPerPage))
      .fill(0)
      .map((_, i) => i);
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    }
  }

  nextSlide(): void {
    if (
      this.currentSlide <
      this.testimonials.length - this.testimonialsPerPage
    ) {
      this.currentSlide++;
    }
  }

  goToSlide(slideIndex: number): void {
    this.currentSlide = slideIndex;
  }

  tryRecruiter: {
    name: string;
    icon: string;
    description: string;
    image: string;
    route: string;
  }[] = [];

  popularCategories: {
    name: string;
    icon: string;
    route: string;
    openPositions: number;
  }[] = [];

  isLoading = false;
  hasError = false;
  errorMessage = "";

  jobOffers: JobOffer[] = [];
  companies: Company[] = [];

  // Search form properties
  searchForm: FormGroup;

  constructor(
    private jobOfferService: JobOffersService,
    private companiesService: CompaniesService,
    private transloco: TranslocoService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private candidatesService: CandidatesService,
    private authService: AuthService,
  ) {
    this.searchForm = this.fb.group({
      keyword: [""],
      location: [""],
    });
  }

  ngOnInit(): void {
    const user = this.authService.getUser();
    const userRole = this.authService.getRole();
    if (userRole === "RECRUITER" && user) {
      this.id = user.id;
      this.isRecruiter = true;
      console.log("recruiter", user.id);
    } else if (userRole === "CANDIDATE" && user) {
      this.id = user.id;
      this.isRecruiter = false;
      console.log("candidate", user.id);
    }

    // Ne charger les données candidat que si l'utilisateur est un candidat
    if (this.id && userRole === "CANDIDATE") {
      this.loadCandidate(this.id);
    }

    goToTop();
    this.loadJobOffers();

    // These keys live under "home" in the root i18n file (public/i18n/*.json),
    // fetched over HTTP at bootstrap. translate() is synchronous, so calling
    // it before that fetch resolves returns the raw key as a fallback — wait
    // for the active language to actually be loaded (and reload on language
    // switches) before reading from it.
    this.transloco.selectTranslate("home.steps.createAccount")
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.loadTranslatedContent());
  }

  /**
   * Fill arrays that previously contained hard-coded text with translated values.
   * Uses `TranslocoService.translate` so translations come from `public/i18n/*.json`.
   */
  private loadTranslatedContent(): void {
    // Initialize translated testimonials
    this.testimonials = [
      {
        id: "1",
        stars: 5,
        name: this.transloco.translate("home.testimonialData.robertFox.name"),
        role: this.transloco.translate("home.testimonialData.robertFox.role"),
        quote: this.transloco.translate("home.testimonialData.robertFox.quote"),
        avatar: "/images/detail/avatar2.jpg",
        borderColor: "yellow",
      },
      {
        id: "2",
        stars: 5,
        name: this.transloco.translate(
          "home.testimonialData.bessieCooper.name",
        ),
        role: this.transloco.translate(
          "home.testimonialData.bessieCooper.role",
        ),
        quote: this.transloco.translate(
          "home.testimonialData.bessieCooper.quote",
        ),
        avatar: "/images/detail/avatar1.jpg",
        borderColor: "purple",
      },
      {
        id: "3",
        stars: 3,
        name: this.transloco.translate(
          "home.testimonialData.bessieCooper.name",
        ),
        role: this.transloco.translate(
          "home.testimonialData.bessieCooper.role",
        ),
        quote: this.transloco.translate(
          "home.testimonialData.bessieCooper.quote",
        ),
        avatar: "/images/detail/avatar4.jpg",
        borderColor: "purple",
      },
      {
        id: "4",
        stars: 5,
        name: this.transloco.translate("home.testimonialData.johnDoe.name"),
        role: this.transloco.translate("home.testimonialData.johnDoe.role"),
        quote: this.transloco.translate("home.testimonialData.johnDoe.quote"),
        avatar: "/images/detail/avatar3.jpg",
        borderColor: "yellow",
      },
    ];
    //on init
    this.suggestions = [
      this.transloco.translate("home.categories.list.design"),
      this.transloco.translate("home.categories.list.programming"),
      this.transloco.translate("home.categories.list.digitalMarketing"),
      this.transloco.translate("home.categories.list.video"),
      this.transloco.translate("home.categories.list.animation"),
    ];

    // Cards (CTA)
    this.cards = [
      {
        type: "candidate",
        title: this.transloco.translate(
          "home.cards.candidate.title",
          this.transloco.translate("home.cta.becomeCandidate"),
        ),
        description: this.transloco.translate(
          "home.cards.candidate.description",
          this.transloco.translate("home.cta.candidateDescription"),
        ),
        route: "/auth/register",
      },
      {
        type: "employer",
        title: this.transloco.translate(
          "home.cards.employer.title",
          this.transloco.translate("home.cta.becomeEmployer"),
        ),
        description: this.transloco.translate(
          "home.cards.employer.description",
          this.transloco.translate("home.cta.employerDescription"),
        ),
        route: "/auth/register",
      },
    ];

    // Categories full objects

    this.popularCategories = [
      {
        name: this.transloco.translate("home.popularCategories.graphicsDesign"),
        icon: "fa-paintbrush",
        route: "/design",
        openPositions: 337,
      },
      {
        name: this.transloco.translate(
          "home.popularCategories.codeProgramming",
        ),
        icon: "fa-code",
        route: "/programming",
        openPositions: 312,
      },
      {
        name: this.transloco.translate(
          "home.popularCategories.digitalMarketing",
        ),
        icon: "fa-bullhorn",
        route: "/digital-marketing",
        openPositions: 297,
      },
      {
        name: this.transloco.translate("home.popularCategories.videoAnimation"),
        icon: "fa-video",
        route: "/video-animation",
        openPositions: 247,
      },
      {
        name: this.transloco.translate("home.popularCategories.musicAudio"),
        icon: "fa-music",
        route: "/music-audio",
        openPositions: 204,
      },
      {
        name: this.transloco.translate("home.popularCategories.accountFinance"),
        icon: "fa-file-invoice-dollar",
        route: "/account-finance",
        openPositions: 167,
      },
      {
        name: this.transloco.translate("home.popularCategories.healthCare"),
        icon: "fa-heart-pulse",
        route: "/health-care",
        openPositions: 135,
      },
      {
        name: this.transloco.translate("home.popularCategories.dataScience"),
        icon: "fa-database",
        route: "/data-science",
        openPositions: 57,
      },
    ];

    // TryRecruiter steps (maps to existing home.steps keys where available)
    this.tryRecruiter = [
      {
        name: this.transloco.translate("home.steps.createAccount"),
        icon: "fa-user-plus",
        description: this.transloco.translate("home.steps.createAccountDesc"),
        image: "/images/accueil/account.png",
        route: "/how-it-works#create-account",
      },
      {
        name: this.transloco.translate("home.steps.uploadCV"),
        icon: "fa-file-arrow-up",
        description: this.transloco.translate("home.steps.uploadCVDesc"),
        image: "/images/accueil/upload.png",
        route: "/how-it-works#upload-cv",
      },
      {
        name: this.transloco.translate("home.steps.findJob"),
        icon: "fa-bullseye",
        description: this.transloco.translate("home.steps.findJobDesc"),
        image: "/images/accueil/search.png",
        route: "/how-it-works#find-job",
      },
      {
        name: this.transloco.translate("home.steps.applyJob"),
        icon: "fa-paper-plane",
        description: this.transloco.translate("home.steps.applyJobDesc"),
        image: "/images/accueil/apply.png",
        route: "/how-it-works#apply",
      },
    ];
  }

  loadCandidate(id: string): void {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.candidatesService
      .selectById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (res) => {
          await wait();
          console.log("response: ", res);
          this.candidate = {
            ...res,
          };

          this.isLoading = false;
          this.hasError = false;
          this.errorMessage = "";
          console.log("Candidate: ", this.candidate);
        },
        error: (error: any) => {
          console.error("Erreur", error);
          this.isLoading = false;
          this.hasError = true;
          this.errorMessage =
            error?.error?.message ||
            this.transloco.translate("auth.genericError");
        },
      });
  }

  loadCompanies() {
    this.companiesService
      .selectMany({ page: 1, limit: 4 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (res) => {
          await wait();
          this.companies = res.data;

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

  loadJobOffers() {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    // Charger uniquement les offres actives et publiées depuis le backend
    this.jobOfferService
      .selectMany({ page: 1, limit: 12, status: "ACTIVE" })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: async (res) => {
          this.jobOffers = res.data ?? [];
          this.loadCompanies();

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

  viewAllCompanies(): void {
    // this.router.navigate(["/employers"]);
  }

  viewOpenPositions(companyId: string): void {
    // this.router.navigate(["/employers", companyId, "positions"]);
  }

  // toggleBookmark(job: Job): void {
  //   job.isBookmarked = !job.isBookmarked;
  //   // Optionally, add logic to save bookmark state to a service or backend
  // }

  applyNow(jobId: string): void {
    this.router.navigate(["/apply", jobId]);
  }

  viewAllJobs(): void {
    // this.router.navigate(["/jobs"]);
  }
  // Navigate to the specified route using the router  for all thing  needing nagigation to another componenents

  isActive(route: string) {
    return this.router.url === route;
  }

  goToStepRoute(route: string): void {
    // support routes with fragment or querystring
    try {
      if (!route) return;
      // If route contains a fragment (like /how-it-works#step)
      if (route.includes("#")) {
        const [path, fragment] = route.split("#");
        this.router.navigate([path], { fragment });
        return;
      }

      // If route contains query params
      if (route.includes("?")) {
        // navigateByUrl preserves the query string
        this.router.navigateByUrl(route);
        return;
      }

      this.router.navigate([route]);
    } catch (e) {
      // fallback
      this.router.navigateByUrl(route);
    }
  }

  openNotification(): boolean {
    return (this.open = !this.open);
  }

  activeCategorie(categoryName: string): boolean {
    return this.activeCategory === categoryName;
  }

  selectCategory(categoryName: string): void {
    this.activeCategory = categoryName;
    // Navigate to jobs page with category filter
    this.router.navigate(["/jobs"], {
      queryParams: { category: categoryName },
    });
  }

  viewAllCategories(): void {
    // this.router.navigate(["/categories"]);
  }

  async searchJobs() {
    const formValues = this.searchForm.value;
    const searchParams: any = {};

    if (formValues.keyword) {
      searchParams.keyword = formValues.keyword;
    }
    if (formValues.location) {
      searchParams.location = formValues.location;
    }

    this.isLoadingSearch = true;
    await wait(500);
    // Navigate to results page with search parameters
    this.router.navigate(["/jobs"], {
      queryParams: searchParams,
    });
  }

  resetFilters(): void {
    this.searchForm.reset({
      keyword: "",
      location: "",
    });
    this.loadJobOffers();
  }

  addToFavorites(item: any): void {
    if (!item?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate("joboffers.jobDetails.addToFavorites"),
      content: this.transloco.translate(
        "joboffers.jobDetails.addToFavoritesConfirm",
        { title: item.title },
      ),
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

    // dialogRef.afterClosed()
    const sub = dialogRef.componentInstance.action.subscribe((result) => {
      if (result === "confirm") {
        if (!this.id) {
          alert(
            this.transloco.translate(
              "home.errors.onlyCandidateCanAddFavorites",
            ),
          );
          return;
        }

        this.jobOfferService
          .addToFavorites(item.id, this.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              // if (response.success) {

              console.log("Offre ajoutée aux favoris avec succès");
              // }
              dialogRef.close();
              sub.unsubscribe();

              goToTop();
              this.loadJobOffers();
            },
            error: (error) => {
              console.error("Erreur lors de l'ajout aux favoris:", error);
            },
          });
      } else {
        dialogRef.close();
        sub.unsubscribe();
      }
    });
  }

  onButtonClick(event: Event) {
    const button = event.target as HTMLElement;
    button.style.borderBottom = "2px solid #1D9BED"; // Applique une bordure basse de couleur primary
  }

  selectSuggestion(event: Event, suggestion: string) {
    event?.preventDefault();
    this.jobQuery = suggestion;
    this.searchJobs();
  }

  // Add this property to track the active company
  activeCompanyId: string | null = null;

  // Method to check if a company is active
  isActiveCompany(companyId: string): boolean {
    return this.activeCompanyId === companyId;
  }

  // (Optional) Method to set the active company when a card is clicked
  selectActiveCompany(companyId: string): void {
    this.activeCompanyId = companyId;
  }

  onBookmarkClick(): void {
    if (this.isBookmarked) {
      this.confirmationModalText = this.transloco.translate(
        "home.favorites.removeFromFavorites",
      );
    } else {
      this.confirmationModalText = this.transloco.translate(
        "home.favorites.addToFavorites",
      );
    }
    this.showFavModal = true;
  }

  onConfirmBookmark(): void {
    this.isBookmarked = !this.isBookmarked;
    this.showFavModal = false;
  }

  onCancelBookmark(): void {
    this.showFavModal = false;
  }

  handleViewJobOffer(item: JobOffer) {
    this.router.navigate(["/jobs/", item.id]);
  }

  handleViewCompany(item: Company) {
    this.router.navigate(["/employers/", item.id]);
  }

  ngOnDestroy(): void {
    // Cleanup all subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}
