# GenericModal Component

Un composant modal réutilisable et configurable pour l'application TryRecruiters.

## Fonctionnalités

- Modal responsive avec différentes tailles
- Configuration flexible via l'interface `ModalConfig`
- Support pour le contenu personnalisé via `ng-content`
- Animations d'ouverture/fermeture
- Fermeture par clic sur le backdrop (configurable)
- Boutons d'action personnalisables

## Utilisation

### 1. Import du module

Le composant est déjà exporté par le `SharedModule`. Assurez-vous d'importer le `SharedModule` dans votre module :

```typescript
import { SharedModule } from "../shared/shared.module";

@NgModule({
  imports: [
    // autres imports...
    SharedModule,
  ],
  // ...
})
export class VotreModule {}
```

### 2. Utilisation dans le template

```html
<app-generic-modal
  [isOpen]="isModalOpen"
  [config]="modalConfig"
  (onClose)="onModalClose()"
  (onConfirm)="onModalConfirm()"
  (onCancel)="onModalCancel()"
>
  <!-- Votre contenu personnalisé ici -->
  <div class="text-center">
    <h3 class="text-lg font-medium text-gray-900 mb-2">Titre du contenu</h3>
    <p class="text-sm text-gray-500">Votre message personnalisé ici.</p>
  </div>
</app-generic-modal>
```

### 3. Configuration dans le composant

```typescript
import { ModalConfig } from "../shared/components/generic-modal/generic-modal.component";

export class VotreComponent {
  isModalOpen = false;

  modalConfig: ModalConfig = {
    title: "Confirmation",
    size: "md",
    showCloseButton: true,
    closeOnBackdropClick: true,
    showFooter: true,
    confirmText: "Confirmer",
    cancelText: "Annuler",
    confirmButtonClass: "bg-blue-500 hover:bg-blue-600 text-white",
    cancelButtonClass: "bg-gray-300 hover:bg-gray-400 text-gray-700",
  };

  onModalClose(): void {
    this.isModalOpen = false;
  }

  onModalConfirm(): void {
    // Logique de confirmation
    console.log("Confirmé");
    this.onModalClose();
  }

  onModalCancel(): void {
    // Logique d'annulation
    console.log("Annulé");
    this.onModalClose();
  }
}
```

## Configuration (ModalConfig)

| Propriété | Type | Déf
