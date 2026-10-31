import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslocoModule } from "@ngneat/transloco";

@Component({
  selector: "app-warning-banner",
  standalone: true,
  imports: [CommonModule, TranslocoModule],
  template: `
    <div class="warning-banner">
      <div class="warning-banner-content">
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">
          {{ "warningBanner.message" | transloco }}
        </span>
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">
          {{ "warningBanner.message" | transloco }}
        </span>
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">
          {{ "warningBanner.message" | transloco }}
        </span>
      </div>
    </div>
  `,
  styles: [
    `
      .warning-banner {
        background: linear-gradient(
          90deg,
          #ff5173 0%,
          #f06363 50%,
          #ff5173 100%
        );
        color: white;
        padding: 0.5rem 0;
        overflow: hidden;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        opacity: 0.85;
        transition: opacity 0.3s ease;
      }

      .warning-banner:hover {
        opacity: 0.5;
      }

      .warning-banner-content {
        display: flex;
        align-items: center;
        gap: 2rem;
        animation: scroll 30s linear infinite;
        white-space: nowrap;
      }

      .warning-text {
        font-weight: 600;
        font-size: 0.8rem;
        letter-spacing: 0.025em;
      }

      .warning-icon {
        font-size: 1rem;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes scroll {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      @keyframes pulse {
        0%,
        100% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
      }

      @media (max-width: 768px) {
        .warning-text {
          font-size: 0.75rem;
        }

        .warning-icon {
          font-size: 0.9rem;
        }
      }
    `,
  ],
})
export class WarningBannerComponent {}
