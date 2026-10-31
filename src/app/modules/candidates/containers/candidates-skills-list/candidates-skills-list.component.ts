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
} from "@angular/core";
import { Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CandidatesService as Service } from "@modules/candidates/candidates.service";
import {
  Candidate as TObject,
  CandidateSkill as ModuleObject,
  SkillLevel,
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

@Component({
  standalone: false,

  selector: "app-candidates-skills-list",
  templateUrl: "./candidates-skills-list.component.html",
  styleUrls: ["./candidates-skills-list.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesSkillsListComponent implements OnInit, OnChanges {
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

  ngOnInit(): void {
    this.setupFormConfig();
    this.isLoading = false;
    this.hasError = false;
    this.errorMessage = "";
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
    protected route: ActivatedRoute
  ) {}

  onSubmit(formData: any): void {
    const payload = this.defaultValues
      ? this.buildUpdatePayload(formData)
      : this.buildCreatePayload(formData);

    console.log(payload);
    this.handleCreate(payload, this.defaultValues ? "update" : "create");
  }

  handleCreate(
    data: Partial<TObject>,
    action: "create" | "update" = "create"
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
    onClose?: () => void
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
    console.log("Data: ", data);
    return {
      id: this.profile.id,
      skills: [data],
    };
  }

  protected buildUpdatePayload(data: ModuleObject): Partial<TObject> {
    return {
      id: this.profile.id,
      skills: [
        {
          ...data,
          ...(this.defaultValues ? { id: this.defaultValues.id } : {}),
        },
      ],
    };
  }

  protected getItemLabel(item: any): string {
    return item.name;
  }

  handleBack(): void {
    // this.router.navigate(["../list"], { relativeTo: this.route });
  }

  setIsLoading(
    dialogRef: MatDialogRef<GenericModalComponent>,
    isLoading: boolean
  ) {
    const confirmAction = dialogRef?.componentInstance?.data?.actions?.find(
      (a) => a.id === "confirm"
    );
    if (confirmAction) confirmAction.isLoading = isLoading;
  }

  setupFormConfig() {
    this.formConfig = [
      {
        name: "name",
        label: "profile.form.skillName.label",
        placeholder: "profile.form.skillName.placeholder",
        type: "string",
        required: true,
        size: { xs: 12 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.skillName.required",
          maxlength: "profile.errors.skillName.maxlength120",
        },
      },
      {
        name: "level",
        label: "profile.form.skillLevel.label",
        placeholder: "profile.form.skillLevel.placeholder",
        type: "select",
        required: false,
        size: { xs: 12 },
        options: [
          { value: SkillLevel.BEGINNER, label: "candidateDetails.beginner" },
          {
            value: SkillLevel.INTERMEDIATE,
            label: "candidateDetails.intermediate",
          },
          { value: SkillLevel.ADVANCED, label: "candidateDetails.advanced" },
          { value: SkillLevel.EXPERT, label: "candidateDetails.expert" },
        ],
        validation: [],
        errorMessages: {},
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
        ? "profilePage.skills.dialog.edit.title"
        : "profilePage.skills.dialog.add.title",
      {},
      "candidates"
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
      }
    );
  }

  addItem() {
    this.openModal();
  }

  updateItem(item: ModuleObject) {
    this.defaultValues = { ...item };
    this.openModal();
  }

  deleteItem(item: ModuleObject) {
    //
  }

  buildDeletePayload = (item: ModuleObject) => {
    console.log("delete item: ", item, this.profile);
    return {
      id: this.profile?.id,
      skills: [{ id: item.id }],
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

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }
}
