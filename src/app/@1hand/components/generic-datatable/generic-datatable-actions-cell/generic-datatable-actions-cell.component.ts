import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { AuthService } from "@modules/auth/auth.service";
import { Role } from "@modules/auth/auth.types";

@Component({
  selector: 'app-generic-datatable-actions-cell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './generic-datatable-actions-cell.component.html',
  styleUrl: './generic-datatable-actions-cell.component.scss',
})
export class GenericDatatableActionsCellComponent<T = any> {
  @Input() item!: T;
  @Input() canView?: boolean = false;
  @Input() canEdit?: boolean = false;
  @Input() canDelete?: boolean = false;
  @Input() currentStatus?: string; // For admin actions visibility
  @Input() isProcessing?: boolean = false; // Loading state for admin actions
  @Input() enableRecruiterPlanActions?: boolean = false;

  @Output() view = new EventEmitter<T>();
  @Output() edit = new EventEmitter<T>();
  @Output() delete = new EventEmitter<T>();
  @Output() approve = new EventEmitter<T>();
  @Output() reject = new EventEmitter<T>();
  @Output() revoke = new EventEmitter<T>();
  @Output() republish = new EventEmitter<T>();
  @Output() submit = new EventEmitter<T>();
  @Output() assignUnlimited = new EventEmitter<T>();
  @Output() deactivatePlans = new EventEmitter<T>();

  isAdmin = false;

  constructor(private authService: AuthService) {
    const userRole = this.authService.getRole();
    this.isAdmin = userRole === Role.PLATFORM_ADMIN || userRole === Role.SUPER_ADMIN;
  }

  onView() {
    this.view.emit(this.item);
  }

  onEdit() {
    this.edit.emit(this.item);
  }

  onDelete() {
    this.delete.emit(this.item);
  }

  onApprove() {
    this.approve.emit(this.item);
  }

  onReject() {
    this.reject.emit(this.item);
  }

  onRevoke() {
    this.revoke.emit(this.item);
  }

  onRepublish() {
    this.republish.emit(this.item);
  }

  onSubmit() {
    this.submit.emit(this.item);
  }

  shouldShowApproveReject(): boolean {
    return this.isAdmin && this.currentStatus === 'PENDING';
  }

  shouldShowRevoke(): boolean {
    return this.isAdmin && this.currentStatus === 'ACTIVE';
  }

  shouldShowRepublish(): boolean {
    const anyItem: any = this.item as any;
    return anyItem?.status === 'EXPIRED';
  }

  shouldShowSubmit(): boolean {
    const anyItem: any = this.item as any;
    return anyItem?.status === 'DRAFT';
  }

  isRecruiter(): boolean {
    const anyItem: any = this.item as any;
    return anyItem?.role === 'RECRUITER' && !!anyItem?.recruiter?.id;
  }

  onAssignUnlimited() {
    this.assignUnlimited.emit(this.item);
  }

  onDeactivatePlans() {
    this.deactivatePlans.emit(this.item);
  }
}
