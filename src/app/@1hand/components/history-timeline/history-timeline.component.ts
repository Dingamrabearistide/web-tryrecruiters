import { Component, Input, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoService } from "@ngneat/transloco";

interface HistoryEntryActor {
  id: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

interface HistoryEntry {
  id: string;
  createdAt: string;
  type: string;
  applicationId?: string | null;
  interviewId?: string | null;
  actorId?: string;
  data?: Record<string, any> | null;
  actor?: HistoryEntryActor;
}

/** Renders GET /applications/:id/history and GET /interviews/:id/history.
 * Field shape and `type`/`data` values were confirmed against the live
 * dev API (dev-api.tryrecruiters.com) rather than guessed from Swagger,
 * which doesn't document the response schema. Confirmed types so far:
 * APPLICATION_SUBMITTED, APPLICATION_STATUS_CHANGED ({from,to}),
 * INTERVIEW_SCHEDULED ({type,location?,scheduledAt}), INTERVIEW_CONFIRMED
 * ({message?}), INTERVIEW_DECLINED ({message?}), INTERVIEW_CANCELED
 * ({notes?}). Unknown future types fall back to a humanized raw label. */
@Component({
  selector: "app-history-timeline",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isLoading" class="text-sm text-gray-500 py-4">
      {{ loadingLabel }}
    </div>

    <div *ngIf="!isLoading && (!items || items.length === 0)" class="text-sm text-gray-500 py-4">
      {{ emptyLabel }}
    </div>

    <ol *ngIf="!isLoading && items?.length" class="relative border-l border-gray-200 ml-3 space-y-6">
      <li *ngFor="let entry of items" class="ml-4">
        <span
          class="absolute -left-1.5 flex size-3 items-center justify-center rounded-full bg-primary"
        ></span>
        <p class="text-xs text-gray-400">{{ getDate(entry) }}</p>
        <p class="text-sm font-medium text-gray-900">{{ getAction(entry) }}</p>
        <p *ngIf="getActor(entry)" class="text-xs text-gray-500">{{ getActor(entry) }}</p>
        <p *ngIf="getDetails(entry)" class="mt-1 text-sm text-gray-600 whitespace-pre-line">
          {{ getDetails(entry) }}
        </p>
      </li>
    </ol>
  `,
})
export class HistoryTimelineComponent {
  @Input() items: HistoryEntry[] = [];
  @Input() isLoading = false;
  @Input() emptyLabel = "No history yet.";
  @Input() loadingLabel = "Loading...";

  private transloco = inject(TranslocoService);

  private get isEnglish(): boolean {
    return (this.transloco.getActiveLang() || "fr").startsWith("en");
  }

  getDate(entry: HistoryEntry): string {
    if (!entry?.createdAt) return "";
    try {
      return new Intl.DateTimeFormat(this.isEnglish ? "en-US" : "fr-FR", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(entry.createdAt));
    } catch {
      return String(entry.createdAt);
    }
  }

  getActor(entry: HistoryEntry): string {
    const actor = entry?.actor;
    if (!actor) return "";
    return [actor.firstName, actor.lastName].filter(Boolean).join(" ");
  }

  getAction(entry: HistoryEntry): string {
    const isEn = this.isEnglish;
    const data = entry?.data || {};

    switch (entry?.type) {
      case "APPLICATION_SUBMITTED":
        return isEn ? "Application submitted" : "Candidature soumise";
      case "APPLICATION_STATUS_CHANGED":
        return isEn
          ? `Status changed: ${this.statusLabel(data["from"], isEn)} → ${this.statusLabel(data["to"], isEn)}`
          : `Statut modifié : ${this.statusLabel(data["from"], isEn)} → ${this.statusLabel(data["to"], isEn)}`;
      case "INTERVIEW_SCHEDULED":
        return isEn ? "Interview scheduled" : "Entretien programmé";
      case "INTERVIEW_CONFIRMED":
        return isEn ? "Candidate confirmed the interview" : "Le candidat a confirmé l'entretien";
      case "INTERVIEW_DECLINED":
        return isEn ? "Candidate declined the interview" : "Le candidat a décliné l'entretien";
      case "INTERVIEW_CANCELED":
        return isEn ? "Interview canceled" : "Entretien annulé";
      case "INTERVIEW_COMPLETED":
        return isEn ? "Interview completed" : "Entretien terminé";
      case "INTERVIEW_UPDATED":
        return isEn ? "Interview updated" : "Entretien modifié";
      default:
        return this.humanizeType(entry?.type);
    }
  }

  getDetails(entry: HistoryEntry): string {
    const data = entry?.data;
    if (!data) return "";

    if (entry.type === "INTERVIEW_UPDATED" && data["changes"]) {
      return this.formatChanges(data["changes"]);
    }

    const parts: string[] = [];

    if (data["type"]) parts.push(this.interviewTypeLabel(data["type"]));
    if (data["scheduledAt"]) {
      try {
        parts.push(
          new Intl.DateTimeFormat(this.isEnglish ? "en-US" : "fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(data["scheduledAt"])),
        );
      } catch {
        // ignore unparseable date
      }
    }
    if (data["location"]) parts.push(data["location"]);
    if (data["message"]) parts.push(data["message"]);
    if (data["notes"]) parts.push(data["notes"]);

    return parts.join(" — ");
  }

  private formatChanges(changes: Record<string, { from: any; to: any }>): string {
    const isEn = this.isEnglish;
    const fieldLabels: Record<string, string> = isEn
      ? {
          scheduledAt: "Date/time",
          durationMin: "Duration",
          type: "Type",
          meetUrl: "Meeting link",
          location: "Location",
          timezone: "Time zone",
          notes: "Notes",
          status: "Status",
        }
      : {
          scheduledAt: "Date/heure",
          durationMin: "Durée",
          type: "Type",
          meetUrl: "Lien de réunion",
          location: "Lieu",
          timezone: "Fuseau horaire",
          notes: "Notes",
          status: "Statut",
        };

    const formatValue = (field: string, value: any): string => {
      if (value === null || value === undefined || value === "") return "—";
      if (field === "scheduledAt") {
        try {
          return new Intl.DateTimeFormat(isEn ? "en-US" : "fr-FR", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(value));
        } catch {
          return String(value);
        }
      }
      if (field === "durationMin") return isEn ? `${value} min` : `${value} min`;
      if (field === "type") return this.interviewTypeLabel(value);
      return String(value);
    };

    return Object.entries(changes)
      .map(([field, change]) => {
        const label = fieldLabels[field] || field;
        return `${label}: ${formatValue(field, change.from)} → ${formatValue(field, change.to)}`;
      })
      .join(" · ");
  }

  private statusLabel(status: string | undefined, isEn: boolean): string {
    if (!status) return "?";
    const labelsFr: Record<string, string> = {
      PENDING: "En attente",
      REVIEWED: "Examinée",
      ACCEPTED: "Acceptée",
      REJECTED: "Rejetée",
      CANCELED: "Annulée",
    };
    const labelsEn: Record<string, string> = {
      PENDING: "Pending",
      REVIEWED: "Reviewed",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
      CANCELED: "Canceled",
    };
    return (isEn ? labelsEn : labelsFr)[status] || status;
  }

  private interviewTypeLabel(type: string): string {
    const isEn = this.isEnglish;
    const labels: Record<string, string> = isEn
      ? {
          GOOGLE_MEET: "Google Meet",
          DAILY_VIDEO_CALL: "Video call",
          IN_PERSON: "In person",
        }
      : {
          GOOGLE_MEET: "Google Meet",
          DAILY_VIDEO_CALL: "Appel vidéo",
          IN_PERSON: "En présentiel",
        };
    return labels[type] || type;
  }

  private humanizeType(type?: string): string {
    if (!type) return "";
    return type
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/^./, (c) => c.toUpperCase());
  }
}
