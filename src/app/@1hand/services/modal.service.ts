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
  constructor(private dialog: MatDialog) {}

  /**
   * Ouvre une modal avec les configurations optimisées pour éviter le décalage de sidebar
   * @param component - Le composant à afficher dans la modal
   * @param config - Configuration personnalisée pour la modal
   * @returns MatDialogRef de la modal ouverte
   */
  openModal<T, D = any, R = any>(
    component: ComponentType<T>,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {
    // Configuration par défaut pour éviter le décalage de sidebar
    const defaultConfig: MatDialogConfig = {
      // Empêcher la fermeture accidentelle
      disableClose: false,
      // Activer le backdrop
      hasBackdrop: true,
      // Classe CSS personnalisée pour les styles
      panelClass: "custom-dialog-container",
      // Désactiver l'auto-focus pour éviter les problèmes de layout
      autoFocus: false,
      // Désactiver la restauration du focus
      restoreFocus: false,
      // Largeur adaptative
      width: "fit-content",
      maxWidth: "90vw",
      maxHeight: "90vh",
      // Position centrée
      position: {
        top: "50%",
        left: "50%",
      },
      // Données par défaut
      data: {},
    };

    // Fusionner la configuration par défaut avec la configuration personnalisée
    const finalConfig = { ...defaultConfig, ...config };

    // Ouvrir la modal avec la configuration optimisée
    return this.dialog.open(component, finalConfig);
  }

  /**
   * Ferme toutes les modals ouvertes
   */
  closeAll(): void {
    this.dialog.closeAll();
  }

  /**
   * Vérifie si des modals sont actuellement ouvertes
   * @returns true si des modals sont ouvertes, false sinon
   */
  hasOpenDialogs(): boolean {
    return this.dialog.openDialogs.length > 0;
  }

  /**
   * Obtient la référence de la dernière modal ouverte
   * @returns MatDialogRef de la dernière modal ou undefined
   */
  getLastOpenDialog<T>(): MatDialogRef<T> | undefined {
    const openDialogs = this.dialog.openDialogs;
    return openDialogs.length > 0
      ? (openDialogs[openDialogs.length - 1] as MatDialogRef<T>)
      : undefined;
  }

  /**
   * Ouvre une modal de confirmation avec un style standardisé
   * @param title - Titre de la modal
   * @param message - Message de confirmation
   * @param confirmText - Texte du bouton de confirmation (par défaut: "Confirmer")
   * @param cancelText - Texte du bouton d'annulation (par défaut: "Annuler")
   * @returns Promise<boolean> - true si confirmé, false si annulé
   */
  openConfirmDialog(
    title: string,
    message: string,
    confirmText: string = "Confirmer",
    cancelText: string = "Annuler"
  ): Promise<boolean> {
    // Cette méthode peut être étendue pour utiliser un composant de confirmation personnalisé
    return new Promise((resolve) => {
      const confirmed = window.confirm(`${title}\n\n${message}`);
      resolve(confirmed);
    });
  }
}
