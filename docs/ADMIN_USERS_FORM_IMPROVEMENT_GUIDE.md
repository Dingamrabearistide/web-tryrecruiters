# Guide d'Amélioration - Admin Users Edit Form

## 📍 Route Cible

`dashboard/:employerId/admin/:id/users/edit/:id`

- **Composant Principal**: `CandidatesUpdatePageComponent`
- **Composant Formulaire**: `CandidatesFormComponent`
- **Composant Générique**: `GenericFormComponent` ✨

---

## 🏗️ Architecture Recommandée

### 1. Créer un Composant Spécialisé `AdminUsersFormComponent`

Au lieu d'utiliser directement `CandidatesFormComponent`, créer un composant dédié:

```typescript
// admin-users-form.component.ts
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FieldConfig } from "../../../../@1hand/components/generic-form/generic-form.component";
import { User } from "../admin.types";

@Component({
  selector: "app-admin-users-form",
  template: `
    <app-generic-form
      [fieldConfigurations]="fieldConfigurations"
      [defaultValues]="defaultValues"
      [errorMessage]="errorMessage"
      [isLoading]="isLoading"
      [showActionButton]="showActionButton"
      [transationNamespace]="'admin.users'"
      (submitForm)="submitForm.emit($event)"
    ></app-generic-form>
  `,
  styleUrl: "./admin-users-form.component.scss",
})
export class AdminUsersFormComponent {
  @Input() defaultValues: Partial<User> = {};
  @Input() errorMessage?: string;
  @Input() isLoading = false;
  @Input() showActionButton = true;
  @Input() roles: any[] = []; // À charger via service

  @Output() submitForm = new EventEmitter<any>();

  fieldConfigurations: FieldConfig[] = [
    // SECTION: Informations d'Accès
    {
      name: "email",
      label: "admin.users.email",
      type: "string",
      required: true,
      fieldset: "admin.users.accessInfo",
      size: { md: 6 },
      validation: [
        /* pattern email */
      ],
      errorMessages: {
        required: "admin.users.emailRequired",
        email: "admin.users.emailInvalid",
      },
    },
    {
      name: "password",
      label: "admin.users.password",
      type: "password",
      required: false, // Optionnel en édition
      fieldset: "admin.users.accessInfo",
      size: { md: 6 },
      placeholder: "admin.users.passwordOptional",
      errorMessages: {
        minlength: "admin.users.passwordTooShort",
      },
    },

    // SECTION: Informations Personnelles
    {
      name: "firstName",
      label: "admin.users.firstName",
      type: "string",
      required: true,
      fieldset: "admin.users.personalInfo",
      size: { md: 6 },
      errorMessages: {
        required: "admin.users.firstNameRequired",
      },
    },
    {
      name: "lastName",
      label: "admin.users.lastName",
      type: "string",
      required: true,
      fieldset: "admin.users.personalInfo",
      size: { md: 6 },
      errorMessages: {
        required: "admin.users.lastNameRequired",
      },
    },
    {
      name: "phoneNumber",
      label: "admin.users.phone",
      type: "phone",
      fieldset: "admin.users.personalInfo",
      size: { md: 6 },
    },
    {
      name: "gender",
      label: "admin.users.gender",
      type: "select",
      fieldset: "admin.users.personalInfo",
      size: { md: 6 },
      options: [
        { value: "MALE", label: "enums.gender.MALE" },
        { value: "FEMALE", label: "enums.gender.FEMALE" },
        { value: "OTHER", label: "enums.gender.OTHER" },
      ],
    },

    // SECTION: Informations de Localisation
    {
      name: "city",
      label: "admin.users.city",
      type: "string",
      fieldset: "admin.users.location",
      size: { md: 4 },
    },
    {
      name: "region",
      label: "admin.users.region",
      type: "string",
      fieldset: "admin.users.location",
      size: { md: 4 },
    },
    {
      name: "country",
      label: "admin.users.country",
      type: "autocomplete",
      fieldset: "admin.users.location",
      size: { md: 4 },
      options: [], // À charger via service
      loading: false,
    },

    // SECTION: Permissions et Rôles
    {
      name: "role",
      label: "admin.users.role",
      type: "select",
      required: true,
      fieldset: "admin.users.permissions",
      size: { md: 12 },
      options: [], // À remplir dynamiquement
      disabled: false,
      errorMessages: {
        required: "admin.users.roleRequired",
      },
    },
    {
      name: "isActive",
      label: "admin.users.isActive",
      type: "checkbox",
      fieldset: "admin.users.permissions",
      size: { md: 4 },
    },
    {
      name: "isVerified",
      label: "admin.users.isVerified",
      type: "checkbox",
      fieldset: "admin.users.permissions",
      size: { md: 4 },
    },
    {
      name: "isBanned",
      label: "admin.users.isBanned",
      type: "checkbox",
      fieldset: "admin.users.permissions",
      size: { md: 4 },
      dynamicConfig: (values) => ({
        disabled: !values.isActive, // Désactiver si utilisateur inactif
      }),
    },

    // SECTION: Informations Additionnelles
    {
      name: "bio",
      label: "admin.users.bio",
      type: "textarea",
      fieldset: "admin.users.additional",
      size: { md: 12 },
      rows: 4,
    },
    {
      name: "notes",
      label: "admin.users.notes",
      type: "textarea",
      fieldset: "admin.users.additional",
      size: { md: 12 },
      rows: 3,
      placeholder: "admin.users.notesPlaceholder",
    },
  ];
}
```

---

### 2. Mettre à Jour `AdminUsersUpdatePageComponent`

```typescript
// admin-users-update-page.component.ts
import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { TranslocoService } from "@ngneat/transloco";
import { BaseUpdatePageComponent } from "../../../../@1hand/pages/base-update-page/base-update-page.component";
import { AdminPlatformUsersService } from "../../services/admin-platform-users.service";
import { User, UpdateUserDto } from "../../admin.types";

@Component({
  selector: "app-admin-users-update-page",
  template: `
    <div
      *transloco="let t; read: 'admin.users'"
      class="container mx-auto px-4 py-6"
    >
      <!-- Header -->
      <div class="mb-6">
        <button
          (click)="handleBack()"
          class="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
        >
          <i class="fas fa-arrow-left"></i>
          {{ t("actions.back") }}
        </button>
        <h1 class="text-3xl font-bold text-gray-900" *ngIf="item">
          {{ item.firstName }} {{ item.lastName }}
        </h1>
        <p class="text-gray-600">{{ t("edit.subtitle") }}</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-lg shadow-sm p-6">
        <app-admin-users-form
          *ngIf="!isLoading && !hasError"
          [defaultValues]="getFormDefaultValues()"
          [errorMessage]="errorMessage"
          [isLoading]="isLoading"
          [roles]="roles"
          (submitForm)="onSubmit($event)"
        ></app-admin-users-form>

        <!-- Loading State -->
        <div *ngIf="isLoading" class="text-center py-12">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"
          ></div>
          <p class="text-gray-600">{{ t("loading") }}</p>
        </div>

        <!-- Error State -->
        <div
          *ngIf="hasError"
          class="bg-red-50 border border-red-200 rounded-lg p-6"
        >
          <p class="text-red-600">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  `,
  styleUrl: "./admin-users-update-page.component.scss",
})
export class AdminUsersUpdatePageComponent extends BaseUpdatePageComponent<
  UpdateUserDto,
  User
> {
  moduleName = "admin.users";
  roles: any[] = [];

  constructor(
    protected override service: AdminPlatformUsersService,
    protected override dialog: MatDialog,
    protected override transloco: TranslocoService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(service, dialog, transloco, router, route);
    this.loadRoles();
  }

  protected buildPayload(formData: any): UpdateUserDto {
    return {
      ...this.item,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber || undefined,
      gender: formData.gender || undefined,
      city: formData.city || undefined,
      region: formData.region || undefined,
      country: formData.country || undefined,
      role: formData.role,
      isActive: formData.isActive,
      isVerified: formData.isVerified,
      isBanned: formData.isBanned,
      bio: formData.bio || undefined,
      notes: formData.notes || undefined,
      password: formData.password || undefined, // Seulement si rempli
      updatedAt: new Date().toISOString(),
    };
  }

  protected getItemLabel(item: User): string {
    return `${item.firstName} ${item.lastName}`;
  }

  protected getItemIdParamName(): string {
    return "id";
  }

  getFormDefaultValues(): any {
    if (!this.item) return {};

    return {
      email: this.item.email,
      firstName: this.item.firstName,
      lastName: this.item.lastName,
      phoneNumber: this.item.phoneNumber || "",
      gender: this.item.gender || "",
      city: this.item.city || "",
      region: this.item.region || "",
      country: this.item.country || "",
      role: this.item.role,
      isActive: this.item.isActive,
      isVerified: this.item.isVerified,
      isBanned: this.item.isBanned,
      bio: this.item.bio || "",
      notes: this.item.notes || "",
    };
  }

  private loadRoles(): void {
    // À implémenter selon ton service
    // this.service.getRoles().subscribe(roles => {
    //   this.roles = roles;
    // });
  }
}
```

---

### 3. Patterns Clés du `GenericFormComponent` à Utiliser

#### ✅ A. Fieldsets (Grouper les champs logiquement)

```typescript
{
  name: "firstName",
  fieldset: "admin.users.personalInfo", // Groupe logique
  // ... autres props
}
```

#### ✅ B. Validation Personnalisée avec Messages i18n

```typescript
{
  name: "email",
  validation: [
    Validators.required,
    Validators.email,
    CustomValidators.uniqueEmail // Custom validator
  ],
  errorMessages: {
    required: "admin.users.emailRequired",
    email: "admin.users.emailInvalid",
    uniqueEmail: "admin.users.emailExists",
  },
}
```

#### ✅ C. Champs Dépendants avec `dynamicConfig`

```typescript
{
  name: "isBanned",
  type: "checkbox",
  dynamicConfig: (formValues) => ({
    disabled: !formValues.isActive, // Désactiver si pas actif
    required: formValues.role === "MODERATOR", // Requis si modérateur
  }),
}
```

#### ✅ D. Champs Async (Options chargées)

```typescript
{
  name: "role",
  type: "select",
  options: [], // À l'initialisation
  loading: true, // Indicateur de chargement
  // Puis mettre à jour via [fieldConfigurations]
}
```

#### ✅ E. Gestion des Tailles Responsive

```typescript
{
  name: "email",
  size: {
    xs: 12,  // Mobile: pleine largeur
    sm: 12,
    md: 6,   // Tablette: demi-largeur
    lg: 4,   // Desktop: tiers
    xl: 4
  },
}
```

---

## 📋 Checklist d'Implémentation

### Phase 1: Créer les Services et Types

- [ ] Vérifier/créer `AdminUsersService` avec les méthodes:
  - `getUsers(filters)` ✓
  - `selectById(id)` ✓
  - `update(id, dto)` ✓
  - `getRoles()` - À ajouter
  - `getCountries()` - À ajouter
  - `validateEmailUniqueness(email)` - À ajouter

### Phase 2: Créer les Types

```typescript
// admin.types.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  city?: string;
  region?: string;
  country?: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  bio?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: string;
  city?: string;
  region?: string;
  country?: string;
  role?: UserRole;
  isActive?: boolean;
  isVerified?: boolean;
  isBanned?: boolean;
  bio?: string;
  notes?: string;
  password?: string; // Seulement si changement
}
```

### Phase 3: Créer les Composants

- [ ] Créer `AdminUsersFormComponent`
- [ ] Créer `AdminUsersUpdatePageComponent`
- [ ] Ajouter les traductions i18n pour `admin.users.*`

### Phase 4: Intégrer au Routing

```typescript
// dashboard-admin-routing.module.ts
{
  path: "users",
  children: [
    // ...
    {
      path: "edit/:id",
      component: AdminUsersUpdatePageComponent, // Remplacer CandidatesUpdatePageComponent
    },
  ],
}
```

---

## 🎯 Améliorations UX Bonus

### 1. Confirmation avant Sauvegarde

```typescript
// Dans AdminUsersUpdatePageComponent
handleUpdate(data: UpdateUserDto): void {
  const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    data: {
      title: "Confirmer les modifications",
      message: "Êtes-vous sûr de vouloir modifier cet utilisateur?",
    },
  });

  dialogRef.afterClosed().subscribe((confirmed) => {
    if (confirmed) {
      super.handleUpdate(data);
    }
  });
}
```

### 2. Validation Dynamique au Changement

```typescript
// AdminUsersFormComponent
ngOnInit() {
  this.form.get("email").valueChanges
    .pipe(
      debounceTime(500),
      distinctUntilChanged(),
    )
    .subscribe((email) => {
      this.validateEmailUniqueness(email);
    });
}
```

### 3. Afficher l'État de Sauvegarde

```html
<!-- Dans le template -->
<div *ngIf="isSaving" class="bg-blue-50 border border-blue-200 rounded p-4">
  <i class="fas fa-spinner animate-spin mr-2"></i>
  Sauvegarde en cours...
</div>

<div
  *ngIf="saveSuccess"
  class="bg-green-50 border border-green-200 rounded p-4"
>
  <i class="fas fa-check mr-2"></i>
  Utilisateur modifié avec succès
</div>
```

---

## 📚 Références dans le Code Existant

- `GenericFormComponent`: `src/@1hand/components/generic-form/`
- `BaseUpdatePageComponent`: `src/@1hand/pages/base-update-page/`
- `CandidatesFormComponent`: `src/modules/candidates/components/candidates-form/`
- Translations: `public/i18n/*.json` (ajouter namespace `admin.users`)

---

## ✨ Avantages de cette Approche

| Aspect              | Bénéfice                                                  |
| ------------------- | --------------------------------------------------------- |
| **Réutilisabilité** | Utiliser `GenericFormComponent` pour tous les formulaires |
| **Maintenabilité**  | Configuration centralisée des champs                      |
| **i18n**            | Messages d'erreur traduits automatiquement                |
| **Validation**      | Support des custom validators et dynamique                |
| **Performance**     | Formulaire réactif sans rechargement                      |
| **UX**              | Fieldsets, messages d'erreur clairs, feedback             |
| **Testabilité**     | Composant générique avec logique métier isolée            |
