import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
  ViewChild,
  forwardRef,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

export interface ComboOption {
  value: string;
  label: string;
}

@Component({
  standalone: false,
  selector: "app-multi-select-combobox",
  templateUrl: "./multi-select-combobox.component.html",
  styleUrls: ["./multi-select-combobox.component.scss"],
})
export class MultiSelectComboboxComponent {
  @Input() placeholder = "Select";
  @Input() options: ComboOption[] = [];
  @Input() selectedValues: string[] = [];
  @Input() single = false; // if true, behaves as single-select
  @Output() selectionChange = new EventEmitter<string[]>();

  isOpen = false;
  searchQuery = "";

  @ViewChild("searchInput") searchInput: ElementRef<HTMLInputElement> | null =
    null;

  constructor(private elementRef: ElementRef) {}

  get selectedItems(): ComboOption[] {
    return this.options.filter((o) => this.selectedValues.includes(o.value));
  }

  get displayPlaceholder(): string {
    return this.selectedValues.length > 0 ? '' : this.placeholder;
  }

  get visibleChips(): ComboOption[] {
    return this.selectedItems.slice(0, 2);
  }

  get remainingCount(): number {
    return Math.max(0, this.selectedValues.length - 2);
  }

  get filteredOptions(): ComboOption[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.options;
    return this.options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
    );
  }

  isSelected(value: string): boolean {
    return this.selectedValues.includes(value);
  }

  toggleOption(option: ComboOption): void {
    if (this.single) {
      const newVal = this.isSelected(option.value) ? [] : [option.value];
      this.selectedValues = newVal;
      this.selectionChange.emit(newVal);
      this.close();
    } else {
      if (this.isSelected(option.value)) {
        this.selectedValues = this.selectedValues.filter(
          (v) => v !== option.value,
        );
      } else {
        this.selectedValues = [...this.selectedValues, option.value];
      }
      this.selectionChange.emit(this.selectedValues);
    }
  }

  removeValue(value: string, event: Event): void {
    event.stopPropagation();
    this.selectedValues = this.selectedValues.filter((v) => v !== value);
    this.selectionChange.emit(this.selectedValues);
  }

  clearAll(): void {
    this.selectedValues = [];
    this.searchQuery = "";
    this.selectionChange.emit([]);
  }

  open(): void {
    this.isOpen = true;
    this.searchQuery = "";
    setTimeout(() => this.searchInput?.nativeElement?.focus(), 50);
  }

  close(): void {
    this.isOpen = false;
    this.searchQuery = "";
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
