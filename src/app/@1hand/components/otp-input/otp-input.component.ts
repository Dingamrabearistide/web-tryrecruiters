import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
  forwardRef,
} from "@angular/core";
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from "@angular/forms";
import { CommonModule } from "@angular/common";

/** Segmented digit-by-digit code input (one box per character, auto-advance,
 * backspace-to-previous, paste-splitting) — the shared verification-code
 * design used across every "enter the code we sent you" form in the app.
 * Implements ControlValueAccessor so it drops into any reactive form via
 * formControlName exactly like a plain <input>, but exposes a single joined
 * string as its value. */
@Component({
  selector: "app-otp-input",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./otp-input.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true,
    },
  ],
})
export class OtpInputComponent implements ControlValueAccessor, OnInit {
  @Input() length = 6;
  @Input() disabled = false;

  @ViewChildren("digitInput")
  digitInputs!: QueryList<ElementRef<HTMLInputElement>>;

  digits: string[] = [];

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    if (!this.digits.length) {
      this.digits = Array(this.length).fill("");
    }
  }

  writeValue(value: string): void {
    const chars = (value || "").replace(/\s+/g, "").split("");
    this.digits = Array.from(
      { length: this.length },
      (_, i) => chars[i] || "",
    );
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

  private emit(): void {
    this.onChange(this.digits.join(""));
  }

  onInput(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const char = input.value.replace(/\D/g, "").slice(-1);
    this.digits[index] = char;
    input.value = char;
    this.emit();

    if (char && index < this.length - 1) {
      this.digitInputs.get(index + 1)?.nativeElement.focus();
    }
  }

  onKeydown(index: number, event: KeyboardEvent): void {
    if (event.key === "Backspace" && !this.digits[index] && index > 0) {
      this.digits[index - 1] = "";
      this.emit();
      this.digitInputs.get(index - 1)?.nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasted = (event.clipboardData?.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, this.length)
      .split("");
    if (!pasted.length) return;

    pasted.forEach((value, i) => (this.digits[i] = value));
    this.emit();

    const nextIndex = Math.min(pasted.length, this.length - 1);
    this.digitInputs.get(nextIndex)?.nativeElement.focus();
  }

  onBlur(): void {
    this.onTouched();
  }

  /** Without this, *ngFor over `digits` (mostly identical "" placeholders)
   * tracks items by value instead of position — Angular's default differ
   * can't tell which empty box just became "2", so it reuses/reshuffles
   * the wrong <input> DOM nodes between boxes as you type, making digits
   * appear to duplicate or land in the wrong box. */
  trackByIndex(index: number): number {
    return index;
  }
}
