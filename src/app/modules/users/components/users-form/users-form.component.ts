import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Validators } from "@angular/forms";
import { User as ModuleObject } from "../../users.type";
import { FieldConfig } from "../../../../@1hand/components/generic-form/generic-form.component";
import { AuthService } from "../../../auth/auth.service";
import { Role } from "../../../auth/auth.types";

@Component({
  standalone: false,

  selector: "app-users-form",
  templateUrl: "./users-form.component.html",
  styleUrls: ["./users-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class UsersFormComponent implements OnInit {
  @Input() isLoading = false;
  @Input() defaultValues?: Partial<ModuleObject> = {} as Partial<ModuleObject>;
  @Output() onSubmit: EventEmitter<any> = new EventEmitter();

  genericFormConfig: FieldConfig[] = [];

  constructor(private authService: AuthService) {}

  /**
   * Retourne les options de rôle accessibles selon le rôle de l'utilisateur connecté.
   * Un utilisateur ne peut attribuer que des rôles de niveau inférieur ou égal au sien.
   */
  private getRoleOptions(): { value: string; label: string }[] {
    const currentRole = this.authService.getRole();

    // Hiérarchie : SUPER_ADMIN > PLATFORM_ADMIN > RECRUITER > CANDIDATE
    const allRoles = [
      { value: "CANDIDATE", label: "general.roles.CANDIDATE" },
      { value: "RECRUITER", label: "general.roles.RECRUITER" },
      { value: "PLATFORM_ADMIN", label: "general.roles.PLATFORM_ADMIN" },
      { value: "SUPER_ADMIN", label: "general.roles.SUPER_ADMIN" },
    ];

    const roleHierarchy: Record<string, number> = {
      CANDIDATE: 0,
      RECRUITER: 1,
      PLATFORM_ADMIN: 2,
      SUPER_ADMIN: 3,
    };

    const currentLevel = currentRole ? (roleHierarchy[currentRole] ?? -1) : -1;

    // Ne montrer que les rôles de niveau inférieur ou égal au sien
    return allRoles.filter((r) => roleHierarchy[r.value] <= currentLevel);
  }

  ngOnInit(): void {
    // Utiliser directement les champs du backend (même format)
    this.genericFormConfig = [
      // ────────────────────────────────────────────────────────────────────────
      // Informations personnelles
      // ────────────────────────────────────────────────────────────────────────
      {
        name: "firstName",
        label: "form.firstName",
        placeholder: "form.firstName",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100),
        ],
        errorMessages: {
          required: "form.errors.fields.firstName.required",
          minlength: "form.errors.fields.firstName.minlength",
          maxlength: "form.errors.fields.firstName.maxlength",
        },
      },
      {
        name: "lastName",
        label: "form.lastName",
        placeholder: "form.lastName",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.minLength(2), Validators.maxLength(100)],
        errorMessages: {
          minlength: "form.errors.fields.lastName.minlength",
          maxlength: "form.errors.fields.lastName.maxlength",
        },
      },
      {
        name: "email",
        label: "form.email",
        placeholder: "form.email",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.email],
        errorMessages: {
          required: "form.errors.fields.email.required",
          email: "form.errors.fields.email.invalidEmail",
        },
      },
      {
        name: "phoneNumber",
        label: "form.phoneNumber",
        placeholder: "form.phoneNumber",
        type: "phone",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [],
        errorMessages: {},
      },
      {
        name: "gender",
        label: "form.gender",
        placeholder: "form.gender",
        type: "select",
        multiple: false,
        required: false,
        size: { xs: 12, md: 6 },
        options: [
          { value: "MALE", label: "enums.gender.MALE" },
          { value: "FEMALE", label: "enums.gender.FEMALE" },
        ],
        validation: [],
        errorMessages: {},
      },
      {
        name: "birthDate",
        label: "form.birthDate",
        placeholder: "form.birthDate",
        type: "date",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [],
        errorMessages: {},
      },
      {
        name: "photo",
        label: "form.photo",
        placeholder: "form.photo",
        type: "fileuploader",
        required: false,
        size: { xs: 12 },
        validation: [],
        errorMessages: {},
      },

      // ────────────────────────────────────────────────────────────────────────
      // Localisation
      // ────────────────────────────────────────────────────────────────────────
      {
        name: "city",
        label: "form.city",
        placeholder: "form.city",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.city.maxlength",
        },
      },
      {
        name: "region",
        label: "form.region",
        placeholder: "form.region",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.region.maxlength",
        },
      },

      // ────────────────────────────────────────────────────────────────────────
      // Autres informations
      // ────────────────────────────────────────────────────────────────────────
      {
        name: "nationality",
        label: "form.nationality",
        placeholder: "form.nationality",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.nationality.maxlength",
        },
      },
      {
        name: "bio",
        label: "form.bio",
        placeholder: "form.bio",
        type: "richtext",
        multiline: true,
        rows: 4,
        required: false,
        size: { xs: 12 },
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          maxlength: "form.errors.fields.bio.maxlength",
        },
      },
      {
        name: "notes",
        label: "form.notes",
        placeholder: "form.notes",
        type: "richtext",
        multiline: true,
        rows: 4,
        required: false,
        size: { xs: 12 },
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          maxlength: "form.errors.fields.notes.maxlength",
        },
      },

      // ────────────────────────────────────────────────────────────────────────
      // Administration
      // ────────────────────────────────────────────────────────────────────────
      {
        name: "role",
        label: "form.role",
        placeholder: "form.role",
        type: "select",
        multiple: false,
        required: false,
        size: { xs: 12, md: 6 },
        options: this.getRoleOptions(),
        validation: [],
        errorMessages: {},
      },
      {
        name: "adminLevel",
        label: "form.adminLevel",
        placeholder: "form.adminLevel",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.adminLevel.maxlength",
        },
      },
      {
        name: "adminPosition",
        label: "form.adminPosition",
        placeholder: "form.adminPosition",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(100)],
        errorMessages: {
          maxlength: "form.errors.fields.adminPosition.maxlength",
        },
      },
      {
        name: "twoFactorEnabled",
        label: "form.twoFactorEnabled",
        placeholder: "form.twoFactorEnabled",
        type: "select",
        multiple: false,
        required: false,
        size: { xs: 12, md: 6 },
        options: [
          { value: true, label: "enums.boolean.enabled" },
          { value: false, label: "enums.boolean.disabled" },
        ],
        validation: [],
        errorMessages: {},
      },
    ];
  }

  handleSubmit(formData: any) {
    // Envoyer directement les données du formulaire (même format que le backend)
    this.onSubmit.emit(formData);
  }
}
