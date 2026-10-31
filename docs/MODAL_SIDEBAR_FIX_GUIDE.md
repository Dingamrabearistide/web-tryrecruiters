# Guide de Résolution du Décalage de Sidebar avec les Modals Angular Material

## Problème Identifié

Lorsqu'une modal Angular Material s'ouvre, elle peut causer un décalage de la sidebar vers le haut. Ce problème est dû à :

1. **Gestion automatique du scroll** : Angular Material désactive automatiquement le scroll du body et ajoute un `padding-right` pour compenser la largeur de la scrollbar
2. **Recalcul de largeur** : Cela modifie la largeur effective du viewport, causant un décalage des éléments positionnés avec `calc(100% - 250px)`
3. **Transition de layout** : Le changement soudain de largeur crée un effet visuel de décalage

## Solutions Implémentées

### 1. Solution Globale (Recommandée)

#### A. Styles CSS Globaux (`src/styles.scss`)

```scss
/* ===== SOLUTION GLOBALE POUR LE DÉCALAGE DE SIDEBAR AVEC LES MODALS ===== */

/* Prévenir le décalage du layout lors de l'ouverture des modals Angular Material */
.cdk-global-scrollblock {
  padding-right: 0 !important;
  overflow: hidden;
  width: 100% !important;
}

/* Correction spécifique pour maintenir la largeur de la sidebar */
.sidebar-container,
.navbar-width {
  transition: none !important;
  width: calc(100% - 250px) !important;
}

/* Responsive - maintenir le comportement mobile */
@media (max-width: 768px) {
  .sidebar-container,
  .navbar-width {
    width: 100vw !important;
  }
}
```

#### B. Service Modal Réutilisable (`src/app/@1hand/services/modal.service.ts`)

```typescript
import { Injectable } from "@angular/core";
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from "@angular/material/dialog";
import { ComponentType } from "@angular/cdk/portal";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  openModal<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    const defaultConfig: MatDialogConfig = {
      disableClose: false,
      hasBackdrop: true,
      panelClass: "custom-dialog-container",
      autoFocus: false,
      restoreFocus: false,
      width: "fit-content",
      maxWidth: "90vw",
      maxHeight: "90vh",
    };

    const finalConfig = { ...defaultConfig, ...config };
    return this.dialog.open(component, finalConfig);
  }
}
```

### 2. Configuration des Modals dans les Composants

#### Avant (Problématique)

```typescript
openModal() {
  this.dialogRef = this.dialog.open(GenericModalComponent, {
    width: "fit-content",
    maxWidth: "99vw",
    data: { title: "", template: "", actions: [] },
  });
}
```

#### Après (Corrigé)

```typescript
openModal() {
  this.dialogRef = this.dialog.open(GenericModalComponent, {
    width: "fit-content",
    maxWidth: "99vw",
    data: { title: "", template: "", actions: [] },
    disableClose: false,
    hasBackdrop: true,
    panelClass: "custom-dialog-container",
    autoFocus: false,
    restoreFocus: false,
  });
}
```

#### Ou mieux, utiliser le service modal

```typescript
constructor(private modalService: ModalService) {}

openModal() {
  this.dialogRef = this.modalService.openModal(GenericModalComponent, {
    data: { title: "", template: "", actions: [] },
  });
}
```

## Comment Appliquer la Solution aux Autres Composants

### Étape 1 : Vérifier les Styles Globaux

Les styles globaux dans `src/styles.scss` s'appliquent automatiquement à toute l'application.

### Étape 2 : Mettre à Jour les Composants Existants

Pour chaque composant qui ouvre des modals :

1. **Importer le service modal** :

```typescript
import { ModalService } from "@app/@1hand/services/modal.service";
```

2. **Injecter le service** :

```typescript
constructor(private modalService: ModalService) {}
```

3. **Remplacer les appels directs à MatDialog** :

```typescript
// Ancien code
this.dialog.open(MyComponent, config);

// Nouveau code
this.modalService.openModal(MyComponent, config);
```

### Étape 3 : Composants à Mettre à Jour

Rechercher dans le projet tous les fichiers qui utilisent `MatDialog` :

```bash
# Rechercher les fichiers utilisant MatDialog
grep -r "MatDialog" src/app --include="*.ts"

# Rechercher les appels à dialog.open
grep -r "dialog.open" src/app --include="*.ts"
```

### Étape 4 : Validation

Pour chaque composant modifié :

1. **Tester l'ouverture de modal** : Vérifier qu'il n'y a plus de décalage
2. **Tester la fermeture** : S'assurer que le layout revient à la normale
3. **Tester sur mobile** : Vérifier le comportement responsive

## Composants Déjà Corrigés

- ✅ `CandidatesCertificationsListComponent`

## Composants à Corriger

Identifier et corriger les composants suivants (liste non exhaustive) :

- `CandidatesExperiencesListComponent`
- `CandidatesEducationListComponent`
- `CandidatesSkillsListComponent`
- `CandidatesLanguagesListComponent`
- Tous les autres composants utilisant des modals

## Avantages de Cette Solution

1. **Solution globale** : Corrige le problème pour toute l'application
2. **Réutilisable** : Le service modal peut être utilisé partout
3. **Maintenable** : Configuration centralisée
4. **Performance** : Évite les transitions inutiles
5. **Responsive** : Fonctionne sur tous les écrans

## Dépannage

### Si le problème persiste :

1. **Vérifier les classes CSS** : S'assurer que `.sidebar-container` et `.navbar-width` sont bien appliquées
2. **Inspecter le DOM** : Vérifier que `cdk-global-scrollblock` est présent sur le body
3. **Tester sans autres styles** : Désactiver temporairement d'autres styles pour isoler le problème
4. **Vérifier la version d'Angular Material** : S'assurer de la compatibilité

### Logs de débogage :

```typescript
openModal() {
  console.log('Avant ouverture modal:', document.body.classList);
  this.dialogRef = this.modalService.openModal(Component);
  console.log('Après ouverture modal:', document.body.classList);
}
```

## Maintenance Future

- **Nouveaux composants** : Utiliser systématiquement `ModalService`
- **Mise à jour Angular Material** : Tester la compatibilité
- **Tests automatisés** : Ajouter des tests pour vérifier l'absence de décalage

---

_Ce guide doit être mis à jour à chaque modification de la solution ou découverte de nouveaux cas d'usage._
