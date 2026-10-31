import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { TranslocoModule } from "@ngneat/transloco";
import { AdminSetting } from "../../services/admin-platform-settings.service";

@Component({
  selector: "app-settings-edit-dialog",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
  ],
  template: `
    <h2 mat-dialog-title>
      {{
        data.setting
          ? "dashboard.admin.settings.edit"
          : ("dashboard.admin.settings.create" | transloco)
      }}
    </h2>

    <mat-dialog-content [formGroup]="settingForm">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ "dashboard.admin.settings.key" | transloco }}</mat-label>
        <input
          matInput
          formControlName="key"
          [readonly]="data.setting !== null"
        />
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ "dashboard.admin.settings.type" | transloco }}</mat-label>
        <mat-select formControlName="type">
          <mat-option value="string">String</mat-option>
          <mat-option value="number">Number</mat-option>
          <mat-option value="boolean">Boolean</mat-option>
          <mat-option value="json">JSON</mat-option>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{
          "dashboard.admin.settings.value" | transloco
        }}</mat-label>
        <textarea matInput formControlName="value" rows="4"></textarea>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">
        {{ "common.cancel" | transloco }}
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="!settingForm.valid"
      >
        {{ "common.save" | transloco }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      mat-dialog-content {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 400px;
      }
    `,
  ],
})
export class SettingsEditDialogComponent implements OnInit {
  settingForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SettingsEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { setting: AdminSetting | null },
  ) {
    this.settingForm = this.fb.group({
      key: ["", Validators.required],
      type: ["string", Validators.required],
      value: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data.setting) {
      this.settingForm.patchValue(this.data.setting);
      this.settingForm.get("key")?.disable();
    }
  }

  onSave(): void {
    if (this.settingForm.valid) {
      const value = this.settingForm.value;
      this.dialogRef.close({
        ...value,
        key: value.key,
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
