import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";
import { Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { InterviewsService as Service } from "@modules/interview/interviews.service";
import {
  Interview as ModuleObject,
  InterviewFormData as ModuleFormData,
  CreateInterviewDto as ModuleCreateDto,
  UpdateInterviewDto as ModuleUpdateDto,
  InterviewType,
} from "@modules/interview/interview.types";
import { TranslocoService } from "@ngneat/transloco";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import {
  GenericModalComponent,
  GenericModalType,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { wait } from "../../../../@1hand/utils";
import { InterviewFormComponent } from "@modules/interview/components/interview-form/interview-form.component";
import { Application } from "@modules/applications/applications.types";
import { AuthService } from "@modules/auth/auth.service";
import { NgForm } from "@angular/forms";

@Component({
  standalone: false,

  selector: "app-interview-schedule-modal",
  templateUrl: "./interview-schedule-modal.component.html",
  styleUrls: ["./interview-schedule-modal.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class InterviewScheduleModalComponent implements OnInit {
  @ViewChild("form") formTemplate!: TemplateRef<GenericFormComponent>;
  @ViewChild(InterviewFormComponent) formComponent!: InterviewFormComponent;
  formRef: NgForm | null = null;
  formComponentRef: any = null;

  @Input() item!: Application;
  @Input() disabled: boolean = false;
  @Input() blockReason: string | null = null;
  dialogRef!: MatDialogRef<GenericModalComponent>;

  @Output() onDone: EventEmitter<void> = new EventEmitter();

  moduleName: string = "interviews";
  isLoading = false;
  hasError = false;
  errorMessage: string = "";

  formConfig: FieldConfig[] = [];
  defaultValues: ModuleObject | null = null;

  get recruiterId() {
    const user = this.authService.getUser();
    return user && this.authService.isRecruiter() ? user.id : null;
  }

  constructor(
    protected service: Service,
    protected dialog: MatDialog,
    protected transloco: TranslocoService,
    protected router: Router,
    protected route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.setupFormConfig();
    this.isLoading = false;
    this.hasError = false;
    this.errorMessage = "";
  }

  private isGoogleMeetType(type: any): boolean {
    if (type === null || type === undefined) return false;
    try {
      const left = String(type).toUpperCase();
      const right = String(InterviewType.GOOGLE_MEET).toUpperCase();
      return left === right;
    } catch (e) {
      return false;
    }
  }

  private generateDummyMeetUrl(): string {
    return `https://meet.google.com/xxx-xxxx-xxx`;
  }

  private isInPersonType(type: any): boolean {
    if (type === null || type === undefined) return false;
    try {
      return String(type).toUpperCase() === String(InterviewType.IN_PERSON).toUpperCase();
    } catch (e) {
      return false;
    }
  }

  onSubmit(formData: ModuleFormData): void {
    const payloadRaw: any = { ...(formData as any) };

    const isGoogle = this.isGoogleMeetType(payloadRaw.type);
    const isInPerson = this.isInPersonType(payloadRaw.type);

    if (isInPerson) {
      // In-person interviews are location-based — the backend rejects a
      // meetUrl on this type (400) and requires location instead.
      delete payloadRaw.meetUrl;
    } else if (isGoogle) {
      payloadRaw.meetUrl = payloadRaw.meetUrl || "";
      delete payloadRaw.location;
    } else {
      payloadRaw.meetUrl = this.generateDummyMeetUrl();
      delete payloadRaw.location;
    }

    const payload = this.defaultValues
      ? this.buildUpdatePayload(payloadRaw as ModuleFormData)
      : this.buildCreatePayload(payloadRaw as ModuleFormData);

    this.handleCreate(payload);
  }

  handleCreate(data: ModuleCreateDto | ModuleUpdateDto): void {
    if (this.isLoading) return;

    this.setIsLoading(this.dialogRef, true);
    this.hasError = false;
    this.errorMessage = "";

    const $observable = this.service.create(data as ModuleCreateDto);

    $observable.subscribe({
      next: async (createdItem: ModuleObject) => {
        await wait();

        this.setIsLoading(this.dialogRef, false);
        this.hasError = false;
        this.errorMessage = "";

        this.showResultModal(
          this.dialogRef,
          `${this.moduleName}.create.success.title`,
          `${this.moduleName}.create.success.message`,
          this.getItemLabel(createdItem),
          "info",
          true,
          () => this.handleDone(createdItem),
        );
      },
      error: async (error: any) => {
        await wait();
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
    if (dialogRef) {
      dialogRef.close();
    }

    const successModalRef = this.dialog.open(GenericModalComponent, {
      width: "450px",
      data: {
        title: this.transloco.translate(titleKey),
        content: this.transloco.translate(messageKey, { name }),
        type: type,
        actions: [
          {
            id: "ok",
            label: this.transloco.translate("general.ok"),
            color: "primary",
          },
        ],
      },
      disableClose: false,
    });

    const sub = successModalRef.componentInstance.action.subscribe((res) => {
      if (res === "ok") {
        successModalRef.close();
        sub.unsubscribe();
        if (onClose) onClose();
      }
    });
  }

  protected buildCreatePayload(data: ModuleFormData): ModuleCreateDto {
    const payload: any = { ...(data as any) };
    if (payload.durationMin) payload.durationMin = Number(payload.durationMin);
    return {
      ...payload,
      applicationId: this.item.id,
      candidateId: this.item.accountId, // ✅ Envoyer candidateId au lieu de accountId
      recruiterId: this.item.jobOffer.recruiterId,
    } as ModuleCreateDto;
  }

  protected buildUpdatePayload(_data: ModuleFormData): ModuleUpdateDto {
    return { ...(_data as any) } as ModuleUpdateDto;
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
    const confirmAction = dialogRef.componentInstance.data?.actions?.find(
      (a) => a.id === "confirm",
    );
    if (confirmAction) confirmAction.isLoading = isLoading;
  }

  setupFormConfig() {
    this.formConfig = [
      {
        name: "schoolName",
        label: "item.form.schoolName.label",
        placeholder: "item.form.schoolName.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(150)],
        errorMessages: {
          required: "item.errors.schoolName.required",
          maxlength: "item.errors.schoolName.maxlength150",
        },
      },
      {
        name: "degree",
        label: "item.form.degree.label",
        placeholder: "item.form.degree.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "item.errors.degree.required",
          maxlength: "item.errors.degree.maxlength120",
        },
      },
      {
        name: "fieldOfStudy",
        label: "item.form.fieldOfStudy.label",
        placeholder: "item.form.fieldOfStudy.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "item.errors.fieldOfStudy.required",
          maxlength: "item.errors.fieldOfStudy.maxlength120",
        },
      },
      {
        name: "startDate",
        label: "item.form.startDate.label",
        placeholder: "item.form.startDate.placeholder",
        type: "date",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required],
        errorMessages: {
          required: "item.errors.startDate.required",
        },
      },
      {
        name: "endDate",
        label: "item.form.endDate.label",
        placeholder: "item.form.endDate.placeholder",
        type: "date",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [],
        errorMessages: {},
      },
      {
        name: "description",
        label: "item.form.description.label",
        placeholder: "item.form.description.placeholder",
        type: "string",
        multiline: true,
        rows: 4,
        required: false,
        size: { xs: 12 },
        validation: [Validators.maxLength(2000)],
        errorMessages: {
          maxlength: "item.errors.description.maxlength2000",
        },
      },
    ];
  }

  openModal() {
    if (this.disabled) {
      return;
    }
    this.dialogRef = this.dialog.open(GenericModalComponent, {
      width: "800px",
      maxWidth: "none",
      maxHeight: "90vh",
      panelClass: "custom-dialog",
      data: { title: "", template: "", actions: [] },
    });

    const instance = this.dialogRef.componentInstance;

    instance.data.title = "";
    instance.data.template = this.formTemplate;

    instance.data.actions = [
      {
        id: "cancel",
        label: this.transloco.translate("general.cancel"),
      },
      {
        id: "confirm",
        label: this.transloco.translate("interviews.scheduleButton"),
        color: "primary",
        disabled: true,
      },
    ];

    const subs: any[] = [];

    const sub = this.dialogRef.afterOpened().subscribe(() => {});
    subs.push(sub);

    const actionSub = this.dialogRef.componentInstance.action.subscribe(
      (res: any) => {
        if (res === "confirm") {
          try {
            if (
              this.formComponentRef &&
              typeof this.formComponentRef.submit === "function"
            ) {
              this.formComponentRef.submit();
            } else if (this.formRef) {
              if (this.formRef.valid) {
                this.onSubmit(this.formRef.value as ModuleFormData);
              } else {
                Object.values((this.formRef as any).controls || {}).forEach(
                  (c: any) => c.markAsTouched && c.markAsTouched(),
                );
              }
            }
          } catch (e) {
            console.error("Failed to programmatically submit form", e);
          }
        } else {
          this.dialogRef.close();
          actionSub.unsubscribe();
          subs.forEach((s) => s.unsubscribe());
        }
      },
    );
    subs.push(actionSub);

    (this.dialogRef as any).__subs = subs;
  }

  addItem() {
    this.openModal();
  }

  updateItem(item: ModuleObject) {
    this.openModal();
  }

  deleteItem(item: ModuleObject) {
    //
  }

  buildDeletePayload = (item: ModuleObject) => {
    return {
      //
    };
  };

  handleDone = (_item: ModuleObject) => {
    this.onDone.emit();
  };

  getItemId(item: ModuleObject) {
    return String(item.id);
  }

  onFormReady(componentInstance: any) {
    this.formComponentRef = componentInstance;

    if (componentInstance.form) {
      this.formRef = componentInstance.form;
    }

    const confirmAction = this.dialogRef.componentInstance.data?.actions?.find(
      (a) => a.id === "confirm",
    );
    if (confirmAction) confirmAction.disabled = !componentInstance.form?.valid;
  }

  onValidityChange(isValid: boolean) {
    const confirmAction = this.dialogRef.componentInstance.data?.actions?.find(
      (a) => a.id === "confirm",
    );
    if (confirmAction) confirmAction.disabled = !isValid;
  }
}
