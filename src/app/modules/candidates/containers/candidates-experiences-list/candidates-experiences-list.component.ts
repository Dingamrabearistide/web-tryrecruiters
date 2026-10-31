import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
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
  CandidateExperience as ModuleObject,
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

export interface ExperienceFormData {
  title: string;
  company: string;
  period: Date | string;
  location: string;
  description: string;
}

@Component({
  standalone: false,

  selector: "app-candidates-experiences-list",
  templateUrl: "./candidates-experiences-list.component.html",
  styleUrls: ["./candidates-experiences-list.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesExperiencesListComponent implements OnInit, OnChanges {
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

  // sorting & filtering
  public sortOrder: "asc" | "desc" = "desc"; // recent first by default
  public filterFrom: string = ""; // yyyy-mm-dd
  public filterTo: string = ""; // yyyy-mm-dd
  // dropdown for filters
  public showFiltersDropdown: boolean = false;

  toggleFiltersDropdown(event?: Event) {
    if (event) event.stopPropagation();
    this.showFiltersDropdown = !this.showFiltersDropdown;
  }

  closeFiltersDropdown() {
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
    // startDate changes → update endDate minDate
    form.get('startDate')?.valueChanges.subscribe((val: string) => {
      const endDateField = this.formConfig.find(f => f.name === 'endDate');
      if (endDateField) endDateField.minDate = val || undefined;
      this.formConfig = [...this.formConfig];
    });
    // currentlyEmployed → disable/clear endDate
    form.get('currentlyEmployed')?.valueChanges.subscribe((checked: boolean) => {
      const endDateField = this.formConfig.find(f => f.name === 'endDate');
      if (endDateField) endDateField.disabled = checked;
      if (checked) form.get('endDate')?.setValue('');
      this.formConfig = [...this.formConfig];
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['profile']?.currentValue) {
      this.profile = changes['profile'].currentValue;
    }
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
    console.log(data);
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
    const { endDate, description, ...rest } = data;

    return {
      id: this.profile.id,
      experiences: [
        {
          ...rest,
          startDate: new Date(data.startDate).toISOString(),
          ...(endDate ? { endDate: new Date(endDate).toISOString() } : {}),
          ...(description ? { description: description } : {}),
        },
      ],
    };
  }

  protected buildUpdatePayload(data: ModuleObject): Partial<TObject> {
    const { endDate, description, ...rest } = data;
    return {
      id: this.profile.id,
      experiences: [
        {
          ...(this.defaultValues ? { id: this.defaultValues.id } : {}),

          ...rest,
          startDate: new Date(data.startDate).toISOString(),
          ...(endDate ? { endDate: new Date(endDate).toISOString() } : {}),
          ...(description ? { description: description } : {}),
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
      // {
      //   name: "id",
      //   type: "hidden",
      //   required: false,
      //   validation: [uuidV4Validator()],
      //   errorMessages: {
      //     uuid: "profile.errors.id.uuid",
      //   },
      // },
      {
        name: "title",
        label: "profile.form.title.label",
        placeholder: "profile.form.title.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.title.required",
          maxlength: "profile.errors.title.maxlength120",
        },
      },
      {
        name: "company",
        label: "profile.form.company.label",
        placeholder: "profile.form.company.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.company.required",
          maxlength: "profile.errors.company.maxlength120",
        },
      },
      {
        name: "startDate",
        label: "profile.form.startDate.label",
        placeholder: "profile.form.startDate.placeholder",
        type: "date", // laisse "string" si ton GenericForm attend une string ISO; sinon "dateTime"
        required: true,
        maxDate: (() => {
          const today = new Date();
          today.setDate(today.getDate() - 7);
          return today.toISOString().split("T")[0];
        })(),
        size: { xs: 12, md: 6 },
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.startDate.required",
          iso8601: "profile.errors.startDate.iso8601",
        },
      },
      {
        name: "endDate",
        label: "profile.form.endDate.label",
        placeholder: "profile.form.endDate.placeholder",
        type: "date", // string ISO-8601
        required: false,
        size: { xs: 12, md: 6 },
        validation: [],
        errorMessages: {
          iso8601: "profile.errors.endDate.iso8601",
        },
      },
      {
        name: "currentlyEmployed",
        label: "profile.form.currentlyEmployed.label",
        placeholder: "",
        type: "checkbox",
        required: false,
        size: { xs: 12 },
        validation: [],
        errorMessages: {},
      },
      {
        name: "location",
        label: "profile.form.location.label",
        placeholder: "profile.form.location.placeholder",
        type: "string",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.maxLength(120)],
        errorMessages: {
          maxlength: "profile.errors.location.maxlength120",
          required: "profile.errors.location.required",
        },
      },
      {
        name: "description",
        label: "profile.form.description.label",
        placeholder: "profile.form.description.placeholder",
        type: "textarea",
        multiline: true,
        rows: 6,
        required: false, // optionnel (DTO)
        size: { xs: 12 },
        validation: [Validators.maxLength(4000)],
        errorMessages: {
          maxlength: "profile.errors.description.maxlength4000",
        },
      },
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
        ? "profilePage.experiences.dialog.edit.title"
        : "profilePage.experiences.dialog.add.title",
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
      experiences: [{ id: item.id }],
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

  // computed sorted/filtered list used by the template
  get displayedExperiences(): ModuleObject[] {
    let items = (this.profile?.experiences || []).slice();

    // apply date range filter on startDate when provided
    if (this.filterFrom) {
      const from = new Date(this.filterFrom).getTime();
      items = items.filter((it) => {
        const sd = it?.startDate ? new Date(it.startDate).getTime() : 0;
        return sd >= from;
      });
    }

    if (this.filterTo) {
      const to = new Date(this.filterTo).getTime();
      items = items.filter((it) => {
        const sd = it?.startDate ? new Date(it.startDate).getTime() : 0;
        return sd <= to;
      });
    }

    // sort by startDate
    items.sort((a: ModuleObject, b: ModuleObject) => {
      const da = a?.startDate ? new Date(a.startDate).getTime() : 0;
      const db = b?.startDate ? new Date(b.startDate).getTime() : 0;
      return this.sortOrder === "asc" ? da - db : db - da;
    });

    return items;
  }

  refreshList() {
    // noop — getter will recompute on change detection; method kept for template bindings
    // could be used later to trigger server requests if needed
  }

  resetFilters() {
    this.filterFrom = "";
    this.filterTo = "";
    this.sortOrder = "desc";
  }

  // close dropdown when clicking outside
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @HostListener("document:click", ["$event"])
  handleDocumentClick(event: any) {
    if (!this.showFiltersDropdown) return;
    this.showFiltersDropdown = false;
  }

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  // handleSubmit(data: ExperienceFormData) {
  //   console.log(data);
  // }
}
