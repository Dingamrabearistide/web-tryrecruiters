import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ElementRef,
  HostListener,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { GenericAutoCompleteComponent } from "../generic-autocomplete/generic-autocomplete.component";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { GenericTextEditorComponent } from "../generic-text-editor/generic-text-editor.component";
import { GenericFileUploadButtonComponent } from "../generic-file-manager/generic-file-upload-button/generic-file-upload-button.component";
import { GenericFileManagerFileItem } from "../generic-file-manager/generic-file-manager-modal/generic-file-manager-modal.component";
import { ImagePreviewComponent } from "../image-preview/image-preview.component";
import { CountrySelectComponent } from "../country-select/country-select.component";
import { SearchableSelectComponent } from "../searchable-select/searchable-select.component";
import { PhoneInputComponent } from "../phone-input/phone-input.component";
import { blockInvalidNumberKeys } from "../../utils";

export interface FieldConfig {
  name: string;
  label: string;
  type?: FieldType;
  options?: any[];
  required?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  multiple?: boolean;
  acceptedFileExtensions?: string[];
  fieldset?: string;
  disabled?: boolean;
  loading?: boolean; //  spinner sur les selects en cours de chargement
  maxDate?: string;
  minDate?: string;
  defaultValue?: any;
  dynamicConfig?: (
    formValues: any,
  ) => Partial<Omit<FieldConfig, "dynamicConfig">>;
  validation?: any[];
  errorMessages?: { [key: string]: string };
  order?: number;
  size?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  displayFn?: (item: any) => string;
  formatDefaultValue?: (value: any) => any;
  editorOptions?: {
    minHeight?: number;
    readOnly?: boolean;
    toolbarSticky?: boolean;
  };
  /** For type "number-with-select": a second control (e.g. a currency
   * picker) rendered flush against the number input, inside the same
   * bordered box, so the two read as one compound field. */
  unitField?: {
    name: string;
    placeholder?: string;
    options?: any[];
    required?: boolean;
    disabled?: boolean;
    loading?: boolean;
    validation?: any[];
    defaultValue?: any;
    errorMessages?: { [key: string]: string };
  };
}

type FieldType =
  | "string"
  | "password"
  | "number"
  | "number-with-select"
  | "select"
  | "searchable-select"
  | "country"
  | "autocomplete"
  | "date"
  | "datetime"
  | "file"
  | "fileuploader"
  | "url"
  | "textarea"
  | "phone"
  | "checkbox"
  | "richtext";

@Component({
  selector: "app-generic-form",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    GenericAutoCompleteComponent,
    GenericTextEditorComponent,
    GenericFileUploadButtonComponent,
    ImagePreviewComponent,
    CountrySelectComponent,
    SearchableSelectComponent,
    PhoneInputComponent,
  ],
  templateUrl: "./generic-form.component.html",
  styleUrls: ["./generic-form.component.scss"],
})
export class GenericFormComponent implements OnInit, OnChanges {
  @Input() fieldConfigurations: FieldConfig[] = [];
  @Input() defaultValues: any = {};
  @Input() errorMessage?: string;
  @Input() transationNamespace?: string;
  @Input() isLoading = false;
  @Input() showActionButton = true;
  @Output() submitForm = new EventEmitter<any>();
  @Output() formReady = new EventEmitter<FormGroup>();

  form!: FormGroup;
  fieldsets: Record<string, FieldConfig[]> = {};
  submitted = false;

  /** Name of the field (a regular "select", or the unitField of a
   * "number-with-select") whose custom dropdown panel is open. Native
   * <select> popups can open upward when short on room below and end up
   * covering the field's own label — rendering dropdowns ourselves keeps
   * them anchored directly under their trigger, like every other custom
   * dropdown in the app, and lets us keep the panel on-screen on mobile. */
  openDropdown: string | null = null;

  /** Names of "password" fields currently showing plain text instead of
   * dots, toggled per-field via the eye icon. */
  visiblePasswordFields = new Set<string>();

  togglePasswordVisibility(fieldName: string): void {
    if (this.visiblePasswordFields.has(fieldName)) {
      this.visiblePasswordFields.delete(fieldName);
    } else {
      this.visiblePasswordFields.add(fieldName);
    }
  }

  isPasswordVisible(fieldName: string): boolean {
    return this.visiblePasswordFields.has(fieldName);
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private translocoService: TranslocoService,
    private el: ElementRef,
  ) {}

  toggleDropdown(fieldName: string): void {
    if (this.openDropdown === fieldName) {
      this.closeDropdown(fieldName);
    } else {
      this.openDropdown = fieldName;
      // The dropdown panel is absolutely positioned under its trigger; when
      // the form renders inside a height-constrained scroll container (e.g.
      // a modal's mat-dialog-content), a panel opened near the bottom can
      // render past that container's visible area. Scrolling the trigger
      // into view right after opening keeps the panel visible without the
      // user having to go hunting for it.
      setTimeout(() => {
        const trigger = this.el.nativeElement.querySelector(`[id="${fieldName}"]`);
        trigger?.scrollIntoView?.({ block: "center", behavior: "smooth" });
      });
    }
  }

  selectOption(fieldName: string, value: any): void {
    const control = this.form.get(fieldName);
    control?.setValue(value);
    control?.markAsTouched();
    this.openDropdown = null;
  }

  private closeDropdown(fieldName: string): void {
    this.form.get(fieldName)?.markAsTouched();
    this.openDropdown = null;
  }

  /** Without these, `fieldsets` being reassigned to a new object on every
   * refreshConfig() call (e.g. while loading city/region/currency options
   * asynchronously) makes the outer *ngFor's default identity-based diff
   * treat every fieldset group as new, destroying and recreating every
   * field's component inside it — including ones mid-interaction, like a
   * country dropdown that was just clicked but hasn't closed yet, or one
   * that self-loads its option list and loses that in-flight state when
   * torn down and rebuilt. Keying by the field/fieldset identity instead
   * keeps those component instances alive across the rebuild. */
  trackFieldset = (_: number, fieldset: { key: string }) => fieldset.key;
  trackField = (_: number, field: FieldConfig) => field.name;

  getSelectedOptionLabel(fieldName: string, options?: any[]): string {
    const value = this.form?.get(fieldName)?.value;
    // A plain `!value` check treats a legitimately-selected `false` (e.g.
    // an "isPublished: No" option) the same as nothing selected, which
    // made boolean-valued selects show their placeholder even though a
    // real value was already chosen and would pass a required validator.
    if (value === undefined || value === null || value === "") return "";
    const match = (options || []).find((o) => o.value === value);
    return match ? this.tryTranslate(match.label) : value;
  }

  @HostListener("document:click", ["$event"])
  onDocumentClickCloseDropdown(event: MouseEvent): void {
    if (this.openDropdown && !this.el.nativeElement.contains(event.target)) {
      this.closeDropdown(this.openDropdown);
    }
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //  Quand defaultValues change après init
    if (changes["defaultValues"] && !changes["defaultValues"].firstChange) {
      this.patchDefaultValues();
    }

    // Quand fieldConfigurations change (options, disabled, loading mis à jour par le parent)
    if (
      changes["fieldConfigurations"] &&
      !changes["fieldConfigurations"].firstChange
    ) {
      this.syncFieldConfigChanges();
    }
  }

  initializeForm() {
    const group: Record<string, FormControl> = {};
    this.fieldsets = {};

    this.fieldConfigurations.forEach((field) => {
      const dynamicConfig = field.dynamicConfig
        ? field.dynamicConfig(this.defaultValues)
        : {};
      const mergedField = { ...field, ...dynamicConfig };

      const validators = mergedField.validation
        ? [...mergedField.validation]
        : [];
      if (mergedField.required) {
        validators.push(Validators.required);
      }

      const defaultValue =
        this.defaultValues?.[mergedField.name] ??
        mergedField.defaultValue ??
        "";

      group[mergedField.name] = new FormControl(
        { value: defaultValue, disabled: !!mergedField.disabled },
        validators,
      );

      if (mergedField.unitField) {
        const unitField = mergedField.unitField;
        const unitValidators = unitField.validation
          ? [...unitField.validation]
          : [];
        if (unitField.required) {
          unitValidators.push(Validators.required);
        }
        const unitDefaultValue =
          this.defaultValues?.[unitField.name] ?? unitField.defaultValue ?? "";

        group[unitField.name] = new FormControl(
          { value: unitDefaultValue, disabled: !!unitField.disabled },
          unitValidators,
        );
      }

      const key = mergedField.fieldset || "Default";
      if (!this.fieldsets[key]) {
        this.fieldsets[key] = [];
      }
      this.fieldsets[key].push(mergedField);
    });

    this.form = this.fb.group(group);
    this.patchDefaultValues();
    this.formReady.emit(this.form);
  }

  //  Synchronise les changements de fieldConfigurations sans recréer le formulaire
  syncFieldConfigChanges(): void {
    if (!this.form) return;

    // Rebuild fieldsets pour que le template re-render avec les nouvelles options/loading
    this.fieldsets = {};
    this.fieldConfigurations.forEach((field) => {
      const key = field.fieldset || "Default";
      if (!this.fieldsets[key]) this.fieldsets[key] = [];
      this.fieldsets[key].push(field);

      // ctiver/désactiver le contrôle selon field.disabled
      const control = this.form.get(field.name);
      if (control) {
        if (field.disabled) {
          control.disable({ emitEvent: false });
        } else {
          control.enable({ emitEvent: false });
        }
      }
    });

    this.cdr.detectChanges();
  }

  patchDefaultValues(): void {
    if (!this.form || !this.defaultValues) return;

    const fieldMap = new Map<string, FieldConfig>();
    for (const f of this.fieldConfigurations) {
      fieldMap.set(f.name, f);
    }

    Object.entries(this.defaultValues).forEach(([key, value]) => {
      const control = this.form.get(key);
      const field = fieldMap.get(key);
      if (control) {
        const formattedValue = field?.formatDefaultValue
          ? field.formatDefaultValue(value)
          : value;
        control.patchValue(formattedValue);
      }
    });
  }

  blockInvalidNumberKeys = blockInvalidNumberKeys;

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return !!(
      control &&
      control.invalid &&
      (control.touched || this.submitted)
    );
  }

  submit(): void {
    this.onSubmit();
  }

  onSubmit(): void {
    this.submitted = true;
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.submitForm.emit(this.form.value);
    }
  }

  getFieldSizeClasses(field: FieldConfig): string {
    const size = field.size || {};
    const xs = size.xs ?? 12;
    const sm = size.sm ?? xs;
    const md = size.md ?? sm;
    const lg = size.lg ?? md;
    const xl = size.xl ?? lg;

    return `col-${xs} col-sm-${sm} col-md-${md} col-lg-${lg} col-xl-${xl}`;
  }

  onFileChange(event: any, field: FieldConfig) {
    const files = event.target.files;
    const control = this.form.get(field.name);
    if (!control) return;

    if (files && field.multiple) {
      control.setValue(Array.from(files));
    } else if (files && files[0]) {
      control.setValue(files[0]);
    }
  }

  getKeys(object: Object): string[] {
    return Object.keys(object);
  }

  getTranslatedErrorMessage(
    field: Pick<FieldConfig, "name" | "errorMessages">,
  ): string {
    const errors = this.form.get(field.name)?.errors;
    if (!errors) return "";

    const firstKey = Object.keys(errors)[0];
    const namespace = this.transationNamespace || "settings";

    if (field.errorMessages?.[firstKey]) {
      const errorKey = field.errorMessages[firstKey];

      if (firstKey === "maxlength" && errors[firstKey]?.requiredLength) {
        return this.translocoService.translate(`${namespace}.${errorKey}`, {
          max: errors[firstKey].requiredLength,
        });
      }

      if (firstKey === "minlength" && errors[firstKey]?.requiredLength) {
        return this.translocoService.translate(`${namespace}.${errorKey}`, {
          min: errors[firstKey].requiredLength,
        });
      }

      return this.translocoService.translate(`${namespace}.${errorKey}`);
    }

    if (firstKey === "required") {
      return this.translocoService.translate("formErrors.required");
    }
    if (firstKey === "email") {
      return this.translocoService.translate("formErrors.email");
    }
    if (firstKey === "maxlength" && errors[firstKey]?.requiredLength) {
      return this.translocoService.translate("formErrors.maxlength", {
        max: errors[firstKey].requiredLength,
      });
    }
    if (firstKey === "minlength" && errors[firstKey]?.requiredLength) {
      return this.translocoService.translate("formErrors.minlength", {
        min: errors[firstKey].requiredLength,
      });
    }

    return this.translocoService.translate("formErrors.invalidValue");
  }

  getFormControl(fieldName: string): FormControl {
    return this.form.get(fieldName) as FormControl;
  }

  //  Tente la traduction — retourne le label brut si ce n'est pas une clé i18n
  // Cela évite que les noms de pays/villes soient passés dans transloco
  tryTranslate(key: string): string {
    if (!key) return "";
    // Si le label ne contient pas de '.' ce n'est pas une clé i18n : retour direct
    if (!key.includes(".")) return key;
    const translated = this.translocoService.translate(key);
    // Si transloco retourne la clé elle-même, la clé n'existe pas
    return translated === key ? key : translated;
  }

  defaultDisplayFn = (item: any): string => {
    if (!item) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      return item.label ?? item.name ?? JSON.stringify(item);
    }
    return String(item);
  };

  handleChoose(file: GenericFileManagerFileItem, field: FieldConfig) {
    this.form.patchValue({ [field.name]: file });
    this.cdr.detectChanges();
  }

  getFilePreview(field: FieldConfig) {
    const control = this.form.get(field.name);
    const value = control?.value;
    if (!value || typeof value !== "object") return null;
    return value.url || null;
  }

  isImageFile(field: FieldConfig): boolean {
    const control = this.form.get(field.name);
    const value = control?.value;
    if (!value || typeof value !== "object") return false;

    const url = value.url || "";
    const imageExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".gif",
      ".bmp",
      ".webp",
      ".svg",
    ];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  }

  getFileName(field: FieldConfig): string {
    const control = this.form.get(field.name);
    const value = control?.value;
    if (!value || typeof value !== "object") return "";
    return value.originalName || value.filename || "Fichier";
  }

  getFileType(field: FieldConfig): string {
    const control = this.form.get(field.name);
    const value = control?.value;
    if (!value || typeof value !== "object") return "";

    const mimetype = value.mimetype || "";
    if (mimetype.includes("pdf")) return "PDF";
    if (mimetype.includes("word") || mimetype.includes("document"))
      return "Document Word";
    if (mimetype.includes("text")) return "Document texte";
    return mimetype || "Document";
  }

  getAcceptedTypesLabel(field: FieldConfig): string {
    if (
      !field.acceptedFileExtensions ||
      field.acceptedFileExtensions.length === 0
    ) {
      return "jpeg, png";
    }
    return field.acceptedFileExtensions
      .map((ext) => ext.replace(".", ""))
      .join(", ");
  }

  removeFile(field: FieldConfig): void {
    const control = this.form.get(field.name);
    if (control) {
      control.setValue(null);
      control.markAsTouched();
    }

    const fileInputs = document.querySelectorAll(
      `input[type="file"]#${field.name}`,
    );
    fileInputs.forEach((input: any) => {
      input.value = "";
    });
    this.cdr.detectChanges();
  }

  getAcceptedExtensions(field: FieldConfig): string {
    if (
      !field.acceptedFileExtensions ||
      field.acceptedFileExtensions.length === 0
    ) {
      return "PDF, DOC, DOCX, JPG, PNG";
    }
    return field.acceptedFileExtensions
      .map((ext) => ext.replace(".", "").toUpperCase())
      .join(", ");
  }
}
