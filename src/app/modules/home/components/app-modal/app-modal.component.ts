import { Component, Inject, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type ModalType = 'confirm' | 'alert' | 'form' | 'custom';
export type ModalSize = 'small' | 'medium' | 'large' | 'xlarge' | 'full';

export interface AppModalData {
  title?: string;
  message?: string;
  type?: ModalType;
  size?: ModalSize;
  confirmText?: string;
  cancelText?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  data?: any;
  formGroup?: any;
  contentTemplate?: TemplateRef<any>;
}

@Component({
  standalone: false,

  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  styleUrls: ['./app-modal.component.scss']
})
export class AppModalComponent {
  @Input() data!: AppModalData;
  @Output() confirmed = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<AppModalComponent>,
    @Inject(MAT_DIALOG_DATA) public modalData: AppModalData
  ) {
    this.data = modalData;
  }

  get sizeClass(): string {
    switch (this.data.size) {
      case 'small': return 'max-w-md';
      case 'large': return 'max-w-2xl';
      case 'xlarge': return 'max-w-4xl';
      case 'full': return 'max-w-[95vw] max-h-[95vh]';
      default: return 'max-w-lg';
    }
  }

  onConfirm() {
    this.confirmed.emit(this.data.formGroup ? this.data.formGroup.value : true);
    this.dialogRef.close('confirmed');
  }

  onCancel() {
    this.cancelled.emit();
    this.dialogRef.close('cancelled');
  }

  onClose() {
    this.dialogRef.close();
  }
}
