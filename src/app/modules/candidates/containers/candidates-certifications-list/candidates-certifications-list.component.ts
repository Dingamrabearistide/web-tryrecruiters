import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  HostListener,
} from "@angular/core";
import { Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CandidatesService as Service } from "@modules/candidates/candidates.service";
import {
  Candidate as TObject,
  CandidateCertification as ModuleObject,
} from "@modules/candidates/candidates.types";
import { TranslocoService } from "@ngneat/transloco";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import {
  GenericModalComponent,
  GenericModalType,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { formatDateForInput } from "../../../../@1hand/utils";

@Component({
  standalone: false,

  selector: "app-candidates-certifications-list",
  templateUrl: "./candidates-certifications-list.component.html",
  styleUrls: ["./candidates-certifications-list.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesCertificationsListComponent implements OnInit {
  @ViewChild("form") formTemplate!: TemplateRef<GenericFormComponent>;
  @ViewChild(GenericFormComponent) form!: GenericFormComponent;

  @Input() profile!: TObject;
  dialogRef!: MatDialogRef<GenericModalComponent>;

  @Output() onDone: EventEmitter<TObject> = new EventEmitter();

  moduleName: string = "candidates";
  isLoading = false;
  hasError = false;
  errorMessage: string = "";

  formConfig: FieldConfig[] = [];
  defaultValues: ModuleObject | null = null;
  // dropdown for filters
  public showFiltersDropdown: boolean = false;

  toggleFiltersDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.showFiltersDropdown = !this.showFiltersDropdown;
  }

  closeFiltersDropdown() {
    this.showFiltersDropdown = false;
  }

  resetFilters() {
    this.sortOrder = "desc";
    this.showAll = false;
  }

  @HostListener("document:click", ["$event"])
  handleDocumentClick(_event: any) {
    if (!this.showFiltersDropdown) return;
    this.showFiltersDropdown = false;
  }
  // sorting
  public sortOrder: "asc" | "desc" = "desc"; // default: most recent first

  constructor(
    protected service: Service,
    protected dialog: MatDialog,
    protected transloco: TranslocoService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.setupFormConfig();
    this.isLoading = false;
    this.hasError = false;
    this.errorMessage = "";
  }

  onFormReady(form: any): void {
    form.get('issueDate')?.valueChanges.subscribe((val: string) => {
      const expirationField = this.formConfig.find(f => f.name === 'expirationDate');
      if (expirationField) expirationField.minDate = val || undefined;
      this.formConfig = [...this.formConfig];
    });
  }

  onSubmit(formData: any): void {
    // Réinitialiser les erreurs
    this.hasError = false;
    this.errorMessage = "";

    if (formData.issueDate && formData.expirationDate && new Date(formData.expirationDate) <= new Date(formData.issueDate)) {
      this.errorMessage = this.transloco.translate("formErrors.endDateBeforeStartDate");
      this.hasError = true;
      return;
    }

    const payload = this.defaultValues
      ? this.buildUpdatePayload(formData)
      : this.buildCreatePayload(formData);

    console.log(payload);
    this.handleCreate(payload, this.defaultValues ? "update" : "create");
  }

  handleCreate(
    data: Partial<TObject>,
    action: "create" | "update" = "create",
  ): void {
    if (this.isLoading) return;

    this.setIsLoading(this.dialogRef, true);

    this.hasError = false;
    this.errorMessage = "";

    const $observable =
      action === "update" && this.defaultValues
        ? this.service.update(this.profile.id, data)
        : this.service.create(data);

    console.log("in creation: ", data, this.defaultValues);

    $observable.subscribe({
      next: (createdItem: TObject) => {
        this.setIsLoading(this.dialogRef, false);
        this.hasError = false;
        this.errorMessage = "";
        this.defaultValues = null;
        this.dialogRef.close();
        this.handleDone(createdItem);
      },
      error: (error: any) => {
        this.setIsLoading(this.dialogRef, false);
        this.hasError = true;
        this.errorMessage =
          error?.error?.message ||
          this.transloco.translate("general.genericError");
      },
    });
  }

  protected showResultModal(
    dialogRef: MatDialogRef<GenericModalComponent>,
    titleKey: string,
    messageKey: string,
    name: string,
    type: GenericModalType = "info",
    success: boolean = false,
    onClose?: () => void,
  ) {
    const instance = dialogRef.componentInstance;

    if (!instance) return;

    instance.data.title = this.transloco.translate(titleKey);
    instance.data.content = this.transloco.translate(messageKey, { name });
    instance.data.type = type;
    instance.data.actions = [
      {
        id: "ok",
        label: this.transloco.translate("general.ok"),
        color: "primary",
      },
    ];

    if (success) delete instance.data.template;

    const sub = instance.action.subscribe((res) => {
      if (res === "ok") {
        dialogRef.close();
        sub.unsubscribe();
        if (onClose) onClose();
      }
    });
  }

  protected buildCreatePayload(data: ModuleObject): Partial<TObject> {
    const { expirationDate, credentialId, ...rest } = data;
    console.log(" data response", {
      id: this.profile.id,
      certifications: [
        {
          ...rest,
          issueDate: new Date(data.issueDate).toISOString(),
          ...(expirationDate
            ? { expirationDate: new Date(expirationDate).toISOString() }
            : {}),

          ...(credentialId ? { credentialId } : {}),
        },
      ],
    });
    return {
      id: this.profile.id,
      certifications: [
        {
          ...rest,
          issueDate: new Date(data.issueDate).toISOString(),
          ...(expirationDate
            ? { expirationDate: new Date(expirationDate).toISOString() }
            : {}),

          ...(credentialId ? { credentialId } : {}),
        },
      ],
    };
  }

  protected buildUpdatePayload(data: ModuleObject): Partial<TObject> {
    const { expirationDate, credentialId, credentialUrl, ...rest } = data;
    return {
      id: this.profile.id,
      certifications: [
        {
          ...rest,
          issueDate: new Date(data.issueDate).toISOString(),
          ...(expirationDate
            ? { expirationDate: new Date(expirationDate).toISOString() }
            : {}),
          // When editing a certification saved with no credentialId/Url,
          // the form gets patched with the backend's raw `null` (not ""),
          // and spreading that straight through made the backend reject
          // the whole update with `credentialId must be a string` — omit
          // them instead, same as the create path already does.
          ...(credentialId ? { credentialId } : {}),
          ...(credentialUrl ? { credentialUrl } : {}),
          ...(this.defaultValues ? { id: this.defaultValues.id } : {}),
        },
      ],
    };
  }

  protected getItemLabel(item: any): string {
    return item.name;
  }

  setIsLoading(
    dialogRef: MatDialogRef<GenericModalComponent>,
    isLoading: boolean,
  ) {
    const confirmAction = dialogRef?.componentInstance?.data?.actions?.find(
      (a) => a.id === "confirm",
    );
    if (confirmAction) confirmAction.isLoading = isLoading;
  }

  setupFormConfig() {
    this.formConfig = [
      {
        name: "name",
        label: "profile.form.certificationName.label",
        placeholder: "profile.form.certificationName.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.certificationName.required",
          maxlength: "profile.errors.certificationName.maxlength120",
        },
      },
      {
        name: "issuer",
        label: "profile.form.issuer.label",
        placeholder: "profile.form.issuer.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.issuer.required",
          maxlength: "profile.errors.issuer.maxlength120",
        },
      },
      {
        name: "issueDate",
        label: "profile.form.certificationDate.label",
        placeholder: "profile.form.certificationDate.placeholder",
        type: "date",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.certificationDate.required",
          iso8601: "profile.errors.certificationDate.iso8601",
        },
      },
      {
        name: "expirationDate",
        label: "profile.form.expiryDate.label",
        placeholder: "profile.form.expiryDate.placeholder",
        type: "date",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [],
        errorMessages: {
          iso8601: "profile.errors.expiryDate.iso8601",
        },
      },
      {
        name: "credentialId",
        label: "profile.form.credentialId.label",
        placeholder: "profile.form.credentialId.placeholder",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(50)],
        errorMessages: {
          maxlength: "profile.errors.credentialId.maxlength50",
        },
      },
      {
        name: "credentialUrl",
        label: "profile.form.credentialUrl.label",
        placeholder: "profile.form.credentialUrl.placeholder",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [],
        errorMessages: {},
      },
    ];
  }

  openModal() {
    this.dialogRef = this.dialog.open(GenericModalComponent, {
      width: "600px",
      panelClass: ["mat-mdc-dialog-panel", "custom-dialog-container"],
      maxWidth: "100vw",
      data: { title: "", template: "", actions: [] },
      disableClose: false,
      hasBackdrop: true,
      autoFocus: false,
      restoreFocus: false,
    });

    const instance = this.dialogRef.componentInstance;

    console.log(instance);

    instance.data.title = this.transloco.translate(
      this.defaultValues
        ? "profilePage.certifications.dialog.edit.title"
        : "profilePage.certifications.dialog.add.title",
      {},
      "candidates",
    );
    instance.data.template = this.formTemplate;

    instance.data.actions = [
      {
        id: "cancel",
        label: this.transloco.translate("general.cancel"),
      },
      {
        id: "confirm",
        label: this.transloco.translate("general.ok"),
        color: "primary",
      },
    ];

    const sub = this.dialogRef.componentInstance.action.subscribe(
      (res: any) => {
        if (res === "confirm") {
          this.form.submit();
        } else {
          this.dialogRef.close();
          sub.unsubscribe();
        }
      },
    );
  }

  addItem() {
    this.openModal();
  }

  updateItem(item: ModuleObject) {
    this.defaultValues = {
      ...item,
      issueDate: formatDateForInput(item.issueDate),
      ...(item.expirationDate
        ? { expirationDate: formatDateForInput(item.expirationDate) }
        : {}),
    };

    this.openModal();
  }

  buildDeletePayload = (item: ModuleObject) => {
    console.log("delete item: ", item, this.profile);
    return {
      id: this.profile?.id,
      certifications: [{ id: item.id }],
    };
  };

  handleDone = (updatedProfile?: TObject) => {
    this.onDone.emit(updatedProfile);
  };

  getItemId(item: ModuleObject) {
    return String(item.id);
  }

  // UI: compact mode / show more
  public showAll: boolean = false;

  // computed sorted list used by the template
  get displayedCertifications(): ModuleObject[] {
    const items = (this.profile?.certifications || []).slice();
    items.sort((a: ModuleObject, b: ModuleObject) => {
      const da = a?.issueDate ? new Date(a.issueDate).getTime() : 0;
      const db = b?.issueDate ? new Date(b.issueDate).getTime() : 0;
      return this.sortOrder === "asc" ? da - db : db - da;
    });
    return items;
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
}
