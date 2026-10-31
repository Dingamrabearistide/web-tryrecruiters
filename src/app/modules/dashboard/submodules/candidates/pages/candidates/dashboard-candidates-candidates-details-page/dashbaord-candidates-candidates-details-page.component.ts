import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TranslocoService } from "@ngneat/transloco";
import { CandidatesService } from "@modules/candidates/candidates.service";
import { goToTop, wait } from "../../../../../../../@1hand/utils";
import {
  GenericModalComponent,
  GenericModalData,
} from "../../../../../../../@1hand/components/generic-modal/generic-modal.component";
import { Candidate as ModuleObject } from "@modules/candidates/candidates.types";
import { Location } from '@angular/common';

@Component({
  standalone: false,

  selector: "app-candidates-details-page",
  templateUrl: "./dashbaord-candidates-candidates-details-page.component.html",
  styleUrls: ["./dashbaord-candidates-candidates-details-page.component.scss", "../../../../../../../../styles/legacy-styles.css"],
})
export class DashbaordCandidatesCandidatesDetailsPageComponent
  implements OnInit
{
  @ViewChild("callFormTemplate") callFormTemplate!: TemplateRef<any>;

  // State variables
  isLoading = false;
  hasError = false;
  errorMessage = "";

  // Data
  candidate!: ModuleObject;
  showMoreStates: { [key: string]: boolean } = {};
  callForm!: FormGroup;

  constructor(
    public route: ActivatedRoute,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private transloco: TranslocoService,
    private candidatesService: CandidatesService,
    private location: Location,
  ) {
    this.callForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      meetLink: ["", Validators.required],
    });
  }

  handleBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get("slug");
      if (id) {
        this.loadCandidate(id);
      } else {
        console.error("Aucun ID fourni dans les paramètres de la route.");
      }
    });
  }

  loadCandidate(id: string): void {
    goToTop();

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.candidatesService.selectById(id).subscribe({
      next: async (res) => {
        await wait();
        console.log("response: ", res);
        this.candidate = res;

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

  toggleDetails(key: string): void {
    this.showMoreStates[key] = !this.showMoreStates[key];
  }

  openCallModal(): void {
    if (!this.candidate?.id) {
      return;
    }

    const modalData: GenericModalData = {
      title: this.transloco.translate(
        "candidates.candidateDetails.scheduleCall",
      ),
      content: this.transloco.translate(
        "candidates.candidateDetails.scheduleCall",
      ),
      actions: [
        {
          label: this.transloco.translate("candidates.candidateDetails.cancel"),
          value: false,
          color: undefined,
        },
        {
          label: this.transloco.translate(
            "candidates.candidateDetails.confirm",
          ),
          value: true,
          color: "primary",
        },
      ],
    };

    const dialogRef = this.dialog.open(GenericModalComponent, {
      width: "400px",
      data: modalData,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        console.log(
          "Call scheduled for candidate:",
          this.candidate.firstName,
          this.candidate.lastName,
        );
        // Here you would call a service method to schedule the call
        // this.scheduleCall();
      }
    });
  }

  // Helper method to simulate scheduling a call
  private scheduleCall(): void {
    // Simulate API call for scheduling
    console.log("Scheduling call with form data:", this.callForm.value);
    // In a real implementation, you would call a service method here
  }
}
