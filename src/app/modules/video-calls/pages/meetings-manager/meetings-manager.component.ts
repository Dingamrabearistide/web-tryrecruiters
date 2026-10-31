import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { DailyService } from "../../daily.service";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";

interface MeetingRoom {
  name: string;
  url: string;
  createdAt: Date;
  expiresAt?: Date;
  config: {
    privacy: "public" | "private";
    maxParticipants: number;
    enableScreenshare: boolean;
    enableChat: boolean;
  };
}

interface ToastMessage {
  message: string;
  type: "success" | "error";
}

@Component({
  selector: "app-meetings-manager",
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  templateUrl: "./meetings-manager.component.html",
  styleUrls: ["./meetings-manager.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class MeetingsManagerComponent implements OnInit {
  meetings: MeetingRoom[] = [];
  isLoading = false;
  isCreating = false;
  toast: ToastMessage | null = null;

  // Configuration par défaut
  roomConfig = {
    privacy: "public" as "public" | "private",
    maxParticipants: 50, // Augmenté à 50 pour supporter plus de participants
    enableScreenshare: true,
    enableChat: true,
  };

  constructor(
    private dailyService: DailyService,
    private router: Router,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.isLoading = true;
    this.dailyService.listRooms(20).subscribe({
      next: (response: any) => {
        this.meetings =
          response.data?.map((room: any) => ({
            name: room.name,
            url: room.url,
            createdAt: new Date(room.created_at * 1000),
            config: {
              privacy: room.privacy,
              maxParticipants: room.config?.max_participants || 50, // Fallback augmenté à 50
              enableScreenshare: room.config?.enable_screenshare !== false,
              enableChat: room.config?.enable_chat !== false,
            },
          })) || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error loading meetings:", error);
        this.showToast(
          this.transloco.translate("videoCall.meetingsManager.errorLoading"),
          "error"
        );
        this.isLoading = false;
      },
    });
  }

  createMeeting(): void {
    this.isCreating = true;
    const roomName = `meeting-${Date.now()}`;

    this.dailyService
      .createRoom({
        name: roomName,
        privacy: this.roomConfig.privacy,
        enableScreenshare: this.roomConfig.enableScreenshare,
        enableChat: this.roomConfig.enableChat,
        maxParticipants: this.roomConfig.maxParticipants,
      })
      .subscribe({
        next: (response: any) => {
          const newMeeting: MeetingRoom = {
            name: response.name,
            url: response.url,
            createdAt: new Date(),
            config: this.roomConfig,
          };

          this.meetings.unshift(newMeeting);
          this.showToast(
            this.transloco.translate("videoCall.meetingsManager.meetingCreated"),
            "success"
          );
          this.isCreating = false;
        },
        error: (error) => {
          console.error("Error creating meeting:", error);
          this.showToast(
            this.transloco.translate("videoCall.meetingsManager.errorCreating"),
            "error"
          );
          this.isCreating = false;
        },
      });
  }

  copyLink(url: string, event: Event): void {
    event.stopPropagation();
    navigator.clipboard.writeText(url).then(
      () => {
        this.showToast(
          this.transloco.translate("videoCall.linkCopied"),
          "success"
        );
      },
      (err) => {
        console.error("Could not copy text: ", err);
        this.showToast(
          this.transloco.translate("videoCall.errorCopyingLink"),
          "error"
        );
      }
    );
  }

  deleteMeeting(roomName: string, event: Event): void {
    event.stopPropagation();

    if (!confirm(this.transloco.translate("videoCall.meetingsManager.confirmDelete"))) {
      return;
    }

    this.dailyService.deleteRoom(roomName).subscribe({
      next: () => {
        this.meetings = this.meetings.filter((m) => m.name !== roomName);
        this.showToast(
          this.transloco.translate("videoCall.meetingsManager.meetingDeleted"),
          "success"
        );
      },
      error: (error) => {
        console.error("Error deleting meeting:", error);
        this.showToast(
          this.transloco.translate("videoCall.meetingsManager.errorDeleting"),
          "error"
        );
      },
    });
  }

  openMeeting(url: string, name?: string): void {
    // Navigation interne vers la page de call
    this.router.navigate(["/meetings/call-rooms"], {
      queryParams: {
        url: url,
        name: name || "Meeting",
      },
    });
  }

  private showToast(message: string, type: "success" | "error"): void {
    this.toast = { message, type };
    setTimeout(() => {
      this.toast = null;
    }, 3000);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
