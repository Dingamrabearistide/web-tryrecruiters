import { Component, Input } from "@angular/core";
import { Candidate } from "@modules/candidates/candidates.types";

@Component({
  standalone: false,

  selector: "app-candidates-details2",
  templateUrl: "./candidates-details2.component.html",
  styleUrls: ["./candidates-details2.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesDetails2Component {
  @Input() item!: Candidate;

  showMoreStates: Record<string, boolean> = {};
  photoFailed = false;

  get hasPhoto(): boolean {
    if (this.photoFailed) return false;
    const p = this.item?.photo;
    return !!p && p.trim() !== '' && p !== 'null' && p !== 'undefined';
  }

  get initials(): string {
    const first = this.item?.firstName?.trim() || '';
    const last = this.item?.lastName?.trim() || '';
    if (first && last) return (first[0] + last[0]).toUpperCase();
    if (first) return first.substring(0, 2).toUpperCase();
    if (last) return last.substring(0, 2).toUpperCase();
    return '?';
  }

  get avatarColor(): string {
    const name = `${this.item?.firstName || ''}${this.item?.lastName || ''}`;
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
      'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  onImageError(): void {
    this.photoFailed = true;
  }

  toggleDetails(key: string): void {
    this.showMoreStates[key] = !this.showMoreStates[key];
  }

  openCallModal() {
    //
  }
}
