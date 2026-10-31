import { AfterViewChecked, Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";

interface CountUpStat {
  target: number;
  current: number;
}

const COUNT_UP_DURATION_MS = 1500;

@Component({
  standalone: false,

  selector: "app-about-page",
  templateUrl: "./about-page.component.html",
  styleUrls: ["./about-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class AboutPageComponent implements AfterViewChecked, OnDestroy {
  @ViewChild("statsSection") statsSection?: ElementRef<HTMLElement>;

  stats: CountUpStat[] = [
    { target: 500, current: 0 },
    { target: 120, current: 0 },
    { target: 10000, current: 0 },
  ];

  private observer?: IntersectionObserver;
  private animationFrameId?: number;
  private observerInitialized = false;

  ngAfterViewChecked(): void {
    // The *transloco structural directive defers rendering the template
    // until translations resolve, so #statsSection isn't available on the
    // first ngAfterViewInit pass — watch for it to actually appear instead.
    if (this.observerInitialized || !this.statsSection) {
      return;
    }
    this.observerInitialized = true;

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          this.animateStats();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    this.observer.observe(this.statsSection.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    if (this.animationFrameId !== undefined) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  formatStat(stat: CountUpStat): string {
    const value = Math.round(stat.current);
    const formatted =
      value >= 1000 ? `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k` : `${value}`;
    return `${formatted}+`;
  }

  private animateStats(): void {
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / COUNT_UP_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      this.stats.forEach((stat) => {
        stat.current = stat.target * eased;
      });

      if (progress < 1) {
        this.animationFrameId = requestAnimationFrame(tick);
      }
    };

    this.animationFrameId = requestAnimationFrame(tick);
  }
}
