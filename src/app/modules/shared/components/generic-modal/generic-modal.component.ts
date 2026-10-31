import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";

export interface ModalConfig {
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
}

@Component({
  standalone: false,

  selector: "app-generic-modal2",
  templateUrl: "./generic-modal.component.html",
  styleUrls: ["./generic-modal.component.scss"],
})
export class GenericModalComponent2 implements OnInit {
  @Input() isOpen: boolean = false;
  @Input() config: ModalConfig = {};

  @Output() onClose = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  defaultConfig: ModalConfig = {
    title: "",
    size: "md",
    showCloseButton: true,
    closeOnBackdropClick: true,
    showFooter: true,
    confirmText: "Confirmer",
    cancelText: "Annuler",
    confirmButtonClass: "bg-blue-500 hover:bg-blue-600 text-white",
    cancelButtonClass: "bg-gray-300 hover:bg-gray-400 text-gray-700",
  };

  modalConfig: ModalConfig = {};

  ngOnInit(): void {
    this.modalConfig = { ...this.defaultConfig, ...this.config };
  }

  close(): void {
    this.isOpen = false;
    this.onClose.emit();
  }

  confirm(): void {
    this.onConfirm.emit();
  }

  cancel(): void {
    this.onCancel.emit();
  }

  onBackdropClick(): void {
    if (this.modalConfig.closeOnBackdropClick) {
      this.close();
    }
  }

  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  getSizeClass(): string {
    switch (this.modalConfig.size) {
      case "sm":
        return "max-w-sm";
      case "md":
        return "max-w-md";
      case "lg":
        return "max-w-lg";
      case "xl":
        return "max-w-xl";
      default:
        return "max-w-md";
    }
  }
}
