# Analyse de l'Architecture des Dashboards

## 📋 Vue d'ensemble

Le projet contient **3 dashboards** existants avec une architecture modulaire similaire :

- **Admin Dashboard** (`src/app/modules/dashboard/submodules/admin/`) - pour les admins plateform et super admins
- **Candidates Dashboard** (`src/app/modules/dashboard/submodules/candidates/`) - pour les candidats
- **Employers Dashboard** (`src/app/modules/dashboard/submodules/employers/`) - pour les recruteurs

Chaque dashboard est un **submodule** lazy-loaded du module dashboard principal.

---

## 📁 Structure de Répertoires - Modèle Standard

### Structure type d'un dashboard :

```
dashboard/submodules/[dashboard-type]/
├── dashboard-[type].module.ts          # Déclarations et imports
├── dashboard-[type]-routing.module.ts  # Routes
├── dashboard-[type].component.ts       # Composant principal
├── dashboard-[type].component.html     # Template principal
├── dashboard-[type].component.scss     # Styles (optionnel)
├── dashboard-[type].component.spec.ts  # Tests
├── layout/
│   ├── dashboard-[type]-layout.component.ts
│   └── dashboard-[type]-layout.component.html
├── pages/                               # Pages métier (create, list, detail, edit)
│   ├── applications/
│   ├── companies/
│   ├── job-offers/
│   ├── interviews/
│   └── [autres domaines]/
├── components/                          # Composants réutilisables (optionnel)
├── services/                            # Services spécifiques (optionnel)
├── i18n/                                # Traductions
│   ├── en.json
│   └── fr.json
└── guards/                              # Gardes de route (optionnel, ex: employers)
```

### Exemple concret (Admin Dashboard) :

```
admin/
├── dashboard-admin-routing.module.ts
├── dashboard-admin.component.ts
├── dashboard-admin.component.html
├── dashboard-admin.component.scss
├── dashboard-admin.module.ts
├── layout/
│   ├── dashboard-admin-layout.component.html
│   └── dashboard-admin-layout.component.ts
├── pages/
│   ├── applications/
│   │   ├── dashboard-employers-applications-list-page/
│   │   │   ├── dashboard-admin-applications-list-page.component.ts
│   │   │   └── dashboard-admin-applications-list-page.component.html
│   │   └── dashboard-employers-application-details-page/
│   ├── companies/
│   ├── interviews/
│   ├── job-offers/
│   ├── permissions/
│   └── users/
└── i18n/
    ├── en.json
    └── fr.json
```

---

## 🎯 Pages Standard par Dashboard

### Admin Dashboard - Pages disponibles :

1. **Applications** - List, Details
2. **Companies** - Create, List, Details, Update
3. **Job Offers** - Create, List, Details, Update
4. **Interviews** - List, Details
5. **Users** - List, Details
6. **Permissions** - Create, List, Details, Update

### Candidates Dashboard - Pages disponibles :

1. **Candidates** - List, Details
2. **Companies** - List, Details
3. **Job Offers** - List, Details
4. **Applications** - List, Details
5. **Favorites** - List, Details
6. **Resumes** - List, Create
7. **Interviews** - List, Details
8. **Users** - Profile Page

### Employers Dashboard - Pages disponibles :

1. **Home** - Dashboard home
2. **Companies** - Create, List, Details, Update
3. **Job Offers** - Create, List, Details, Update
4. **Applications** - List, Details
5. **Interviews** - List, Details
6. **Categories** - (si applicable)
7. **Settings** - Settings page
8. **Subscriptions** - List, Payment

---

## 🏗️ Architecture Technique

### 1. **Lazy Loading des Submodules**

```typescript
// dashboard.routing.ts
const routes: Routes = [
  {
    path: "candidates",
    loadChildren: () =>
      import("./submodules/candidates/dashboard-candidates.module").then(
        (m) => m.DashboardCandidatesModule,
      ),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./submodules/admin/dashboard-admin.module").then(
        (m) => m.DashboardAdminModule,
      ),
  },
];
```

### 2. **Routing avec Paramètre d'ID Utilisateur**

```typescript
// Chaque submodule utilise une structure de route avec :employerId
const routes: Routes = [
  {
    path: ":employerId",
    component: DashboardAdminLayoutComponent,
    children: [
      {
        path: "",
        component: DashboardAdminComponent, // Home page
      },
      {
        path: "companies",
        children: [
          {
            path: "create",
            component: DashboardAdminCompanyCreatePageComponent,
          },
          { path: "list", component: DashboardAdminCompaniesListPageComponent },
          {
            path: ":companyId",
            component: DashboardAdminCompaniesDetailPageComponent,
          },
          {
            path: "edit/:companyId",
            component: DashboardAdminCompaniesUpdatePageComponent,
          },
        ],
      },
    ],
  },
];
```

### 3. **Gardes d'Authentification**

Le layout component (ex: `dashboard-admin-layout.component.ts`) valide l'accès :

```typescript
ngOnInit(): void {
  const user = this.authService.getUser();
  if (
    !user ||
    !(this.authService.isPlatformAdmin() || this.authService.isSuperAdmin())
  ) {
    this.router.navigateByUrl("/");
    return;
  }
  this.loadMenu(user);
}
```

**Méthodes AuthService disponibles :**

- `isPlatformAdmin()` - Vérifie si admin plateforme
- `isSuperAdmin()` - Vérifie si super admin
- `isRecruiter()` - Vérifie si recruteur
- `isCandidate()` - Vérifie si candidat
- `getUser()` - Récupère l'utilisateur connecté

---

## 🎨 Layout & Design Pattern

### Structure générale du Layout :

```html
<div class="relative flex">
  <!-- SIDEBAR (gauche) -->
  <div class="hidden md:block bg-white w-[250px]">
    <app-dashboard-sidebar
      [menuItems]="menu"
      namespace="dashboardadmin"
      moduleRootUrl="/dashboard/admin"
    ></app-dashboard-sidebar>
  </div>

  <!-- MAIN CONTENT (droite) -->
  <div class="flex-1 flex flex-col">
    <!-- NAVBAR (haut) -->
    <div class="h-[70px] flex-shrink-0">
      <app-dashboard-navbar></app-dashboard-navbar>
    </div>

    <!-- PAGE CONTENT -->
    <div class="w-full mt-5 py-5 px-8 pb-24">
      <router-outlet></router-outlet>
    </div>
  </div>
</div>
```

### Composants Réutilisables Partagés :

- **DashboardSidebarComponent** - Barre de navigation latérale
  - Inputs : `menuItems`, `namespace`, `moduleRootUrl`
  - Gère l'ouverture/fermeture sur mobile
  - Détecte automatiquement la route active

- **DashboardNavbarComponent** - Barre de navigation supérieure
  - Utilisée par tous les dashboards

- **DashboardLayout** - Composant wrapper
  - Fourni par le submodule

---

## 📦 Structure du Module

### Pattern TypeScript d'un Dashboard Module :

```typescript
// dashboard-admin.module.ts
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { TRANSLOCO_SCOPE, Translation } from "@ngneat/transloco";
import { SupportedLanguages } from "../../../../transloco-loader";

// Loader i18n
export const loader: Record<string, () => Promise<Translation>> =
  SupportedLanguages.reduce(
    (acc, lang) => {
      acc[lang] = () => import(`./i18n/${lang}.json`);
      return acc;
    },
    {} as Record<string, () => Promise<Translation>>,
  );

@NgModule({
  declarations: [
    // Layout
    DashboardAdminLayoutComponent,
    DashboardAdminComponent,

    // Pages
    DashboardAdminCompanyCreatePageComponent,
    DashboardAdminCompaniesListPageComponent,
    // ... autres pages
  ],
  imports: [
    CommonModule,
    DashboardAdminRoutingModule,
    ReactiveFormsModule,
    // Material modules
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,

    // Feature modules
    CompagniesModule,
    JobOfferModule,
    ApplicationsModule,
    EmployersModule,
    CandidatesModule,
    InterviewModule,
    PermissionsModule,

    // Core modules
    CoreModule,
    SharedModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      multi: true,
      useValue: {
        scope: "dashboardadmin",
        loader,
      },
    },
  ],
})
export class DashboardAdminModule {}
```

---

## 🔧 Patterns de Codage

### 1. **Pages List - Utilisation de BaseListDeletePageComponent**

Pattern héritage avec classe de base abstraite :

```typescript
@Component({
  selector: "app-dashboard-admin-companies-list-page",
  templateUrl: "./dashboard-admin-companies-list-page.component.html",
})
export class DashboardAdminCompaniesListPageComponent
  extends BaseListDeletePageComponent<ModuleObject>
  implements OnInit
{
  moduleName = "companies";

  // Filtres personnalisés
  startDate = "";
  contractType = "";
  keyword = "";

  constructor(
    service: Service,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
    dialog: MatDialog,
  ) {
    super(service, route, router, transloco, dialog);
  }

  // Implémentation des méthodes abstraites
  protected onParamsInit(params: any): void {
    // Initialiser les filtres depuis queryParams
  }

  protected getListParams(): any {
    return {
      page: this.page,
      limit: this.limit,
      // autres filtres
    };
  }

  protected getItemId(item: ModuleObject): string {
    return item.id;
  }

  protected getItemLabel(item: ModuleObject): string {
    return item.name;
  }

  protected getDeleteTitle(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.title");
  }

  protected getDeleteMessage(item: ModuleObject): string {
    return this.transloco.translate("companies.delete.message", {
      name: item.name,
    });
  }

  // Handlers
  onSearch(): void {
    this.page = 1;
    this.updateQueryParams();
  }

  handleView(item: ModuleObject) {
    this.router.navigate(["../", item.id], { relativeTo: this.route });
  }

  handleUpdate(item: ModuleObject) {
    this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
  }
}
```

### 2. **Pages Détail - Utilisation avec Services**

Pattern pour pages détail avec données chargées :

```typescript
export class DashboardAdminCompaniesDetailPageComponent
  extends BaseDetailPageComponent<ModuleObject>
  implements OnInit
{
  constructor(
    service: CompaniesService,
    route: ActivatedRoute,
    transloco: TranslocoService,
    router: Router,
  ) {
    super(service, route, transloco, router);
  }

  protected getItemId(): string {
    return this.route.snapshot.paramMap.get("companyId") || "";
  }
}
```

### 3. **Services Dashboard Spécifiques**

Pattern pour services dashboard (ex: DashboardCandidatesService) :

```typescript
@Injectable({ providedIn: "root" })
export class DashboardCandidatesService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private candidatesService: CandidatesService,
    private applicationsService: ApplicationsService,
  ) {}

  getDashboardData(candidateId: string): Observable<DashboardData> {
    return this.http.get<DashboardData>(
      `${this.apiUrl}/candidates/${candidateId}/dashboard`,
    );
  }

  // Autres méthodes spécifiques au dashboard
}
```

### 4. **Structure des Sidebare Menu**

Pattern pour charger le menu dans le layout :

```typescript
loadMenu(user: User) {
  const moduleRootUrl = `/dashboard/admin/${user.id}`;

  this.menu = [
    {
      id: "dashboard",
      label: "sidebar.dashboard",
      icon: "fa fa-th-large",
      href: `${moduleRootUrl}`,
      active: true,
    },
    {
      id: "companies",
      label: "sidebar.companies",
      icon: "fa fa-building",
      href: `${moduleRootUrl}/companies/list`,
    },
    // ... autres items
  ];
}
```

### 5. **Traduction & i18n**

Pattern pour utilisation de traductions dans les templates :

```html
<div *transloco="let t; read: 'companies'">
  <h1 class="text-3xl pb-2 font-bold text-primary">{{ t("list.title") }}</h1>
  <p class="text-gray-600 text-sm font-normal">{{ t("list.description") }}</p>
</div>
```

Structure des fichiers i18n :

```json
// i18n/en.json
{
  "sidebar": {
    "dashboard": "Dashboard",
    "companies": "Companies",
    "jobsoffers": "Job Offers"
  },
  "companies": {
    "list": {
      "title": "Companies",
      "description": "Manage all companies"
    },
    "delete": {
      "title": "Delete Company",
      "message": "Are you sure you want to delete {{name}}?"
    }
  }
}
```

### 6. **Forms & Reactive Forms**

Pattern recommandé pour les pages create/edit :

```typescript
export class DashboardAdminCompanyCreatePageComponent {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private service: CompaniesService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      // ... autres champs
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.service.create(this.form.value).subscribe({
        next: () => {
          this.router.navigate(["../list"], { relativeTo: this.route });
        },
        error: (err) => {
          // Gérer l'erreur
        },
      });
    }
  }
}
```

### 7. **Navigation & Routes**

Pattern de navigation relative :

```typescript
// Vue
handleView(item: Company) {
  this.router.navigate(["../", item.id], { relativeTo: this.route });
}

handleEdit(item: Company) {
  this.router.navigate(["./../edit", item.id], { relativeTo: this.route });
}

handleBack() {
  this.router.navigate(["../list"], { relativeTo: this.route });
}
```

### 8. **Gestion des Erreurs & Loading**

Pattern standard pour async operations :

```typescript
component: {
  isLoading = false;
  hasError = false;
  errorMessage = "";
  items: T[] = [];

  loadItems(): void {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.service.selectMany(this.getListParams()).subscribe({
      next: (res: any) => {
        this.items = res.data ?? [];
        this.totalItems = res.total;
        this.isLoading = false;
      },
      error: () => {
        this.hasError = true;
        this.errorMessage = this.transloco.translate("genericError");
        this.isLoading = false;
      },
    });
  }
}

// Template
<div *ngIf="isLoading" class="text-center">Loading...</div>
<div *ngIf="hasError" class="alert alert-error">{{ errorMessage }}</div>
<div *ngIf="!isLoading && !hasError" class="content">
  <!-- Contenu -->
</div>
```

---

## 🎯 CSS & Styling

### Tailwind Utility Classes Utilisées :

- **Spacing** : `px-8`, `py-5`, `gap-3`, `mb-6`
- **Flexbox** : `flex`, `flex-col`, `items-center`, `justify-between`
- **Colors** : `text-primary`, `bg-white`, `text-gray-600`
- **Responsive** : `hidden md:block`, `w-[250px]`, `md:w-fit`
- **Typography** : `text-3xl`, `font-bold`, `text-sm`
- **Interactive** : `hover:bg-light`, `focus:ring-2`, `transition-all`

### Classes Personnalisées :

- `.navbar-width` - Largeur navbar adaptée
- `.sidebar-active-menu` - État actif du menu
- `.sidebar-responsive` - Comportement responsive sidebar
- `.menuText` - Texte du menu

---

## 📋 Checklist pour Créer un Super Admin Dashboard

### 1. **Structure de Base**

- [ ] Créer le dossier `superadmin/` dans `submodules/`
- [ ] Créer `dashboard-superadmin.module.ts`
- [ ] Créer `dashboard-superadmin-routing.module.ts`
- [ ] Créer composant principal et layout
- [ ] Créer dossier `pages/` avec les pages métier
- [ ] Créer dossier `i18n/` avec traductions

### 2. **Modules Nécessaires à Importer**

```typescript
- CommonModule
- ReactiveFormsModule
- MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule
- CoreModule
- SharedModule
- Modules métier (CompagniesModule, JobOfferModule, etc.)
```

### 3. **Layout & Navigation**

- [ ] Hériter du pattern `DashboardLayoutComponent`
- [ ] Implémenter `loadMenu()` pour charger les items sidebar
- [ ] Utiliser `DashboardSidebarComponent` avec les bons inputs
- [ ] Utiliser `DashboardNavbarComponent`

### 4. **Pages Principales**

- [ ] Créer pages list pour chaque entité (hériter de `BaseListDeletePageComponent`)
- [ ] Créer pages détail pour chaque entité (hériter de `BaseDetailPageComponent`)
- [ ] Implémenter create/edit pages avec réactive forms
- [ ] Configurer les routes correspondantes

### 5. **Authentification & Autorisation**

- [ ] Ajouter la vérification dans le layout `ngOnInit()`
- [ ] Utiliser `authService.isSuperAdmin()` ou vérifications nécessaires
- [ ] Rediriger si non autorisé

### 6. **Traductions**

- [ ] Créer `i18n/en.json` et `i18n/fr.json`
- [ ] Définir le scope dans le module provider
- [ ] Utiliser `*transloco="let t; read:"` dans les templates

### 7. **Types & Models**

- [ ] Créer/utiliser les types TypeScript pour les entités
- [ ] Implémenter les services nécessaires

### 8. **Tests**

- [ ] Créer `.spec.ts` pour les composants principaux
- [ ] Tester la navigation et les gardes

---

## 🚀 Points Importants à Retenir

1. **Lazy Loading** : Les dashboards sont lazy-loaded pour optimiser les perfs
2. **Paramètre d'ID** : Chaque route commence par `:employerId` (convention)
3. **Héritage de Classes** : Utiliser les classes de base pour éviter la duplication
4. **Services Réutilisables** : Utiliser les services existants (CompaniesService, etc.)
5. **Traductions** : Toujours utiliser le système i18n pour les textes
6. **Responsive** : Utiliser Tailwind avec classes responsive
7. **Architecture Modulaire** : Chaque feature doit être isolée dans un sous-dossier
8. **Routing Relative** : Préférer la navigation relative pour une meilleure portabilité
9. **Guards** : Valider l'authentification dans le layout component
10. **Material Design** : Utiliser Angular Material pour la cohérence

---

## 📚 Fichiers Clés de Référence

| Fichier                             | Description                    | Localisation                        |
| ----------------------------------- | ------------------------------ | ----------------------------------- |
| `BaseListDeletePageComponent`       | Classe de base pour pages list | `src/app/@1hand/pages/`             |
| `DashboardSidebarComponent`         | Composant sidebar réutilisable | `src/app/modules/dashboard/layout/` |
| `DashboardNavbarComponent`          | Composant navbar réutilisable  | `src/app/modules/dashboard/layout/` |
| `AuthService`                       | Service d'authentification     | `src/app/modules/auth/`             |
| `dashboard-admin-routing.module.ts` | Exemple de routing complet     | Admin dashboard                     |
| `dashboard-admin.module.ts`         | Exemple de module setup        | Admin dashboard                     |
| `dashboard-candidates.service.ts`   | Exemple service dashboard      | Candidates dashboard                |
