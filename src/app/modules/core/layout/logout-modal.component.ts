import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: false,

  selector: 'app-logout-modal',
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <div class="modal-container">
      <!-- Titre de la modal -->
      <div class="modal-header">
        <h2>Confirmer</h2>
      </div>
      <!-- Contenu du corps de la modal -->
      <div class="custom-modal-body">
        <div class="loading-container">
          <p>Voulez vous vraiment vous déconnecter ?</p>
        </div>
      </div>

      <!-- Bouton aligné en bas à droite -->
      <div class="modal-footer">
        <button mat-button (click)="onClickOk()">OK</button>
        <button mat-flat-button (click)="onClickCancel()">Cancel</button>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: fit-content;
        max-width: 100%;
        // max-width: 400px;
        // text-align: center;
        padding: 20px;
      }

      .modal-header {
        width: 100%;
        margin: 0;
        padding: 0;
        // text-align: start;
      }

      .custom-modal-body {
        max-width: 400px;
        width: 100%;
        padding: 0px 20px;
        display: flex;
        flex-direction: column;
        // align-items: center;
        justify-content: start;
        overflow: hidden;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      .message {
        display: flex;
        // align-items: center;
        gap: 8px;
        font-size: 16px;
        // padding: 10px;
        border-radius: 5px;
        // margin-top: 20px;
        text-align: center;
        width: 100%;
      }

      .success {
        // background-color: #d4edda;
        color: #155724;
        // border: 1px solid #c3e6cb;
      }

      .error {
        // background-color: #f8d7da;
        color: #721c24;
        // border: 1px solid #f5c6cb;
      }

      .modal-footer {
        display: flex;
        justify-content: flex-end;
        width: 100%;
        padding-top: 10px;
      }

      button {
        padding: 8px 15px;
        // background-color: #007bff;
        // color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
      }

      button:hover {
        // background-color: #0056b3;
      }
    `,
  ],
})
export class LogoutModalComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      // loading: boolean;
      // successMessage?: string;
      // errorMessage?: string;
      handleOk?: Function;
    }
  ) {}

  onClickOk(): void {
    if (this.data.handleOk) {
      this.data.handleOk();
      return;
    }
    // this.dialogRef.close();
  }

  onClickCancel() {
    this.dialogRef.close();
  }
}
