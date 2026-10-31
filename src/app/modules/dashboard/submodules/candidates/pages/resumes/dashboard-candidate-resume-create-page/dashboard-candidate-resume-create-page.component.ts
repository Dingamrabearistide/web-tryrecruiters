import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import { ModuleObject, ModuleRoot } from "@modules/users/users.type";
import { TranslocoService } from "@ngneat/transloco";
import { BaseCreatePageComponent } from "../../../../../../../@1hand/pages/base-create-page/base-create-page.component";
import { ResumesService as Service } from "@modules/resumes/resumes.service";
import {
  CreateResumeDto as ModuleObjectCreateDto,
  ResumeFormData as ModuleFormData,
} from "@modules/resumes/resumes.types";
import { AuthService } from "@modules/auth/auth.service";

@Component({
  standalone: false,

  selector: "app-dashboard-candidate-resume-create-page",
  templateUrl: "./dashboard-candidate-resume-create-page.component.html",
  styleUrls: ["./dashboard-candidate-resume-create-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashboardCandidateResumeCreatePageComponent
  extends BaseCreatePageComponent<ModuleObjectCreateDto, ModuleObject>
  implements OnInit
{
  moduleName = ModuleRoot;
  employerId!: string;

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  constructor(
    protected override service: Service,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute,
    private authService: AuthService
  ) {
    super(service, dialog, transloco, router, route);
  }

  override onInitParams(): void {
    this.route.parent?.parent?.paramMap.subscribe((params) => {
      const employerId = params.get("employerId");
      if (!employerId) {
        this.router.navigate(["../"]);
        return;
      }
      this.employerId = employerId;
    });
  }

  override buildPayload(formData: ModuleFormData): ModuleObjectCreateDto {
    if (!this.candidateId) {
      console.error("No candidate ID");
      throw Error("No candidate ID");
    }

    const { resumeFile, ...rest } = formData;
    return {
      ...rest,
      resumeFileId: formData.resumeFile.id,
      accountId: this.candidateId,
    };
  }

  override getItemLabel(item: ModuleObject): string {
    return item.name;
  }
}
