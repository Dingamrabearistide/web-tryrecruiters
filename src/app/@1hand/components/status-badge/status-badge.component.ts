import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

export interface StatusBadgeConfig {
  [key: string]: {
    label: string;
    bgColor: string;
    textColor: string;
    dotColor?: string;
  };
}

@Component({
  selector: "app-status-badge",
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <span
      [ngClass]="getBadgeClasses()"
      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    >
      <span
        *ngIf="showDot"
        [ngClass]="getDotClasses()"
        class="w-2 h-2 rounded-full mr-1.5"
      ></span>
      {{ getLabelKey() | transloco }}
    </span>
  `,
  styleUrls: ["./status-badge.component.scss"],
})
export class StatusBadgeComponent implements OnInit {
  @Input() status!: string;
  @Input() config: StatusBadgeConfig = {};
  @Input() showDot: boolean = true;
  @Input() defaultLabel: string = "Inconnu";

  private defaultJobStatusConfig: StatusBadgeConfig = {
    ACTIVE: {
      label: "joboffers.status.ACTIVE",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      dotColor: "bg-green-400",
    },
    INACTIVE: {
      label: "joboffers.status.INACTIVE",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      dotColor: "bg-red-400",
    },
    PENDING: {
      label: "joboffers.status.PENDING",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      dotColor: "bg-yellow-400",
    },
    EXPIRED: {
      label: "joboffers.status.EXPIRED",
      bgColor: "bg-gray-100",
      textColor: "text-gray-600",
      dotColor: "bg-gray-400",
    },
    DRAFT: {
      label: "joboffers.status.DRAFT",
      bgColor: "bg-slate-100",
      textColor: "text-slate-600",
      dotColor: "bg-slate-400",
    },
  };

  constructor(private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.config = { ...this.defaultJobStatusConfig, ...this.config };
  }

  getBadgeClasses(): string {
    const statusConfig = this.config[this.status];
    if (statusConfig) {
      return `${statusConfig.bgColor} ${statusConfig.textColor}`;
    }
    return "bg-gray-100 text-gray-800";
  }

  getDotClasses(): string {
    const statusConfig = this.config[this.status];
    if (statusConfig && statusConfig.dotColor) {
      return statusConfig.dotColor;
    }
    return "bg-gray-400";
  }

  getLabelKey(): string {
    const statusConfig = this.config[this.status];
    return statusConfig ? statusConfig.label : this.defaultLabel;
  }

  getDisplayLabel(): string {
    return this.transloco.translate(this.getLabelKey());
  }
}

