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
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router, ActivatedRoute } from "@angular/router";
import {
  Candidate as TObject,
  CandidateEducation as ModuleObject,
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
import { CandidatesService as Service } from "@modules/candidates/candidates.service";

@Component({
  standalone: false,

  selector: "app-candidates-educations-list",
  templateUrl: "./candidates-educations-list.component.html",
  styleUrls: ["./candidates-educations-list.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesEducationsListComponent implements OnInit {
  @ViewChild("form") formTemplate!: TemplateRef<GenericFormComponent>;
  @ViewChild(GenericFormComponent) form!: GenericFormComponent;

  @Input() profile!: TObject;
  dialogRef!: MatDialogRef<GenericModalComponent>;

  @Output() onDone: EventEmitter<TObject> = new EventEmitter();

  moduleName: string = "candidates";
  isLoading = false;
  hasError = false;
  errorMessage: string = "";
  profilePhoto!: string;

  formConfig: FieldConfig[] = [];
  defaultValues: ModuleObject | null = null;
  // sorting
  public sortOrder: "asc" | "desc" = "desc"; // default: most recent first
  // dropdown for filters (used by the new button)
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

  // close dropdown when clicking outside
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @HostListener("document:click", ["$event"])
  handleDocumentClick(event: any) {
    if (!this.showFiltersDropdown) return;
    // if click happened outside, close
    this.showFiltersDropdown = false;
  }

  // constructor(private dialog: MatDialog, private transloco: TranslocoService) {}

  ngOnInit(): void {
    this.setupFormConfig();
    this.isLoading = false;
    this.hasError = false;
    this.errorMessage = "";
  }

  onFormReady(form: any): void {
    form.get('startDate')?.valueChanges.subscribe((val: string) => {
      const endDateField = this.formConfig.find(f => f.name === 'endDate');
      if (endDateField) endDateField.minDate = val || undefined;
      this.formConfig = [...this.formConfig];
    });
  }

  constructor(
    protected service: Service,
    protected dialog: MatDialog,
    protected transloco: TranslocoService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {}

  onSubmit(formData: any): void {
    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
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

    // this.isLoading = true;
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
    const { endDate, ...rest } = data;
    return {
      id: this.profile.id,
      educations: [
        {
          ...rest,
          startDate: new Date(data.startDate).toISOString(),

          ...(endDate ? { endDate: new Date(endDate).toISOString() } : {}),
        },
      ],
    };
  }

  protected buildUpdatePayload(data: ModuleObject): Partial<TObject> {
    const { endDate, ...rest } = data;
    return {
      id: this.profile.id,
      educations: [
        {
          ...rest,
          startDate: new Date(data.startDate).toISOString(),
          ...(endDate ? { endDate: new Date(endDate).toISOString() } : {}),
          ...(this.defaultValues ? { id: this.defaultValues.id } : {}),
        },
      ],
    };
  }

  protected getItemLabel(item: any): string {
    return item.title;
  }

  handleBack(): void {
    // this.router.navigate(["../list"], { relativeTo: this.route });
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
        name: "schoolName",
        label: "profile.form.schoolName.label",
        placeholder: "profile.form.schoolName.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(150)],
        errorMessages: {
          required: "profile.errors.schoolName.required",
          maxlength: "profile.errors.schoolName.maxlength150",
        },
      },
      {
        name: "degree",
        label: "profile.form.degree.label",
        placeholder: "profile.form.degree.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.degree.required",
          maxlength: "profile.errors.degree.maxlength120",
        },
      },
      {
        name: "fieldOfStudy",
        label: "profile.form.fieldOfStudy.label",
        placeholder: "profile.form.fieldOfStudy.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.fieldOfStudy.required",
          maxlength: "profile.errors.fieldOfStudy.maxlength120",
        },
      },
      {
        name: "startDate",
        label: "profile.form.startDate.label",
        placeholder: "profile.form.startDate.placeholder",
        type: "date",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.startDate.required",
        },
      },
      {
        name: "endDate",
        label: "profile.form.endDate.label",
        placeholder: "profile.form.endDate.placeholder",
        type: "date",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [],
        errorMessages: {},
      },
      // Description removed for education per product decision (not required)
    ];
  }

  openModal() {
    this.dialogRef = this.dialog.open(GenericModalComponent, {
      width: "600px",
      panelClass: "mat-mdc-dialog-panel",
      maxWidth: "100vw",
      data: { title: "", template: "", actions: [] },
    });

    const instance = this.dialogRef.componentInstance;

    console.log(instance);

    instance.data.title = this.transloco.translate(
      this.defaultValues
        ? "profilePage.educations.dialog.edit.title"
        : "profilePage.educations.dialog.add.title",
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
      startDate: formatDateForInput(item.startDate),
      ...(item.endDate ? { endDate: formatDateForInput(item.endDate) } : {}),
    };

    this.openModal();
  }

  deleteItem(item: ModuleObject) {
    //
  }

  buildDeletePayload = (item: ModuleObject) => {
    console.log("delete item: ", item, this.profile);
    return {
      id: this.profile?.id,
      educations: [{ id: item.id }],
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
  get displayedEducations(): ModuleObject[] {
    const items = (this.profile?.educations || []).slice();
    items.sort((a: ModuleObject, b: ModuleObject) => {
      const da = a?.startDate ? new Date(a.startDate).getTime() : 0;
      const db = b?.startDate ? new Date(b.startDate).getTime() : 0;
      return this.sortOrder === "asc" ? da - db : db - da;
    });
    return items;
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  // handleSubmit(data: ExperienceFormData) {
  //   console.log(data);
  // }
}
