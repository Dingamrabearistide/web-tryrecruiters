import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Country, GeoService } from "../../../core/services/geo.service";

@Component({
  selector: "app-country-select",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./country-select.component.html",
  styleUrls: ["./country-select.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CountrySelectComponent),
      multi: true,
    },
  ],
})
export class CountrySelectComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = "Country";
  @Input() disabled = false;

  countries: Country[] = [];
  filtered: Country[] = [];
  selected: Country | null = null;
  isOpen = false;
  searchQuery = "";

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  /** writeValue() can run before the async country list below has
   * loaded (e.g. opening an edit form right after navigation) — when
   * that happens `this.countries` is still empty so the match silently
   * fails and `selected` is left null forever, since Angular only calls
   * writeValue() again if the control's VALUE changes, not when this
   * list finishes loading. Keeping the last value here lets it be
   * re-resolved once the countries actually arrive. */
  private pendingValue: string | null = null;

  constructor(
    private geoService: GeoService,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {
    this.geoService.getCountriesWithFlags().subscribe({
      next: (countries) => {
        this.countries = countries;
        this.filtered = countries;
        if (this.pendingValue) {
          this.writeValue(this.pendingValue);
        }
      },
    });
  }

  // ControlValueAccessor
  writeValue(value: string): void {
    this.pendingValue = value || null;
    if (value && this.countries.length) {
      this.selected = this.countries.find((c) => c.name === value) ?? null;
    } else if (!value) {
      this.selected = null;
    }
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
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = "";
      this.filtered = this.countries;
    }
    this.onTouched();
  }

  select(country: Country): void {
    this.selected = country;
    this.isOpen = false;
    this.onChange(country.name);
    this.onTouched();
  }

  onSearch(query: string): void {
    const q = query.toLowerCase();
    this.filtered = this.countries.filter((c) =>
      c.name.toLowerCase().includes(q),
    );
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
