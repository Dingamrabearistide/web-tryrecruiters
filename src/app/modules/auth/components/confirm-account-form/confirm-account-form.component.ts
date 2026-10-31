import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";

// Validator that strips spaces before checking 6-digit pattern
function sixDigitCode(control: AbstractControl): ValidationErrors | null {
  const stripped = (control.value || "").replace(/\s+/g, "");
  return /^\d{6}$/.test(stripped) ? null : { invalidCode: true };
}

@Component({
  selector: "app-confirm-account-form",
  standalone: false,
  templateUrl: "./confirm-account-form.component.html",
  styleUrls: ["./confirm-account-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ConfirmAccountFormComponent {
  @Input() isLoading = false;
  @Output("onSubmit") $onSubmit = new EventEmitter<{ code: string }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ["", [Validators.required, sixDigitCode]],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      // Strip all whitespace before emitting so the backend always gets clean digits
      const cleanCode = (this.form.value.code || "").replace(/\s+/g, "");
      this.$onSubmit.emit({ code: cleanCode });
    } else {
      this.form.markAllAsTouched();
    }
  }
}
