import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  standalone: false,

  selector: "app-candidates-setting.page",
  templateUrl: "./candidates-setting.page.component.html",
  styleUrls: ["./candidates-setting.page.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesSettingPageComponent implements OnInit {
  accountForm: FormGroup;
  preferencesForm: FormGroup;
  securityForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialisation du formulaire des informations du compte
    this.accountForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(2)]],
      email: ["", [Validators.required, Validators.email]],
    });

    // Initialisation du formulaire des préférences
    this.preferencesForm = this.fb.group({
      receiveMonthlyInvoices: [false],
      receiveApplicationsByEmail: [false],
    });

    // Initialisation du formulaire de sécurité
    this.securityForm = this.fb.group(
      {
        currentPassword: ["", [Validators.required]],
        newPassword: ["", [Validators.required, Validators.minLength(8)]],
        confirmPassword: ["", [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Component initialization
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get("newPassword");
    const confirmPassword = form.get("confirmPassword");

    if (
      newPassword &&
      confirmPassword &&
      newPassword.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  // Méthodes pour gérer les soumissions de formulaires
  onUpdateAccount(): void {
    console.log("Mise à jour du compte:", this.accountForm.value);
  }

  onSavePreferences(): void {
    console.log("Sauvegarde des préférences:", this.preferencesForm.value);
  }

  onChangePassword(): void {
    console.log("Changement de mot de passe");
  }

  onDeleteAccount(): void {
    console.log("Suppression du compte");
  }

  onLogout(): void {
    console.log("Déconnexion");
    this.router.navigate(["/login"]);
  }

  // Getters pour faciliter l'accès aux contrôles dans le template
  get accountControls() {
    return this.accountForm.controls;
  }

  get preferencesControls() {
    return this.preferencesForm.controls;
  }

  get securityControls() {
    return this.securityForm.controls;
  }
}
