import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { VideoCallComponent } from "../../components/video-call/video-call.component";
import { DailyService } from "../../daily.service";
import { DailyCallOptions } from "../../video-calls.types";
import {
  Translation,
  TRANSLOCO_SCOPE,
  TranslocoModule,
  TranslocoService,
} from "@ngneat/transloco";
import { SupportedLanguages } from "../../../../transloco-loader";
import { LanguageSwitcherComponent } from "@modules/core/components/language-switcher.component";

export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce(
    (acc, lang) => {
      acc[lang] = () => import(`../../i18n/${lang}.json`);
      return acc;
    },
    {} as Record<string, () => Promise<Translation>>,
  );

@Component({
  selector: "app-call-room",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    VideoCallComponent,
    TranslocoModule,
    LanguageSwitcherComponent,
  ],
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
  templateUrl: "./call-room.component.html",
  styleUrls: [
    "./call-room.component.scss",
    "../../../../../styles/legacy-styles.css",
  ],
})
export class CallRoomComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("videoCall") videoCall!: VideoCallComponent;

  callOptions?: DailyCallOptions;
  isLoading = true;
  error: string | null = null;
  roomUrl: string = "";
  roomName: string = "";

  // Pour les utilisateurs non connectés
  needsUserName = false;
  guestName: string = "";
  isJoining = false;

  // Toast pour feedback
  showToast = false;
  toastMessage = "";
  toastType: "success" | "error" = "success";
  private warningBannerInterval?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dailyService: DailyService,
    private authService: AuthService,
    private transloco: TranslocoService,
  ) {}

  ngOnInit(): void {
    // Récupérer l'URL de la room depuis les query params
    this.route.queryParams.subscribe((params) => {
      this.roomUrl = params["url"] || "";
      this.roomName = params["name"] || "Meeting";

      if (!this.roomUrl) {
        this.error = this.transloco.translate(
          "videoCall.errors.missingMeetingUrl",
        );
        this.isLoading = false;
        return;
      }

      this.initializeCall();
    });
  }

  ngAfterViewInit(): void {
    const marquee = document.querySelector(
      ".warning-banner",
    ) as HTMLElement | null;

    if (marquee) {
      marquee.style.display = "none";
    }
  }

  ngOnDestroy(): void {
    this.restoreGlobalWarningBanner();
    document.body.classList.remove("tr-call-active");

    const marquee = document.querySelector(
      ".warning-banner",
    ) as HTMLElement | null;

    if (marquee) {
      marquee.style.display = "block";
    }
  }

  private initializeCall(): void {
    const userName = this.getUserName();

    // Si pas de nom d'utilisateur, demander
    if (!userName) {
      this.needsUserName = true;
      this.isLoading = false;
      return;
    }

    // Créer les options du call
    this.callOptions = {
      roomUrl: this.roomUrl,
      userName: userName,
      startVideoOff: false,
      startAudioOff: false,
    };

    this.hideGlobalWarningBanner();
    this.isLoading = false;
  }

  private getUserName(): string {
    // Vérifier si l'utilisateur est connecté
    const user = this.authService.getUser();

    if (user) {
      // Utilisateur authentifié - construire le nom
      const firstName =
        (user as any).firstName || (user as any).firstName || "";
      const lastName = (user as any).lastName || (user as any).lastName || "";
      const fullName = `${firstName} ${lastName}`.trim();

      // Si on a un nom, le retourner, sinon utiliser l'email ou username
      if (fullName) return fullName;
      if ((user as any).email) return (user as any).email;
      if ((user as any).username) return (user as any).username;
    }

    // Utilisateur non authentifié - utiliser le nom invité si fourni
    return this.guestName.trim();
  }

  joinAsGuest(): void {
    if (!this.guestName.trim()) {
      this.error = this.transloco.translate("videoCall.enterName");
      return;
    }

    this.isJoining = true;
    this.error = null;

    // Initialiser le call avec le nom invité
    this.callOptions = {
      roomUrl: this.roomUrl,
      userName: this.guestName.trim(),
      startVideoOff: false,
      startAudioOff: false,
    };

    this.hideGlobalWarningBanner();
    this.needsUserName = false;
    this.isJoining = false;
  }

  shareLink(): void {
    if (!this.roomUrl) return;

    // Créer le lien de l'application Angular (pas le lien Daily.co direct)
    const appUrl = window.location.origin; // Ex: http://localhost:4200 ou https://your-app.com
    const callPath = `/meetings/call-rooms`;
    const queryParams = `?url=${encodeURIComponent(
      this.roomUrl,
    )}&name=${encodeURIComponent(this.roomName)}`;
    const fullAppLink = `${appUrl}${callPath}${queryParams}`;

    navigator.clipboard.writeText(fullAppLink).then(
      () => {
        this.displayToast(
          this.transloco.translate("videoCall.linkCopied"),
          "success",
        );
      },
      (err) => {
        console.error("Could not copy text:", err);
        this.displayToast(
          this.transloco.translate("videoCall.errorCopyingLink"),
          "error",
        );
      },
    );
  }

  private displayToast(message: string, type: "success" | "error"): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  goBack(): void {
    this.restoreGlobalWarningBanner();
    document.body.classList.remove("tr-call-active");
    this.router.navigate(["/meetings"]);
  }

  private hideGlobalWarningBanner(): void {
    document.body.classList.add("tr-call-active");
    this.ensureGlobalCallStyle();
    this.applyWarningBannerVisibility();

    window.clearInterval(this.warningBannerInterval);
    this.warningBannerInterval = window.setInterval(() => {
      this.applyWarningBannerVisibility();
    }, 500);
  }

  private ensureGlobalCallStyle(): void {
    if (document.getElementById("tr-call-global-style")) return;

    const style = document.createElement("style");
    style.id = "tr-call-global-style";
    style.textContent = `
      body.tr-call-active marquee,
      body.tr-call-active .warning-marquee,
      body.tr-call-active [data-warning-marquee] {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  private applyWarningBannerVisibility(): void {
    const candidates = Array.from(
      document.querySelectorAll<HTMLElement>(
        "marquee, .warning-marquee, [data-warning-marquee]",
      ),
    );

    candidates.forEach((element) => {
      const text = element.textContent?.toLowerCase() || "";
      const isServiceWarning =
        text.includes("warning") ||
        text.includes("scam") ||
        text.includes("all our services") ||
        text.includes("100% free") ||
        element.matches(".warning-marquee, [data-warning-marquee]");

      if (!isServiceWarning) return;

      if (!element.dataset["trHiddenDuringCall"]) {
        element.dataset["trPreviousDisplay"] = element.style.display || "";
        element.dataset["trHiddenDuringCall"] = "true";
      }

      element.style.display = "none";
    });
  }

  private restoreGlobalWarningBanner(): void {
    window.clearInterval(this.warningBannerInterval);
    this.warningBannerInterval = undefined;

    const hiddenElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-tr-hidden-during-call='true']",
      ),
    );

    hiddenElements.forEach((element) => {
      element.style.display = element.dataset["trPreviousDisplay"] || "";
      delete element.dataset["trPreviousDisplay"];
      delete element.dataset["trHiddenDuringCall"];
    });
  }

  // Methods for video call controls
  async toggleCamera(): Promise<void> {
    if (this.videoCall) {
      await this.videoCall.toggleCamera();
    }
  }

  async toggleMicrophone(): Promise<void> {
    if (this.videoCall) {
      await this.videoCall.toggleMicrophone();
    }
  }

  async toggleScreenShare(): Promise<void> {
    if (this.videoCall) {
      await this.videoCall.toggleScreenShare();
    }
  }

  async leaveCall(): Promise<void> {
    if (this.videoCall) {
      await this.videoCall.leaveCall();
    }
    this.restoreGlobalWarningBanner();
    document.body.classList.remove("tr-call-active");
    // Navigate back after a short delay
    setTimeout(() => {
      this.router.navigate(["/meetings"]);
    }, 500);
  }
}
