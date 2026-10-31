import { Component, EventEmitter, Input, Output } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";

@Component({
  standalone: false,
  selector: "app-reset-password-form",
  templateUrl: "./reset-password-form.component.html",
  styleUrls: ["./reset-password-form.component.scss"],
})
export class ResetPasswordFormComponent {
  @Input() isLoading = false;
  @Output() handleSubmit = new EventEmitter<{
    code: string;
    password: string;
  }>();

  form: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        code: ["", [Validators.required]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/),
          ],
        ],
        passwordConfirmation: ["", [Validators.required, Validators.minLength(6)]],
      },
      { validators: this.passwordsMatch },
    );
  }

  get rules() {
    const password = this.form.get("password")?.value || "";
    const confirm = this.form.get("passwordConfirmation")?.value || "";
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      match: password.length > 0 && password === confirm,
    };
  }

  passwordsMatch(group: AbstractControl) {
    const pass = group.get("password")?.value;
    const confirm = group.get("passwordConfirmation")?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.form.valid) {
      this.handleSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
