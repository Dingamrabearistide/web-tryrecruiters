import { CommonModule } from "@angular/common";
import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import DailyIframe, {
  DailyCall,
  DailyEventObjectFatalError,
} from "@daily-co/daily-js";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
} from "@ngneat/transloco";
import { DailyCallOptions } from "../../video-calls.types";
import { SupportedLanguages } from "../../../../transloco-loader";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce(
    (acc, lang) => {
      acc[lang] = () => import(`../../i18n/${lang}.json`);
      return acc;
    },
    {} as Record<string, () => Promise<Translation>>,
  );
export interface CustomDailyParticipant {
  id: string;
  name: string;
  local: boolean;
  owner: boolean;
  joinedAt?: Date;
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  videoStream: MediaStream | null;
  audioStream: MediaStream | null;
  screenStream: MediaStream | null;
}

export interface CustomDailyMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  local: boolean;
}

type SidebarTab = "people" | "chat";

@Component({
  selector: "app-video-call",
  standalone: true,
  imports: [CommonModule, FormsModule, TranslocoModule],
  providers: [
    {
      multi: true,
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: "videoCall",
        loader,
      },
    },
  ],
  templateUrl: "./video-call.component.html",
  styleUrls: [
    "./video-call.component.scss",
    "../../../../../styles/legacy-styles.css",
  ],
})
export class VideoCallComponent implements OnInit, OnDestroy {
  @Input() callOptions!: DailyCallOptions;

  callObject: DailyCall | null = null;
  isJoined = false;
  isLoading = true;
  error: string | null = null;
  participants: CustomDailyParticipant[] = [];
  messages: CustomDailyMessage[] = [];
  chatMessage = "";
  isCameraOn = false;
  isMicOn = false;
  isScreenSharing = false;
  isSidePanelOpen = true;
  activeSidebarTab: SidebarTab = "people";

  ngOnInit(): void {
    if (!this.callOptions?.roomUrl) {
      this.error = "errors.roomUrlRequired";
      this.isLoading = false;
      return;
    }

    this.initializeCall();
  }

  ngOnDestroy(): void {
    this.leaveCall();
  }

  private async initializeCall(): Promise<void> {
    try {
      await this.cleanupCallObject();
      this.callObject = DailyIframe.createCallObject();
      this.setupEventListeners();
      await this.joinCall(false);
    } catch (err: any) {
      if (this.isPermissionError(err)) {
        console.warn(
          "Media permissions blocked. Rejoining with camera and microphone disabled.",
          err,
        );
        await this.rejoinWithoutMedia();
        return;
      }

      console.error("Failed to initialize call:", err);
      this.error = "errors.initializeCall";
      this.isLoading = false;
    }
  }

  private setupEventListeners(): void {
    if (!this.callObject) return;

    (this.callObject as any)
      .on("joined-meeting", this.handleJoinedMeeting)
      .on("left-meeting", this.handleLeftMeeting)
      .on("participant-joined", this.updateParticipants)
      .on("participant-updated", this.updateParticipants)
      .on("participant-left", this.updateParticipants)
      .on("track-started", this.updateParticipants)
      .on("track-stopped", this.updateParticipants)
      .on("local-screen-share-started", this.updateParticipants)
      .on("local-screen-share-stopped", this.updateParticipants)
      .on("app-message", this.handleAppMessage)
      .on("error", this.handleError)
      .on("camera-error", this.handleCameraError);
  }

  private removeEventListeners(): void {
    if (!this.callObject) return;

    (this.callObject as any)
      .off("joined-meeting", this.handleJoinedMeeting)
      .off("left-meeting", this.handleLeftMeeting)
      .off("participant-joined", this.updateParticipants)
      .off("participant-updated", this.updateParticipants)
      .off("participant-left", this.updateParticipants)
      .off("track-started", this.updateParticipants)
      .off("track-stopped", this.updateParticipants)
      .off("local-screen-share-started", this.updateParticipants)
      .off("local-screen-share-stopped", this.updateParticipants)
      .off("app-message", this.handleAppMessage)
      .off("error", this.handleError)
      .off("camera-error", this.handleCameraError);
  }

  private async joinCall(forceMediaOff: boolean): Promise<void> {
    if (!this.callObject) return;

    const joinConfig: any = {
      url: this.callOptions.roomUrl,
      userName: this.callOptions.userName,
      startVideoOff: forceMediaOff || (this.callOptions.startVideoOff ?? false),
      startAudioOff: forceMediaOff || (this.callOptions.startAudioOff ?? false),
    };

    if (this.callOptions.token) {
      joinConfig.token = this.callOptions.token;
    }

    await this.callObject.join(joinConfig);
  }

  private async rejoinWithoutMedia(): Promise<void> {
    try {
      await this.cleanupCallObject();
      this.callObject = DailyIframe.createCallObject();
      this.setupEventListeners();
      await this.joinCall(true);
      this.isCameraOn = false;
      this.isMicOn = false;
      this.error = null;
    } catch (fallbackError) {
      console.error("Failed to join without media:", fallbackError);
      this.error = "errors.initializeCall";
      this.isLoading = false;
    }
  }

  private isPermissionError(err: any): boolean {
    const text =
      `${err?.name || ""} ${err?.message || ""} ${err?.type || ""}`.toLowerCase();
    return [
      "notallowederror",
      "permission",
      "permissions",
      "denied",
      "blocked",
      "camera-error",
      "mic-error",
      "microphone",
    ].some((token) => text.includes(token));
  }

  private handleJoinedMeeting = (): void => {
    this.isJoined = true;
    this.isLoading = false;
    this.error = null;
    this.syncLocalState();
    this.updateParticipants();
  };

  private handleLeftMeeting = (): void => {
    this.isJoined = false;
    this.participants = [];
  };

  private handleError = (event: DailyEventObjectFatalError | any): void => {
    console.error("Daily error:", event);

    if (this.isPermissionError(event?.error || event)) {
      this.isCameraOn = false;
      this.isMicOn = false;
      this.error = null;
      this.isLoading = false;
      this.updateParticipants();
      return;
    }

    this.error = "errors.callError";
    this.isLoading = false;
  };

  private handleCameraError = (event: any): void => {
    console.warn("Camera/Microphone permissions denied or unavailable:", event);
    this.isCameraOn = false;
    this.isMicOn = false;
    this.error = null;
    this.isLoading = false;
    this.updateParticipants();
  };

  private handleAppMessage = (event: any): void => {
    const data = event?.data;
    if (!data || data.type !== "chat-message" || !data.text) return;

    if (data.id && this.messages.some((message) => message.id === data.id))
      return;

    this.messages = [
      ...this.messages,
      {
        id: data.id || `${Date.now()}-${Math.random()}`,
        senderId: event.fromId || "remote",
        senderName: data.senderName || "Participant",
        text: data.text,
        timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
        local: false,
      },
    ];
  };

  private updateParticipants = (): void => {
    if (!this.callObject) return;

    const dailyParticipants = this.callObject.participants();

    this.participants = Object.entries(dailyParticipants).map(
      ([id, participant]: [string, any]) => {
        const videoTrack = this.getPersistentTrack(participant, "video");
        const audioTrack = this.getPersistentTrack(participant, "audio");
        const screenTrack = this.getPersistentTrack(participant, "screenVideo");

        return {
          id,
          name:
            participant?.user_name ||
            (participant?.local ? this.callOptions.userName : "Participant"),
          local: Boolean(participant?.local),
          owner: Boolean(participant?.owner),
          joinedAt: participant?.joined_at
            ? new Date(participant.joined_at)
            : undefined,
          isMicOn: this.isTrackPlayable(participant, "audio"),
          isCameraOn: this.isTrackPlayable(participant, "video"),
          isScreenSharing: this.isTrackPlayable(participant, "screenVideo"),
          videoStream: videoTrack ? new MediaStream([videoTrack]) : null,
          audioStream: audioTrack ? new MediaStream([audioTrack]) : null,
          screenStream: screenTrack ? new MediaStream([screenTrack]) : null,
        };
      },
    );

    this.syncLocalState();
  };

  private getPersistentTrack(
    participant: any,
    trackName: "audio" | "video" | "screenVideo",
  ): MediaStreamTrack | null {
    const track = participant?.tracks?.[trackName];
    return track?.persistentTrack || track?.track || null;
  }

  private isTrackPlayable(
    participant: any,
    trackName: "audio" | "video" | "screenVideo",
  ): boolean {
    const track = participant?.tracks?.[trackName];
    const mediaTrack = this.getPersistentTrack(participant, trackName);
    return Boolean(
      mediaTrack &&
      mediaTrack.readyState === "live" &&
      track?.state !== "off" &&
      track?.state !== "blocked" &&
      track?.state !== "interrupted",
    );
  }

  private syncLocalState(): void {
    if (!this.callObject) return;

    const local = this.callObject.participants()?.local as any;
    if (!local) return;

    this.isMicOn = this.isTrackPlayable(local, "audio");
    this.isCameraOn = this.isTrackPlayable(local, "video");
    this.isScreenSharing = this.isTrackPlayable(local, "screenVideo");
  }

  private async cleanupCallObject(): Promise<void> {
    if (!this.callObject) return;

    try {
      this.removeEventListeners();

      if (this.isJoined) {
        await this.callObject.leave();
      }

      await this.callObject.destroy();
    } catch (err) {
      console.warn("Error cleaning Daily call object:", err);
    } finally {
      this.callObject = null;
      this.isJoined = false;
      this.participants = [];
    }
  }

  async retry(): Promise<void> {
    this.error = null;
    this.isLoading = true;
    await this.initializeCall();
  }

  async toggleCamera(): Promise<void> {
    if (!this.callObject) return;

    const nextState = !this.isCameraOn;
    try {
      await this.callObject.setLocalVideo(nextState);
      this.isCameraOn = nextState;
    } catch (err) {
      console.warn("Unable to toggle camera:", err);
      this.isCameraOn = false;
    }
    this.updateParticipants();
  }

  async toggleMicrophone(): Promise<void> {
    if (!this.callObject) return;

    const nextState = !this.isMicOn;
    try {
      await this.callObject.setLocalAudio(nextState);
      this.isMicOn = nextState;
    } catch (err) {
      console.warn("Unable to toggle microphone:", err);
      this.isMicOn = false;
    }
    this.updateParticipants();
  }

  async toggleScreenShare(): Promise<void> {
    if (!this.callObject) return;

    try {
      if (this.isScreenSharing) {
        await this.callObject.stopScreenShare();
        this.isScreenSharing = false;
      } else {
        await this.callObject.startScreenShare();
        this.isScreenSharing = true;
      }
    } catch (err) {
      console.warn("Unable to toggle screen share:", err);
    }

    this.updateParticipants();
  }

  async toggleFullscreen(): Promise<void> {
    const element = document.querySelector(
      ".tr-main-tile",
    ) as HTMLElement | null;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await element.requestFullscreen();
    }
  }

  async leaveCall(): Promise<void> {
    await this.cleanupCallObject();
  }

  toggleSidePanel(): void {
    this.isSidePanelOpen = !this.isSidePanelOpen;
  }

  openSidePanel(tab: SidebarTab = "people"): void {
    this.activeSidebarTab = tab;
    this.isSidePanelOpen = true;
  }

  closeSidePanel(): void {
    this.isSidePanelOpen = false;
  }

  setSidebarTab(tab: SidebarTab): void {
    this.activeSidebarTab = tab;
    this.isSidePanelOpen = true;
  }

  async sendMessage(): Promise<void> {
    const text = this.chatMessage.trim();
    if (!text || !this.callObject) return;

    const local = this.localParticipant;
    const message: CustomDailyMessage = {
      id: `${Date.now()}-${Math.random()}`,
      senderId: local?.id || "local",
      senderName: local?.name || this.callOptions.userName || "You",
      text,
      timestamp: new Date(),
      local: true,
    };

    this.messages = [...this.messages, message];
    this.chatMessage = "";

    await (this.callObject as any).sendAppMessage(
      {
        type: "chat-message",
        id: message.id,
        senderName: message.senderName,
        text: message.text,
        timestamp: message.timestamp.toISOString(),
      },
      "*",
    );
  }

  get participantCount(): number {
    return this.participants.length;
  }

  get localParticipant(): CustomDailyParticipant | undefined {
    return this.participants.find((participant) => participant.local);
  }

  get remoteParticipants(): CustomDailyParticipant[] {
    return this.participants.filter((participant) => !participant.local);
  }

  get screenShareParticipant(): CustomDailyParticipant | undefined {
    return this.participants.find((participant) => participant.isScreenSharing);
  }

  get hasScreenShare(): boolean {
    return Boolean(this.screenShareParticipant);
  }

  get mainParticipant(): CustomDailyParticipant | undefined {
    // Google Meet-like behaviour:
    // - when someone shares their screen, that same participant tile becomes the main stage;
    // - otherwise, everyone stays in the same responsive grid, so enabling camera
    //   does not create a second visual hierarchy/card.
    return this.screenShareParticipant;
  }

  get tiledParticipants(): CustomDailyParticipant[] {
    return this.participants;
  }

  get secondaryParticipants(): CustomDailyParticipant[] {
    const mainId = this.mainParticipant?.id;
    return this.participants.filter((participant) => participant.id !== mainId);
  }

  get displayParticipants(): CustomDailyParticipant[] {
    // In Google Meet-like screen-share mode, the shared screen is the main stage
    // and every webcam/avatar stays as a compact filmstrip tile. This includes
    // the screen sharer when their camera is enabled, instead of creating a
    // second large card or removing them from the strip.
    if (this.hasScreenShare) {
      return this.participants.slice(0, 6);
    }

    return this.secondaryParticipants.slice(0, 6);
  }

  trackByParticipantId(_: number, participant: CustomDailyParticipant): string {
    return participant.id;
  }

  trackByMessageId(_: number, message: CustomDailyMessage): string {
    return message.id;
  }
}
