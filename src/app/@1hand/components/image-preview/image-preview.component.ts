import {
  Component,
  Input,
  HostListener,
  OnDestroy,
  ChangeDetectionStrategy,
} from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-image-preview",
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./image-preview.component.html",
})
export class ImagePreviewComponent implements OnDestroy {
  /** Source de l'image (obligatoire) */
  @Input() src!: string;

  /** Texte alternatif */
  @Input() alt?: string;

  /** Titre dans l'en-tête de la modal */
  @Input() title?: string;

  /** Nom du fichier en téléchargement */
  @Input() downloadName?: string;

  /** Classes Tailwind appliquées à la vignette */
  @Input() class?: string;

  /** Largeur/hauteur (facultatif) pour la vignette */
  @Input() width?: number;
  @Input() height?: number;

  /** Hauteur max (px) du contenu de la modal */
  @Input() maxHeight = 0; // 0 = auto; sera calculé à ~ 0.9 * innerHeight si 0

  isOpen = false;
  error = false;

  // Zoom & Pan
  scale = 1;
  translateX = 0;
  translateY = 0;
  private panning = false;
  private startX = 0;
  private startY = 0;

  // Touch
  private touchStart?: { x: number; y: number };

  open() {
    if (!this.src) return;
    this.isOpen = true;
    this.lockScroll();
    // calcule maxHeight si non fourni
    if (!this.maxHeight || this.maxHeight <= 0) {
      this.maxHeight = Math.floor(window.innerHeight * 0.85);
    }
    this.reset(); // réinitialise au lancement
  }

  close() {
    this.isOpen = false;
    this.unlockScroll();
  }

  ngOnDestroy() {
    this.unlockScroll();
  }

  // ====== Zoom ======
  zoomIn(step = 0.25) {
    this.scale = Math.min(this.scale + step, 6);
  }
  zoomOut(step = 0.25) {
    this.scale = Math.max(this.scale - step, 0.25);
  }
  reset() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.panning = false;
  }

  // Molette pour zoom
  onWheel(e: WheelEvent) {
    if (!this.isOpen) return;
    e.preventDefault();
    const delta = Math.sign(e.deltaY);
    if (delta > 0) this.zoomOut(0.15);
    else this.zoomIn(0.15);
  }

  // ====== Pan souris ======
  onMouseDown(e: MouseEvent) {
    if (!this.isOpen) return;
    this.panning = true;
    this.startX = e.clientX - this.translateX;
    this.startY = e.clientY - this.translateY;
  }
  onMouseMove(e: MouseEvent) {
    if (!this.panning) return;
    this.translateX = e.clientX - this.startX;
    this.translateY = e.clientY - this.startY;
  }
  onMouseUp() {
    this.panning = false;
  }

  // ====== Pan tactile ======
  onTouchStart(ev: TouchEvent) {
    if (!this.isOpen) return;
    if (ev.touches.length === 1) {
      const t = ev.touches[0];
      this.touchStart = {
        x: t.clientX - this.translateX,
        y: t.clientY - this.translateY,
      };
    }
  }
  onTouchMove(ev: TouchEvent) {
    if (!this.touchStart || ev.touches.length !== 1) return;
    const t = ev.touches[0];
    this.translateX = t.clientX - this.touchStart.x;
    this.translateY = t.clientY - this.touchStart.y;
  }
  onTouchEnd() {
    this.touchStart = undefined;
  }

  // ====== Raccourcis clavier quand la modal est ouverte ======
  @HostListener("document:keydown", ["$event"])
  onKey(e: KeyboardEvent) {
    if (!this.isOpen) return;
    if (e.key === "Escape") this.close();
    // Optionnel : Ctrl/Cmd + +/- pour zoom
    if ((e.ctrlKey || e.metaKey) && (e.key === "=" || e.key === "+")) {
      e.preventDefault();
      this.zoomIn();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "-") {
      e.preventDefault();
      this.zoomOut();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "0") {
      e.preventDefault();
      this.reset();
    }
  }

  // ====== Scroll lock ======
  private lockScroll() {
    document.body.style.overflow = "hidden";
  }
  private unlockScroll() {
    document.body.style.overflow = "";
  }
}
