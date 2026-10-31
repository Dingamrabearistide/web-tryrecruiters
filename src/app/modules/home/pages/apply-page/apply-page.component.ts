import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";

import { AuthService } from "@modules/auth/auth.service";
import { ApplicationsService } from "@modules/applications/applications.service";
import {
  ApplicationFormData,
  CreateApplicationDto,
} from "@modules/applications/applications.types";
import { JobOffersService } from "@modules/job-offers/job-offers.service";
import { ResumesService } from "@modules/resumes/resumes.service";
import { CandidatesService } from "@modules/candidates/candidates.service";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { Resume } from "@modules/resumes/resumes.types";
import { MatDialog } from "@angular/material/dialog";
import { formatSalaryAmount } from "../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import { Validators } from "@angular/forms";
import { GenericFileManagerUploadService } from "../../../../@1hand/components/generic-file-manager/generic-file-manager-upload.service";
import { CandidateRegisterDto } from "@modules/auth/auth.types";
import { filter } from "rxjs";
import { environment } from "@env/environment";
import { ErrorService } from "../../../../core/services/error.service";

@Component({
  standalone: false,

  selector: "app-apply-page",
  templateUrl: "./apply-page.component.html",
  styleUrls: ["./apply-page.component.scss"],
})
export class ApplyPageComponent implements OnInit {
  @ViewChild("applicationForm") applicationForm!: GenericFormComponent;

  formatSalaryAmount = formatSalaryAmount;

  isLoading = true;
  hasError = false;
  errorMessage = "";
  isSubmitting = false;
  hasErrorSubmitting = false;
  hasAlreadyApplied = false; // Nouvelle variable pour gérer la double candidature

  showSuccess = false;
  successEmail = "";

  jobOffer?: JobOffer;
  resumes: Resume[] = [];
  candidateId?: string;
  isLoggedIn = false;
  showJobDetails = false;
  hasResumes = false;

  guestFormFields: FieldConfig[] = [];
  applicationFormFields: FieldConfig[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private transloco: TranslocoService,
    private errorService: ErrorService,
    private authService: AuthService,
    private applicationsService: ApplicationsService,
    private jobOffersService: JobOffersService,
    private resumesService: ResumesService,
    private candidatesService: CandidatesService,
    private uploadService: GenericFileManagerUploadService,
    private dialog: MatDialog,
  ) {}

  initGuestFormFields(): void {
    this.guestFormFields = [
      {
        name: "firstName",
        label: "guest.firstName",
        type: "string",
        required: true,
        validation: [Validators.minLength(2)],
        errorMessages: {
          required: "guest.firstNameRequired",
          minlength: "guest.firstNameRequired",
        },
        size: { xs: 12, md: 6 },
      },
      {
        name: "lastName",
        label: "guest.lastName",
        type: "string",
        required: true,
        validation: [Validators.minLength(2)],
        errorMessages: {
          required: "guest.lastNameRequired",
          minlength: "guest.lastNameRequired",
        },
        size: { xs: 12, md: 6 },
      },
      {
        name: "email",
        label: "guest.email",
        type: "string",
        required: true,
        validation: [Validators.email],
        errorMessages: {
          required: "guest.emailInvalid",
          email: "guest.emailInvalid",
        },
        size: { xs: 12 },
      },
      {
        name: "phone",
        label: "guest.phone",
        type: "phone",
        required: true,
        errorMessages: {
          required: "guest.phoneRequired",
        },
        size: { xs: 12 },
      },
      {
        name: "resumeMedia",
        label: "form.resumeMedia",
        type: "file",
        required: true,
        acceptedFileExtensions: [
          ".pdf",
          ".doc",
          ".docx",
          ".jpg",
          ".jpeg",
          ".png",
        ],
        validation: [],
        errorMessages: {
          required: "form.errors.required",
        },
        size: { xs: 12 },
      },
      {
        name: "message",
        label: "form.message",
        type: "textarea",
        required: false,
        rows: 5,
        placeholder: "form.messagePlaceholder",
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          required: "form.errors.required",
          maxlength: "form.errors.maxlength2000",
        },
        size: { xs: 12 },
      },
    ];
  }

  initCanidateFormFields(): void {
    this.applicationFormFields = [
      {
        name: "resumeId",
        label: "form.resume",
        placeholder: "form.selectResume",
        type: "select",
        required: true,
        size: { xs: 12 },
        options:
          this.resumes?.map((resume) => ({
            value: resume.id,
            label: `${resume.name} (${resume.resumeFile.originalName})`,
          })) || [],
        validation: [],
        errorMessages: {
          required: "form.errors.fields.resumeId.required",
        },
      },
      {
        name: "message",
        label: "form.message",
        type: "textarea",
        required: false,
        rows: 5,
        placeholder: "form.messagePlaceholder",
        validation: [Validators.maxLength(2000)],
        errorMessages: {
          required: "form.errors.required",
          maxlength: "form.errors.maxlength2000",
        },
        size: { xs: 12 },
      },
    ];
  }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est un candidat connecté
    this.isLoggedIn = this.authService.isCandidate();
    if (this.isLoggedIn) {
      const user = this.authService.getUser();
      this.candidateId =
        user && this.authService.isCandidate() ? user.id : undefined;
      if (this.candidateId) {
        this.loadResumes(this.candidateId);
      }
    } else {
      this.initGuestFormFields();
    }

    // Récupérer l'ID de l'offre depuis les paramètres de route
    this.route.paramMap.subscribe((params) => {
      const jobOfferId = params.get("id");

      if (!jobOfferId) {
        this.hasError = true;
        this.errorMessage = this.transloco.translate(
          "applications.errors.noJobOfferId",
        );
        this.isLoading = false;
        return;
      }

      this.loadJobOffer(jobOfferId);
    });
  }

  loadJobOffer(jobOfferId: string): void {
    this.isLoading = true;
    this.hasError = false;

    this.jobOffersService.selectById(jobOfferId).subscribe({
      next: (jobOffer) => {
        this.jobOffer = jobOffer;

        // Vérifier si l'utilisateur a déjà postulé
        if (this.isLoggedIn && this.candidateId) {
          this.checkExistingApplication(jobOfferId);
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error("Error loading job offer:", error);
        // Si c'est une erreur métier standard (4xx, 5xx), afficher le message
        if (error?.status && [400, 401, 403, 404, 500, 502, 503].includes(error.status)) {
          this.hasError = true;
          this.errorMessage =
            error?.error?.message ||
            this.transloco.translate("applications.errors.loadJobOfferFailed");
        } else {
          // Erreur technique - générer un code d'erreur
          this.errorService.handleHttpError(error);
        }
        this.isLoading = false;
      },
    });
  }

  checkExistingApplication(jobOfferId: string): void {
    // Vérifier si une candidature existe déjà pour cette offre
    this.applicationsService
      .selectMany({
        jobOfferId: jobOfferId,
        page: 1,
        limit: 1,
      })
      .subscribe({
        next: (response) => {
          if (response.total > 0) {
            // Candidature existante trouvée - afficher le message
            this.hasAlreadyApplied = true;
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error checking existing application:", error);
          // Si c'est une erreur technique (pas standard HTTP), envoyer à errorService
          if (!error?.status || ![400, 401, 403, 404, 500, 502, 503].includes(error.status)) {
            this.errorService.handleHttpError(error);
          }
          // En cas d'erreur, autoriser quand même (pour ne pas bloquer)
          this.isLoading = false;
        },
      });
  }

  goToMyApplications(): void {
    this.router.navigate([
      "/dashboard",
      "candidates",
      this.candidateId,
      "applications",
      "list",
    ]);
  }

  goToJobsList(): void {
    this.router.navigate(["/jobs"]);
  }

  loadResumes(candidateId: string): void {
    // ✅ Ne pas envoyer candidateId, le backend utilisera userId du token
    this.resumesService.selectMany({}).subscribe({
      next: (res) => {
        this.resumes = res.data;
        this.hasResumes = this.resumes.length > 0;

        this.initCanidateFormFields();
      },
      error: (error) => {
        console.error("Error loading resumes:", error);
        // Si c'est une erreur technique (pas standard HTTP), envoyer à errorService
        if (!error?.status || ![400, 401, 403, 404, 500, 502, 503].includes(error.status)) {
          this.errorService.handleHttpError(error);
        }
        this.hasResumes = false;
        // On ne bloque pas si les CV ne se chargent pas
      },
    });
  }

  private resolveSubmitError(error: any): string {
    if (error?.status === 410) {
      return this.transloco.translate("applications.errors.offerExpired");
    }
    return error?.error?.message || this.transloco.translate("applications.errors.submitFailed");
  }

  handleSubmit(formData: ApplicationFormData): void {
    if (!this.jobOffer || !this.candidateId) {
      return;
    }

    this.isSubmitting = true;

    const applicationData: CreateApplicationDto = {
      jobOfferId: this.jobOffer.id,
      accountId: this.candidateId,
      resumeId: formData.resume?.id || undefined,
      message: formData.message || undefined,
    };

    this.applicationsService.create(applicationData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showSuccessModal();
      },
      error: (error) => {
        console.error("Error submitting application:", error);
        this.isSubmitting = false;
        if (error?.status === 410 || (error?.status && [400, 401, 403, 404, 500, 502, 503].includes(error.status))) {
          this.hasErrorSubmitting = true;
          this.errorMessage = this.resolveSubmitError(error);
        } else {
          this.errorService.handleHttpError(error);
        }
      },
    });
  }

  handleGuestSubmit(formValue: any): void {
    if (!this.jobOffer) {
      return;
    }

    if (!formValue.resumeMedia) {
      this.hasErrorSubmitting = true;
      this.errorMessage = "Please select a valid file";
      return;
    }

    this.isSubmitting = true;

    if (formValue.resumeMedia instanceof File) {
      const uploadUrl = `${environment.apiUrl}/upload`;
      this.uploadService
        .uploadWithProgress(uploadUrl, formValue.resumeMedia, {})
        .pipe(filter((event: any) => event.type === "response"))
        .subscribe({
          next: (uploadEvent: any) => {
            const uploadedFile = uploadEvent.body;
            this.createGuestApplication(formValue, uploadedFile);
          },
          error: (error: any) => {
            console.log(error);
            if (error?.status === 410 || (error?.status && [400, 401, 403, 404, 500, 502, 503].includes(error.status))) {
              this.handleGuestSubmitError(this.resolveSubmitError(error));
            } else {
              this.errorService.handleHttpError(error);
            }
          },
        });
    } else {
      this.createGuestApplication(formValue, formValue.resumeMedia);
    }
  }

  private createGuestApplication(formValue: any, uploadedFile: any): void {
    // Utiliser directement la méthode create avec guestData
    // Le backend gère la création du compte s'il n'existe pas
    const applicationData: CreateApplicationDto = {
      jobOfferId: this.jobOffer!.id,
      guestData: {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        phone: formValue.phone,
        resumeFileId: uploadedFile.id,
      },
      message: formValue.message || undefined,
    };

    this.applicationsService.create(applicationData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showGuestSuccessModal(formValue.email);
      },
      error: (error: any) => {
        if (error?.status === 410 || (error?.status && [400, 401, 403, 404, 500, 502, 503].includes(error.status))) {
          this.handleGuestSubmitError(this.resolveSubmitError(error));
        } else {
          this.errorService.handleHttpError(error);
        }
      },
    });
  }

  private handleGuestSubmitError(errorMessage: string): void {
    console.error("Error submitting application:", errorMessage);
    this.isSubmitting = false;
    this.errorMessage = errorMessage;
    this.hasErrorSubmitting = true;
  }

  private generateRandomPassword(): string {
    const length = 12;
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";

    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    const allChars = uppercase + lowercase + numbers + special;
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    return password
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");
  }

  handleUserSubmit(formValue: any): void {
    if (!this.jobOffer) {
      return;
    }

    this.isSubmitting = true;

    const applicationData: any = {
      jobOfferId: this.jobOffer.id,
      // ✅ Ne pas envoyer accountId/candidateId
      // Le backend utilisera userId du token JWT automatiquement
      message: formValue.message || undefined,
    };

    if (formValue.resumeId) {
      applicationData.resumeId = formValue.resumeId;
    }

    this.applicationsService.create(applicationData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.showGuestSuccessModal("");
      },
      error: (error: any) => {
        console.error("Error submitting application:", error);
        this.isSubmitting = false;
        this.errorMessage = this.resolveSubmitError(error);
        this.hasErrorSubmitting = true;
      },
    });
  }

  showGuestSuccessModal(email: string): void {
    this.successEmail = email;
    this.showSuccess = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showLoginRequiredModal(): void {
    const modalData: GenericModalData = {
      title: this.transloco.translate("applications.loginRequired.title"),
      content: this.transloco.translate("applications.loginRequired.message"),
      actions: [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
          value: "cancel",
          color: undefined,
        },
        {
          label: this.transloco.translate("general.login"),
          value: "login",
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.router.navigate(["/auth/login"], {
          queryParams: { returnUrl: this.router.url },
        });
      } else {
        this.router.navigate(["/home"]);
      }
    });
  }

  showSuccessModal(): void {
    this.showSuccess = true;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showErrorModal(message: string): void {
    const modalData: GenericModalData = {
      title: this.transloco.translate("applications.error.title"),
      content: message,
      actions: [
        {
          id: "ok",
          label: this.transloco.translate("general.ok"),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    dialogRef.afterClosed().subscribe(() => {
      // Modal closed
    });
  }

  goBack(): void {
    if (this.jobOffer) {
      this.router.navigate(["/jobs", this.jobOffer.id]);
    } else {
      this.router.navigate(["/jobs"]);
    }
  }

  toggleJobDetails(): void {
    this.showJobDetails = !this.showJobDetails;
  }

  goToResumesPage(): void {
    this.router.navigate([
      "/dashboard",
      "candidates",
      this.candidateId,
      "resumes",
      "create",
    ]);
  }

  goToHome(): void {
    this.router.navigate(["/"]);
  }
}
