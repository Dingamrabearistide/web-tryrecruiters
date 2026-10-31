import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  standalone: false,

  selector: "app-otp-form",
  templateUrl: "./otp-form.component.html",
  styleUrls: ["./otp-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class OtpFormComponent {
  @Input() isLoading = false;
  @Output("onSubmit") $onSubmit = new EventEmitter<{ code: string }>();
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      code: ["", [Validators.required, Validators.pattern(/^\d{6}$/)]],
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
