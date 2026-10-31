import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Company } from "@modules/compagnies/companies.types";
import { JobLevel, JobOffer } from "@modules/job-offers/job-offers.types";
import { TranslocoService } from "@ngneat/transloco";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { ApplicationsService } from "@modules/applications/applications.service";
import { AuthService } from "@modules/auth/auth.service";
import { CreateApplicationDto } from "@modules/applications/applications.types";
import { ResumesService } from "@modules/resumes/resumes.service";
import { Resume } from "@modules/resumes/resumes.types";
import { environment } from "@env/environment";
import { formatSalaryAmount } from "../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "job-offers-detail",
  templateUrl: "./job-offers-detail.component.html",
})
export class JobOffersDetailComponent {
  @ViewChild("applyModalTemplate", { static: true })
  applyModalTemplate!: TemplateRef<any>;

  @Input() item!: JobOffer;
  @Input() resumes?: Resume[] = [];

  formatSalaryAmount = formatSalaryAmount;
  @Input() canApply = true;
  @Input() canRepublish = false;
  @Input() displayCompanyDetails = true;

  @Output("onAddToFavorite") onAddToFavorite$: EventEmitter<JobOffer> =
    new EventEmitter();
  @Output("onRepublish") onRepublish$: EventEmitter<JobOffer> =
    new EventEmitter();

  applicationMessage: string = "";
  isSubmittingApplication: boolean = false;
  hasAlreadyApplied: boolean = false;
  isCheckingApplication: boolean = false;
  isFavoriteLoading: boolean = false;
  isDescriptionShort = true;

  get isExpired(): boolean {
    return this.item?.status === 'EXPIRED' || !!this.item?.isExpired;
  }

  get company() {
    return this.item.company;
  }

  get applications() {
    return this.item.applications;
  }

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  get isInFavorite() {
    return (
      this.item.favoritedBy?.some(
        (fav) => fav.accountId === this.candidateId,
      ) ?? false
    );
  }

  get isAuthenticated() {
    console.log("***********auth", this.authService.isAuthenticated());
    return this.authService.isAuthenticated();
  }

  get companyLogo(): string {
    const url = this.item.company?.logoFile?.url;
    if (!url || url === 'null' || url === 'undefined') return '';
    return url.trim();
  }

  get hasCompanyLogo(): boolean {
    return !!this.companyLogo;
  }

  companyLogoFailed = false;

  get companyInitials(): string {
    const name = this.item.company?.name?.trim() || '';
    if (!name) return '?';
    const words = name.split(/\s+/).filter(Boolean);
    if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  get companyAvatarColor(): string {
    const name = this.item.company?.name || '';
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
      'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }
  constructor(
    private transloco: TranslocoService,
    private dialog: MatDialog,
    private applicationsService: ApplicationsService,
    private authService: AuthService,
    private resumesService: ResumesService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.updateDescriptionLength();
    // Vérifier si l'utilisateur a déjà postulé quand le composant s'initialise
    if (this.item && this.isCandidate && this.candidateId) {
      this.checkExistingApplication();
    }
  }

  ngOnChanges(): void {
    this.updateDescriptionLength();
    this.companyLogoFailed = false;
    // Vérifier aussi quand l'item change
    if (this.item && this.isCandidate && this.candidateId) {
      this.checkExistingApplication();
    }
  }

  private updateDescriptionLength(): void {
    if (!this.item?.description) {
      this.isDescriptionShort = true;
      return;
    }
    // Strip HTML tags and measure plain text length
    const plainText = this.item.description.replace(/<[^>]*>/g, '').trim();
    this.isDescriptionShort = plainText.length < 300;
  }

  checkExistingApplication(): void {
    if (!this.item?.id || !this.candidateId) {
      return;
    }

    this.isCheckingApplication = true;

    this.applicationsService
      .selectMany({
        jobOfferId: this.item.id,
        page: 1,
        limit: 1,
      })
      .subscribe({
        next: (response) => {
          this.hasAlreadyApplied = response.total > 0;
          this.isCheckingApplication = false;
        },
        error: (error) => {
          console.error("Error checking existing application:", error);
          this.isCheckingApplication = false;
        },
      });
  }

  goToMyApplications(): void {
    if (this.candidateId) {
      this.router.navigate([
        "/dashboard",
        "candidates",
        this.candidateId,
        "applications",
        "list",
      ]);
    }
  }

  goToJobsList(): void {
    this.router.navigate(["/jobs"]);
  }

  get isCandidate() {
    return this.authService.isCandidate();
  }

  redirectToRegisterCandidate(): void {
    this.router.navigate(["/auth/register"], {
      queryParams: {
        type: "candidate",
        returnUrl: `/job-offers/${this.item.id}?apply=true`,
      },
    });
  }

  redirectToLogin(): void {
    this.router.navigate(["/auth/login"], {
      queryParams: { returnUrl: `/job-offers/${this.item.id}?apply=true` },
    });
  }

  applyToJob() {
    this.openApplyModal();
  }

  openApplyModal() {
    const modalData: GenericModalData = {
      title: this.transloco.translate("joboffers.apply.title"),
      template: this.applyModalTemplate,
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
          color: undefined,
        },
        {
          id: "confirm",
          label: this.transloco.translate("joboffers.apply.submit"),
          color: "primary",
          isLoading: this.isSubmittingApplication,
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      data: modalData,
      width: "500px",
      disableClose: this.isSubmittingApplication,
    });

    dialogRef.componentInstance.action.subscribe((action) => {
      if (action === "confirm") {
        this.submitApplication();
      } else if (action === "cancel") {
        dialogRef.close();
      }
    });
  }

  submitApplication() {
    const user = this.authService.getUser();
    if (!user || !this.authService.isCandidate()) {
      console.error("User not authenticated or not a candidate");
      return;
    }

    this.isSubmittingApplication = true;

    const applicationData: CreateApplicationDto = {
      // id: crypto.randomUUID(), // Generate a temporary ID for the creation
      jobOfferId: this.item.id,
      accountId: user.id,
      resumeId: "4b47187d-1638-4932-b66f-3d14063ca5eb", // Hard-coded CV ID as requested
      message: this.applicationMessage,
    };

    this.applicationsService.create(applicationData).subscribe({
      next: (response) => {
        console.log("Application submitted successfully", response);
        this.isSubmittingApplication = false;
        this.applicationMessage = "";
        this.dialog.closeAll();
        // You might want to show a success message here
      },
      error: (error) => {
        console.error("Error submitting application", error);
        this.isSubmittingApplication = false;
        const message =
          error?.status === 410
            ? this.transloco.translate("applications.errors.offerExpired")
            : error?.error?.message ||
              this.transloco.translate("general.genericError");
        this.dialog.open(GenericModalComponent, {
          width: "400px",
          data: {
            title: this.transloco.translate("applications.error.title"),
            content: message,
            actions: [{ id: "ok", label: this.transloco.translate("general.ok"), color: "primary" }],
          },
        });
      },
    });
  }

  async addToFavorites() {
    this.isFavoriteLoading = true;
    try {
      await this.onAddToFavorite$.emit(this.item);
    } finally {
      this.isFavoriteLoading = false;
    }
  }

  handleView(item: any) {
    //
  }

  getJobLevel(jobLevel: JobLevel) {
    return this.transloco.translate(`joboffers.jobLevel.${jobLevel}`);
  }
}
