import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { ContactService } from "../../../../core/services/contact.service";

const CONTACT_EMAIL = "support@tryrecruiters.com";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2883.250048925192!2d14.248780715762725!3d40.826091879319485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133b0861b48a55d5%3A0x7fa1ab79ff2f7e1c!2sSanta%20Lucia%2C%20Naples%2C%20Italy!5e0!3m2!1sen!2sus!4v1686599337596!5m2!1sen!2sus";

@Component({
  standalone: false,

  selector: "app-contact-page",
  templateUrl: "./contact-page.component.html",
  styleUrls: ["./contact-page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ContactPageComponent {
  contactEmail = CONTACT_EMAIL;
  openFaq: number | null = null;
  faqIndices = [1, 2, 3, 4, 5, 6];
  mapUrl: SafeResourceUrl;

  contactForm: FormGroup;
  isSending = false;
  submitStatus: "idle" | "sent" | "error" = "idle";

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private contactService: ContactService,
  ) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(MAP_EMBED_URL);
    this.contactForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      subject: ["", Validators.required],
      message: ["", Validators.required],
    });
  }

  toggleFaq(index: number): void {
    this.openFaq = this.openFaq === index ? null : index;
  }

  scrollToForm(): void {
    document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  onSubmit(): void {
    this.submitStatus = "idle";

    if (this.contactForm.invalid || this.isSending) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSending = true;

    this.contactService.send(this.contactForm.value).subscribe({
      next: () => {
        this.isSending = false;
        this.submitStatus = "sent";
        this.contactForm.reset();
      },
      error: () => {
        this.isSending = false;
        this.submitStatus = "error";
      },
    });
  }
}
