import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { AuthService } from "@modules/auth/auth.service";
import { CandidatesService } from "@modules/candidates/candidates.service";
import { Candidate } from "@modules/candidates/candidates.types";
import { TranslocoService } from "@ngneat/transloco";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../../../../@1hand/components/generic-form/generic-form.component";

@Component({
  standalone: false,

  selector: "app-dashboard-candidates-users-profile-page",
  templateUrl: "./dashboard-candidates-users-profile-page.component.html",
  styleUrls: ["./dashboard-candidates-users-profile-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidatesUsersProfilePageComponent implements OnInit {
  @ViewChild("callFormTemplate") callFormTemplate!: TemplateRef<any>;
  @ViewChild(GenericFormComponent) profileForm!: GenericFormComponent;

  protected genericFormConfig: FieldConfig[] = [];
  protected isLoading = false;
  protected hasError = false;
  protected errorMessage = "";
  protected item!: Candidate;
  protected profile!: Candidate;
  protected modalFormData: any = {};
  private candidateId!: string;

  constructor(
    private authService: AuthService,
    private service: CandidatesService,
    private transloco: TranslocoService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.candidateId = (() => {
      const user = this.authService.getUser();
      return (
        user && this.authService.isCandidate() ? user.id : null
      ) as string;
    })();
    if (this.candidateId) {
      this.loadItem(this.candidateId);
    }
  }

  loadItem(id: string): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.service.selectById(id).subscribe({
      next: (candidateRes) => {
        const profile = { ...candidateRes };
        this.item = profile;
        this.profile = profile;
        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: (error) => {
        console.error("Error loading candidate profile", error);
        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("auth.genericError");
      },
    });
  }

  handleDone(updatedProfile?: Candidate | void) {
    if (updatedProfile) {
      this.profile = { ...updatedProfile };
      this.item = this.profile;
    } else {
      this.loadItem(this.candidateId);
    }
  }

  // Public helper used by the template to determine if profile has any content
  public get hasContent(): boolean {
    const p = this.profile as any;
    if (!p) return false;

    // Check basic free-text fields
    if (p.bio || p.profession) return true;

    // Check relations arrays
    const arrKeys = [
      "experiences",
      "educations",
      "skills",
      "languages",
      "tools",
      "certifications",
      "resumes",
    ];

    for (const k of arrKeys) {
      if (p[k] && Array.isArray(p[k]) && p[k].length > 0) return true;
    }

    return false;
  }


}
