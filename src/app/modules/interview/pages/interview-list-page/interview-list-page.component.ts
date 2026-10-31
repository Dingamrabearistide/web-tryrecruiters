import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { InterviewsService } from "../../interviews.service";
import { Interview } from "../../interview.types";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-interview-list-page",
  templateUrl: "./interview-list-page.component.html",
})
export class InterviewListPageComponent implements OnInit {
  showForm = false;
  selectedApplication: any = null;

  constructor(
    private interviewService: InterviewsService,
    private router: Router,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    // Check if we have application data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.["application"]) {
      this.selectedApplication = navigation.extras.state["application"];
      this.showForm = true;
    }
  }

  onScheduleInterview(): void {
    this.showForm = true;
  }

  onInterviewSubmit(interviewData: Interview): void {
    this.interviewService
      .create({ ...interviewData, meetUrl: interviewData.meetUrl ?? undefined })
      .subscribe({
      next: (interview) => {
        console.log("Interview created:", interview);
        this.showForm = false;
        this.selectedApplication = null;
        // Refresh the list or navigate
        window.location.reload();
      },
      error: (error) => {
        console.error("Error creating interview:", error);
        alert(this.transloco.translate("errors.createInterview"));
      },
    });
  }

  onCancelForm(): void {
    this.showForm = false;
    this.selectedApplication = null;
  }
}
