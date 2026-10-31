import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Interview, InterviewStatus } from "../../interview.types";
import { TranslocoService } from "@ngneat/transloco";

@Component({
  standalone: false,

  selector: "app-interview-list",
  templateUrl: "./interview-list.component.html",
})
export class InterviewListComponent implements OnInit {
  @Input() interviews: Interview[] = [];
  isLoading = false;
  hasError = false;
  errorMessage = "";

  datatableConfig: any;

  constructor(private router: Router, private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.setupDatatableConfig();
  }

  private setupDatatableConfig(): void {
    this.datatableConfig = {
      columns: [
        {
          key: "candidate",
          label: this.transloco.translate("list.columns.candidate"),
          sortable: true,
          template: "candidate",
        },
        {
          key: "position",
          label: this.transloco.translate("list.columns.jobOffer"),
          sortable: true,
          template: "position",
        },
        {
          key: "scheduledAt",
          label: this.transloco.translate("list.columns.scheduledAt"),
          sortable: true,
          template: "scheduledAt",
        },
        {
          key: "durationMin",
          label: this.transloco.translate("list.columns.duration"),
          sortable: true,
          template: "duration",
        },
        {
          key: "status",
          label: this.transloco.translate("list.columns.status"),
          sortable: true,
          template: "status",
        },
        {
          key: "meetUrl",
          label: this.transloco.translate("list.columns.meetUrl"),
          sortable: false,
          template: "meetUrl",
        },
        {
          key: "actions",
          label: this.transloco.translate("list.columns.actions"),
          sortable: false,
          template: "actions",
        },
      ],
      actions: {
        view: true,
        edit: true,
        delete: true,
        custom: [
          {
            id: "join",
            label: this.transloco.translate("list.actions.join"),
            icon: "fa-video",
            color: "primary",
            condition: (item: Interview) =>
              item.status === InterviewStatus.SCHEDULED &&
              this.isInterviewStartingSoon(item),
          },
          {
            id: "cancel",
            label: this.transloco.translate("list.actions.cancel"),
            icon: "fa-ban",
            color: "warning",
            condition: (item: Interview) =>
              item.status === InterviewStatus.SCHEDULED,
          },
        ],
      },
      pagination: {
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [5, 10, 25, 50],
      },
      search: {
        enabled: true,
        placeholder: this.transloco.translate("list.searchPlaceholder"),
      },
      filters: [
        {
          key: "status",
          label: this.transloco.translate("list.columns.status"),
          type: "select",
          options: [
            { value: "", label: this.transloco.translate("form.allStatuses") },
            {
              value: InterviewStatus.SCHEDULED,
              label: this.transloco.translate("status.SCHEDULED"),
            },
            {
              value: InterviewStatus.COMPLETED,
              label: this.transloco.translate("status.COMPLETED"),
            },
            {
              value: InterviewStatus.CANCELED,
              label: this.transloco.translate("status.CANCELLED"),
            },
            // { value: InterviewStatus.NO_SHOW, label: this.transloco.translate("status.NO_SHOW") },
          ],
        },
      ],
    };
  }

  onView(interview: Interview): void {
    //
  }

  onEdit(interview: Interview): void {
    //
  }

  onDelete(interview: Interview): void {
    //
  }

  onCustomAction(action: string, interview: Interview): void {
    //
  }

  joinInterview(interview: Interview): void {
    if (interview.meetUrl) {
      window.open(interview.meetUrl, "_blank");
    }
  }

  private isInterviewStartingSoon(interview: Interview): boolean {
    const now = new Date();
    const scheduledTime = new Date(interview.scheduledAt);
    const timeDiff = scheduledTime.getTime() - now.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    // Allow joining 15 minutes before and up to the duration of the interview
    return minutesDiff >= -15 && minutesDiff <= interview.durationMin;
  }

  getStatusClass(status: InterviewStatus): string {
    switch (status) {
      case InterviewStatus.SCHEDULED:
        return "bg-blue-100 text-blue-700";
      case InterviewStatus.COMPLETED:
        return "bg-green-100 text-green-700";
      case InterviewStatus.CANCELED:
        return "bg-red-100 text-red-700";
      // case InterviewStatus.NO_SHOW:
      //   return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  getStatusLabel(status: InterviewStatus): string {
    try {
      return this.transloco.translate(`status.${status}`) || status;
    } catch (e) {
      return status;
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours}h ${remainingMinutes}min`
      : `${hours}h`;
  }

  onAdd(): void {
    this.router.navigate(["/interviews/new"]);
  }

  canJoinInterview(interview: Interview): boolean {
    return this.isInterviewStartingSoon(interview);
  }
}
