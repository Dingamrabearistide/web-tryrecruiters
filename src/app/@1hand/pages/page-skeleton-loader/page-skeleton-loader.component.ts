import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-page-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-skeleton-loader.component.html',
  styleUrls: ['./page-skeleton-loader.component.scss'],
})
export class PageSkeletonLoaderComponent {
  @Input() displayMode: "list" | "grid" = "grid";
  @Input() itemCount: number = 6;
  @Input() showSidebar = false;

  get skeletonArray(): number[] {
    return Array(this.itemCount).fill(0);
  }
}
