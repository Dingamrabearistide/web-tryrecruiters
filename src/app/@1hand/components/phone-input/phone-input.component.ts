import {
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
} from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PhoneCountry } from "../../data/phone-country.model";
import { PHONE_COUNTRIES } from "../../data/phone-countries.data";
import { PhoneNumberUtil } from "google-libphonenumber";

const phoneUtil = PhoneNumberUtil.getInstance();

/** Replaces ngx-intl-tel-input app-wide: that library's country search only
 * scrolls to the first alphabetical match instead of filtering the list
 * (confirmed in its source — `searchCountry()` calls `scrollIntoView`, it
 * never reassigns the rendered array), which made typing a country name
 * mostly useless. This component reuses the same country data (extracted
 * from that library, including the Ivory Coast naming fix already applied
 * there) but with the same real search-filters-the-list behavior already
 * used everywhere else in the app (app-country-select, app-searchable-select).
 * Emits a plain E.164 string (e.g. "+237690000000"), matching what every
 * existing `formData.phoneNumber?.e164Number ?? formData.phoneNumber`
 * call site already falls back to. */
@Component({
  selector: "app-phone-input",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./phone-input.component.html",
  styleUrls: ["./phone-input.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInputComponent),
      multi: true,
    },
  ],
})
export class PhoneInputComponent implements ControlValueAccessor, OnInit {
  @Input() placeholder = "";
  @Input() disabled = false;
  @Input() defaultIso2 = "cm";

  countries: PhoneCountry[] = PHONE_COUNTRIES;
  filtered: PhoneCountry[] = PHONE_COUNTRIES;
  selectedCountry: PhoneCountry | null = null;
  nationalNumber = "";
  isOpen = false;
  searchQuery = "";

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    if (!this.selectedCountry) {
      this.selectedCountry =
        this.countries.find((c) => c.iso2 === this.defaultIso2) ||
        this.countries[0];
    }
  }

  // ControlValueAccessor
  writeValue(value: string | null): void {
    if (!value) {
      this.nationalNumber = "";
      return;
    }

    const digits = String(value).replace(/[^\d+]/g, "");
    // Longest dial-code prefix wins (e.g. +1 vs the many +1 area-code
    // countries that share it — google-libphonenumber resolves those
    // correctly via its own area-code tables; a plain prefix match is
    // only used as a fallback if parsing fails).
    try {
      const parsed = phoneUtil.parseAndKeepRawInput(digits);
      const iso2 = phoneUtil
        .getRegionCodeForNumber(parsed)
        ?.toLowerCase();
      const match = this.countries.find((c) => c.iso2 === iso2);
      if (match) {
        this.selectedCountry = match;
        this.nationalNumber = String(
          parsed.getNationalNumber?.() ?? "",
        );
        return;
      }
    } catch {
      // fall through to prefix matching below
    }

    const withoutPlus = digits.replace(/^\+/, "");
    const byDialCode = [...this.countries].sort(
      (a, b) => b.dialCode.length - a.dialCode.length,
    );
    const match = byDialCode.find((c) => withoutPlus.startsWith(c.dialCode));
    if (match) {
      this.selectedCountry = match;
      this.nationalNumber = withoutPlus.slice(match.dialCode.length);
    } else {
      this.nationalNumber = withoutPlus;
    }
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private emit(): void {
    if (!this.selectedCountry) {
      this.onChange(null);
      return;
    }
    const digits = this.nationalNumber.replace(/\D/g, "");
    this.onChange(digits ? `+${this.selectedCountry.dialCode}${digits}` : null);
  }

  onNumberInput(value: string): void {
    this.nationalNumber = value.replace(/[^\d\s-]/g, "");
    this.emit();
  }

  onNumberBlur(): void {
    this.onTouched();
  }

  // Country dropdown
  toggle(event?: Event): void {
    // Stops this click from also being re-seen by onDocumentClick below —
    // without it, a single physical click that the browser (or a wrapping
    // element) resolves into more than one click event on this button can
    // toggle twice and net out to "stayed open".
    event?.stopPropagation();
    if (this.disabled) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.searchQuery = "";
      this.filtered = this.countries;
    }
    this.onTouched();
  }

  select(country: PhoneCountry): void {
    this.selectedCountry = country;
    this.isOpen = false;
    this.emit();
    this.onTouched();
  }

  onSearch(query: string): void {
    const q = query.toLowerCase();
    this.filtered = this.countries.filter(
      (c) => c.name.toLowerCase().includes(q) || c.dialCode.includes(q),
    );
  }

  // mousedown, not click: fires before the click (and before whatever a
  // wrapping element might do with it), so closing here can't race with
  // toggle()/select() above, which also act on mousedown/click respectively.
  @HostListener("document:mousedown", ["$event"])
  onDocumentMouseDown(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}
