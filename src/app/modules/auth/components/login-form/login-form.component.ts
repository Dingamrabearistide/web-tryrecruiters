import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  standalone: false,

  selector: "app-login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class LoginFormComponent {
  @Input() isLoading = false;
  @Output("onSubmit") $onSubmit = new EventEmitter<{
    email: string;
    password: string;
  }>();

  form: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          // Validators.minLength(8),
          Validators.maxLength(64),
          // Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/), // 1 uppercase, 1 lowercase, 1 digit
        ],
      ],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.$onSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
