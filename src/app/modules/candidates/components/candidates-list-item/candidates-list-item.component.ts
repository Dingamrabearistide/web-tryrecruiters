import { Component, EventEmitter, Input, Output } from "@angular/core";
import { environment } from "@env/environment";
import {
  Candidate,
  CandidateExperience,
} from "@modules/candidates/candidates.types";

@Component({
  standalone: false,

  selector: "app-candidates-list-item",
  templateUrl: "./candidates-list-item.component.html",
})
export class CandidatesListItemComponent {
  @Input() item!: Candidate;

  @Output() onView: EventEmitter<Candidate> = new EventEmitter<Candidate>();
  @Output() onCall: EventEmitter<Candidate> = new EventEmitter<Candidate>();

  get firstEducation() {
    return this.item?.educations?.length ? this.item.educations[0] : undefined;
  }

  get photo() {
    return `${this.item.photo}`;
  }

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

  view() {
    this.onView.emit(this.item);
  }

  call() {
    this.onCall.emit(this.item);
  }

  calculateExperienceYears(experiences: CandidateExperience[]): number {
    if (!experiences?.length) return 0;

    let totalMonths = 0;

    for (const exp of experiences) {
      const start = new Date(exp.startDate);
      const end = exp.endDate ? new Date(exp.endDate) : new Date();
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      totalMonths += Math.max(months, 0);
    }

    return Math.floor(totalMonths / 12);
  }
}
