import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ApplicationsService as Service } from "@modules/applications/applications.service";
import {
  ApplicationStatusEnum,
  CreateApplicationDto as ModuleObjectCreate,
  Application as ModuleObject,
  ApplicationFormData as ModuleFormData,
} from "@modules/applications/applications.types";
import { TranslocoService } from "@ngneat/transloco";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import {
  GenericModalComponent,
  GenericModalType,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { humanSize, wait } from "../../../../@1hand/utils";
import { Validators } from "@angular/forms";
import { Resume } from "@modules/resumes/resumes.types";
import { AuthService } from "@modules/auth/auth.service";

@Component({
  standalone: false,

  selector: "app-applications-button",
  templateUrl: "./applications-button.component.html",
  styleUrls: ["./applications-button.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class ApplicationsButtonComponent implements OnChanges {
  @ViewChild("form") formTemplate!: TemplateRef<any>;
  @ViewChild(GenericFormComponent) form!: GenericFormComponent;

  // @Input() item!: TObject;
  @Input() jobOfferId!: string;
  // @Input() candidateId!: string;
  @Input() resumes: Resume[] = [];

  @Output() onDone: EventEmitter<void> = new EventEmitter();

  dialogRef!: MatDialogRef<GenericModalComponent>;

  moduleName: string = "applications";
  isLoading = false;
  hasError = false;
  errorMessage: string = "";

  formConfig: FieldConfig[] = [];
  defaultValues: ModuleObject | null = null;

  get candidateId() {
    const user = this.authService.getUser();
    return user && this.authService.isCandidate() ? user.id : null;
  }

  constructor(
    protected service: Service,
    protected dialog: MatDialog,
    protected transloco: TranslocoService,
    protected router: Router,
    protected route: ActivatedRoute,
    private authService: AuthService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["resumes"]) {
      this.setupFormConfig();

      if (this.dialogRef && this.dialogRef.componentInstance) {
        const instance = this.dialogRef.componentInstance;

        // Update the actions depending on whether resumes are available now
        if (!this.resumes || this.resumes.length === 0) {
          instance.data.actions = [
            {
              id: "cancel",
              label: this.transloco.translate("general.cancel"),
            },
          ];
        } else {
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
        }

        // Trigger change detection so the dialog updates immediately
        this.cd.detectChanges();
      }
    }
  }

  ngOnInit(): void {
    this.setupFormConfig();
    this.isLoading = false;
    this.hasError = false;
    this.errorMessage = "";
  }

  onSubmit(formData: any): void {
    console.log("FormData: ", formData);
    const payload =
      // this.defaultValues
      //   ? this.buildUpdatePayload(formData)
      this.buildCreatePayload(formData);

    this.handleCreate(payload, this.defaultValues ? "update" : "create");
  }

  handleCreate(
    data: ModuleObjectCreate,
    action: "create" | "update" = "create",
  ): void {
    if (this.isLoading) return;

    this.setIsLoading(this.dialogRef, true);

    this.hasError = false;
    this.errorMessage = "";

    const $observable =
      // action === "update" && this.defaultValues
      //   ? this.service.update(this.item.id, data)
      this.service.create(data);

    console.log("in creation: ", data, this.defaultValues);

    $observable.subscribe({
      next: async (createdItem: ModuleObject) => {
        await wait();

        this.setIsLoading(this.dialogRef, false);
        this.hasError = false;
        this.errorMessage = "";

        // Fermer la modal de formulaire avant d'afficher le modal de succès
        this.dialogRef.close();

        // Afficher le modal de succès
        const successDialogRef = this.dialog.open(GenericModalComponent, {
          width: "fit-content",
          maxWidth: "99vw",
          data: {
            title: this.transloco.translate(
              `${this.moduleName}.create.success.title`,
            ),
            content: this.transloco.translate(
              `${this.moduleName}.create.success.message`,
              { name: this.getItemLabel(createdItem) },
            ),
            type: "info" as GenericModalType,
            actions: [
              {
                id: "ok",
                label: this.transloco.translate("general.ok"),
                color: "primary",
              },
            ],
          },
        });

        const successSub = successDialogRef.componentInstance.action.subscribe(
          (res) => {
            if (res === "ok") {
              successDialogRef.close();
              successSub.unsubscribe();
              this.handleDone(createdItem);
            }
          },
        );
      },
      error: async (error: any) => {
        await wait();
        this.setIsLoading(this.dialogRef, false);

        this.hasError = true;
        this.errorMessage =
          error?.status === 410
            ? this.transloco.translate("applications.errors.offerExpired")
            : error?.error?.message ||
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

  protected buildCreatePayload(data: ModuleFormData): ModuleObjectCreate {
    if (!this.jobOfferId || !this.candidateId) {
      console.error("No jobOfferId or candidateId");
      throw Error("No jobOfferId or candidateId");
    }
    return {
      ...data,
      accountId: this.candidateId,
      jobOfferId: this.jobOfferId,
    };
  }

  // protected buildUpdatePayload(data: ModuleObject): Partial<TObject> {
  //   return {
  //     ...data,
  //   };
  // }

  protected getItemLabel(item: any): string {
    return item.name;
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
    if (!this.resumes || this.resumes.length === 0) {
      this.formConfig = [];
      return;
    }

    this.formConfig = [
      {
        name: "resumeId",
        label: "form.resume",
        placeholder: "form.selectResume",
        type: "select",
        required: true,
        size: { xs: 12 },
        options: this.resumes.map((resume) => ({
          value: resume.id,
          label: `${resume.name} (${humanSize(resume.resumeFile?.size ?? 0)})`,
        })),
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.resumeId.required",
        },
      },
      {
        name: "message",
        label: "form.message",
        placeholder: "form.messagePlaceholder",
        type: "textarea",
        multiline: true,
        rows: 5,
        required: false,
        size: { xs: 12 },
        validation: [Validators.maxLength(1000)],
        errorMessages: {
          maxlength: "form.errors.fields.message.maxlength",
        },
      },
    ];
  }

  openModal() {
    this.dialogRef = this.dialog.open(GenericModalComponent, {
      width: "fit-content",
      maxWidth: "99vw",
      data: { title: "", template: "", actions: [] },
    });

    const instance = this.dialogRef.componentInstance;

    console.log("Modal instance:", instance);
    console.log("Form template:", this.formTemplate);
    console.log("Resumes:", this.resumes);

    instance.data.title = this.transloco.translate(
      this.defaultValues
        ? "itemPage.applications.dialog.edit.title"
        : "itemPage.applications.dialog.add.title",
    );
    instance.data.template = this.formTemplate;

    // Ajuster les actions selon la disponibilité des CV
    if (!this.resumes || this.resumes.length === 0) {
      // Si pas de CV, on affiche seulement le bouton fermer
      instance.data.actions = [
        {
          id: "cancel",
          label: this.transloco.translate("general.cancel"),
        },
      ];
    } else {
      // Si CV disponibles, on affiche les boutons normaux
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
    }

    const sub = this.dialogRef.componentInstance.action.subscribe(
      (res: any) => {
        if (res === "confirm" && this.resumes && this.resumes.length > 0) {
          // Déclencher la soumission du formulaire
          if (this.form && this.form.form.valid) {
            this.onSubmit(this.form.form.value);
          } else if (this.form) {
            // Marquer tous les champs comme touchés pour afficher les erreurs
            this.form.form.markAllAsTouched();
            return; // Ne pas fermer la modal si le formulaire n'est pas valide
          }
        }

        if (res === "cancel") {
          // Fermer le modal seulement pour cancel
          this.dialogRef.close();
          sub.unsubscribe();
        }
      },
    );
  }

  private submitFormManually() {
    // Cette méthode sera appelée si on ne peut pas accéder directement au formulaire
    // On peut implémenter une logique de validation manuelle ici si nécessaire
    console.log("Attempting manual form submission");

    // Pour l'instant, on ferme juste le modal
    // Dans un vrai cas, on devrait valider les données et les soumettre
    this.dialogRef.close();
  }

  addItem() {
    // Only allow candidates to open application modal. Otherwise redirect to register.
    if (!this.candidateId) {
      this.router.navigate(["/auth/register"], {
        queryParams: {
          type: "candidate",
          returnUrl: `/job-offers/${this.jobOfferId}?apply=true`,
        },
      });
      return;
    }

    this.openModal();
  }

  // updateItem(item: ModuleObject) {
  //   this.defaultValues = {
  //     ...item,
  //     issueDate: formatDateForInput(item.issueDate),
  //     ...(item.expirationDate
  //       ? { expirationDate: formatDateForInput(item.expirationDate) }
  //       : {}),
  //   };

  //   this.openModal();
  // }

  // buildDeletePayload = (item: ModuleObject) => {
  //   console.log("delete item: ", item, this.item);
  //   return {
  //     id: this.item?.id,
  //     applications: [{ id: item.id }],
  //   };
  // };

  handleDone = (item: ModuleObject) => {
    // this.onDone.emit();
    this.router.navigate([
      `/dashboard/candidates/${this.candidateId}/applications/${item.id}`,
    ]);
  };

  getItemId(item: ModuleObject) {
    return String(item.id);
  }

  navigateToResumes() {
    // Fermer le modal actuel
    if (this.dialogRef) {
      this.dialogRef.close();
    }

    // Naviguer vers la page de gestion des CV
    this.router.navigate([
      `/dashboard/candidates/${this.candidateId}/resumes/list`,
    ]);
  }
}
