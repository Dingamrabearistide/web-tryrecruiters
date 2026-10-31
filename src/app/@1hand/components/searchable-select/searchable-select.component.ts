import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

/** Generic searchable dropdown for plain string options (region, city, ...),
 * styled to match app-country-select so every location field in a form
 * looks consistent instead of mixing it with native <select> elements. */
@Component({
  selector: "app-searchable-select",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./searchable-select.component.html",
  styleUrls: ["./searchable-select.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true,
    },
  ],
})
export class SearchableSelectComponent implements ControlValueAccessor {
  @Input() placeholder = "";
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingLabel = "Loading...";
  /** Accepts plain strings or { label, value } pairs (the shape used by
   * the "select" field type elsewhere in the app) so callers don't need
   * a separate normalization step — which, if done via a function call
   * in the template, allocates a new array every change-detection cycle
   * and fights with this setter resetting `filtered`, breaking the
   * search box the moment the user types. */
  @Input() set options(value: (string | { label?: string; value?: string })[] | null | undefined) {
    this._options = (value || []).map((o) =>
      typeof o === "string" ? o : (o?.value ?? o?.label ?? ""),
    );
    this.filtered = this._options;
  }
  get options(): string[] {
    return this._options;
  }

  private _options: string[] = [];
  filtered: string[] = [];
  selected: string | null = null;
  isOpen = false;
  searchQuery = "";

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  writeValue(value: string): void {
    this.selected = value || null;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(event?: Event): void {
    // Stops this click from also being re-seen by onDocumentMouseDown below
    // — without it, a wrapping element (e.g. a native <label>, which treats
    // this trigger as its implicit associated control) can forward a second
    // synthetic click here, toggling twice and netting out to "stayed open".
    event?.stopPropagation();
    if (this.disabled || this.loading) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = "";
      this.filtered = this._options;
    }
    this.onTouched();
  }

  select(option: string): void {
    this.selected = option;
    this.isOpen = false;
    this.onChange(option);
    this.onTouched();
  }

  onSearch(query: string): void {
    const q = query.toLowerCase();
    this.filtered = this._options.filter((o) => o.toLowerCase().includes(q));
  }

  // mousedown, not click: fires before the click (and before whatever a
  // wrapping element might do with it), so closing here can't race with
  // toggle()/select() above.
  @HostListener("document:mousedown", ["$event"])
  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
