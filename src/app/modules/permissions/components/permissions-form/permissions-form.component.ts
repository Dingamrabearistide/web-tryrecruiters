import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TranslocoService } from "@ngneat/transloco";
import {
  Permission,
  PermissionFormData,
  PermissionAction,
  ResourceType,
} from "../../permissions.type";
import { FieldConfig } from "../../../../@1hand/components/generic-form/generic-form.component";

@Component({
  standalone: false,

  selector: "app-permissions-form",
  templateUrl: "./permissions-form.component.html",
})
export class PermissionsFormComponent implements OnInit {
  @Input() item: Permission | null = null;
  @Input() isLoading = false;
  @Input() hasError = false;
  @Input() errorMessage = "";

  form!: FormGroup;
  genericFormConfig: FieldConfig[] = [];

  constructor(private fb: FormBuilder, private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.initForm();
    this.setupFormConfig();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [
        this.item?.name || "",
        [Validators.required, Validators.maxLength(100)],
      ],
      description: [this.item?.description || "", [Validators.maxLength(500)]],
      resource: [this.item?.resource || "", [Validators.required]],
      action: [this.item?.action || "", [Validators.required]],
      archived: [this.item?.archived || false],
      notes: [this.item?.notes || "", [Validators.maxLength(1000)]],
    });
  }

  private setupFormConfig(): void {
    this.genericFormConfig = [
      {
        name: "name",
        type: "string",
        label: this.transloco.translate("permissions.form.name"),
        placeholder: this.transloco.translate(
          "permissions.form.namePlaceholder"
        ),
        required: true,
        validation: [Validators.required, Validators.maxLength(100)],
        errorMessages: {
          required: this.transloco.translate("formErrors.required"),
          maxlength: this.transloco.translate("formErrors.maxlength", {
            length: 100,
          }),
        },
      },
      {
        name: "description",
        type: "textarea",
        label: this.transloco.translate("permissions.form.description"),
        placeholder: this.transloco.translate(
          "permissions.form.descriptionPlaceholder"
        ),
        required: false,
        validation: [Validators.maxLength(500)],
        errorMessages: {
          maxlength: this.transloco.translate("formErrors.maxlength", {
            length: 500,
          }),
        },
      },
      {
        name: "resource",
        type: "select",
        label: this.transloco.translate("permissions.form.resource"),
        placeholder: this.transloco.translate(
          "permissions.form.selectResource"
        ),
        required: true,
        validation: [Validators.required],
        errorMessages: {
          required: this.transloco.translate("formErrors.required"),
        },
        options: Object.values(ResourceType).map((resource) => ({
          value: resource,
          label: this.transloco.translate(`permissions.resources.${resource}`),
        })),
      },
      {
        name: "action",
        type: "select",
        label: this.transloco.translate("permissions.form.action"),
        placeholder: this.transloco.translate("permissions.form.selectAction"),
        required: true,
        validation: [Validators.required],
        errorMessages: {
          required: this.transloco.translate("formErrors.required"),
        },
        options: Object.values(PermissionAction).map((action) => ({
          value: action,
          label: this.transloco.translate(`permissions.actions.${action}`),
        })),
      },
      {
        name: "archived",
        type: "checkbox",
        label: this.transloco.translate("permissions.form.archived"),
        required: false,
      },
      {
        name: "notes",
        type: "textarea",
        label: this.transloco.translate("permissions.form.notes"),
        placeholder: this.transloco.translate(
          "permissions.form.notesPlaceholder"
        ),
        required: false,
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          maxlength: this.transloco.translate("formErrors.maxlength", {
            length: 1000,
          }),
        },
      },
    ];
  }

  getFormData(): PermissionFormData {
    return this.form.value as PermissionFormData;
  }

  isFormValid(): boolean {
    return this.form.valid;
  }

  markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsTouched();
    });
  }
}
