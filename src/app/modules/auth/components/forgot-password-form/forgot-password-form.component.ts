import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-forgot-password-form",
  standalone: false,
  templateUrl: "./forgot-password-form.component.html",
  styleUrls: ["./forgot-password-form.component.scss"],
})
export class ForgotPasswordFormComponent {
  @Input() isLoading = false;
  @Output("onSubmit") $onSubmit = new EventEmitter<{ email: string }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: [
        "",
        [Validators.required, Validators.email, Validators.maxLength(100)],
      ],
    });
  }

  onSubmit() {
    console.log(this.form.valid);
    if (this.form.valid) {
      this.$onSubmit.emit(this.form.value);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
