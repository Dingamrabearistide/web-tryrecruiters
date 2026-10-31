import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from "@angular/core";import { Validators } from "@angular/forms";
import { GeoService } from "../../../../core/services/geo.service";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "@modules/auth/auth.service";
import { UpdateProfileDto, User, Gender } from "@modules/auth/auth.types";
import { Candidate as TObject } from "@modules/candidates/candidates.types";
import { TranslocoService } from "@ngneat/transloco";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import {
  GenericModalComponent,
  GenericModalType,
} from "../../../../@1hand/components/generic-modal/generic-modal.component";
import { formatDateForInput, wait } from "../../../../@1hand/utils";
import { GenericFileManagerFileItem } from "../../../../@1hand/components/generic-file-manager/generic-file-manager-modal/generic-file-manager-modal.component";
import { environment } from "@env/environment";

@Component({
  standalone: false,

  selector: "app-candidates-personal-info",
  templateUrl: "./candidates-personal-info.component.html",
  styleUrls: ["./candidates-personal-info.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class CandidatesPersonalInfoComponent implements OnInit {
  @ViewChild("form") formTemplate!: TemplateRef<GenericFormComponent>;
  @ViewChild(GenericFormComponent) form!: GenericFormComponent;

  @Input() profile!: TObject;
  dialogRef!: MatDialogRef<GenericModalComponent>;

  @Output() onDone: EventEmitter<any> = new EventEmitter();

  moduleName: string = "candidates";
  isLoading = false;
  hasError = false;
  errorMessage: string = "";

  isLoadingSaveImage = false;
  hasErrorSaveImage = false;
  errorMessageSaveImage: string = "";
  photoFailed = false;

  get hasPhoto(): boolean {
    if (this.photoFailed) return false;
    const p = this.profile?.photo;
    return !!p && p.trim() !== '' && p !== 'null' && p !== 'undefined';
  }

  get initials(): string {
    const first = this.profile?.firstName?.trim() || '';
    const last = this.profile?.lastName?.trim() || '';
    if (first && last) return (first[0] + last[0]).toUpperCase();
    if (first) return first.substring(0, 2).toUpperCase();
    if (last) return last.substring(0, 2).toUpperCase();
    return '?';
  }

  get avatarColor(): string {
    const name = `${this.profile?.firstName || ''}${this.profile?.lastName || ''}`;
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500',
      'bg-pink-500', 'bg-teal-500', 'bg-indigo-500', 'bg-red-500',
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  formConfig: FieldConfig[] = [];

  /** The FormGroup from the most recent formReady emission — set
   * synchronously (unlike modalFormRef, which waits a tick for the
   * ViewChild), so onCountryChange/onRegionChange can patch values
   * immediately rather than racing the ViewChild's availability. */
  private activeFormGroup: any = null;
  defaultValues: UpdateProfileDto | null = null;

  ngOnInit(): void {
    this.photoFailed = false;
    this.setupFormConfig();
    this.isLoading = false;
    this.hasError = false;
    this.errorMessage = "";
  }

  constructor(
      protected authService: AuthService,
      protected dialog: MatDialog,
      protected transloco: TranslocoService,
      protected router: Router,
      protected route: ActivatedRoute,
      protected geoService: GeoService,
      protected cdr: ChangeDetectorRef,
  ) {}

  private getFieldConfig(name: string): FieldConfig | undefined {
    return this.formConfig.find((f) => f.name === name);
  }

  private refreshFormConfig(): void {
    this.formConfig = [...this.formConfig];
    this.cdr.detectChanges();
  }

  /** Mirrors the country→region→city cascading already used on the
   * registration form, so editing a profile gets the same searchable
   * dropdowns instead of free-text country/region/city inputs. */
  private onCountryChange(countryName: string, preserveRegion?: string): void {
    const regionField = this.getFieldConfig("region");
    if (!regionField) return;

    if (!preserveRegion) {
      this.activeFormGroup?.patchValue({ region: "", city: "" });
    }

    regionField.options = [];
    regionField.disabled = true;
    regionField.loading = true;
    this.refreshFormConfig();

    this.geoService.getStatesByCountry(countryName).subscribe({
      next: (regions) => {
        regionField.options = regions.sort();
        regionField.disabled = false;
        regionField.loading = false;
        this.refreshFormConfig();

        if (preserveRegion) {
          this.activeFormGroup?.patchValue({ region: preserveRegion });
        }
      },
      error: () => {
        regionField.disabled = false;
        regionField.loading = false;
        this.refreshFormConfig();
      },
    });
  }

  private onRegionChange(countryName: string, regionName: string, preserveCity?: string): void {
    const cityField = this.getFieldConfig("city");
    if (!cityField) return;

    if (!preserveCity) {
      this.activeFormGroup?.patchValue({ city: "" });
    }

    cityField.options = [];
    cityField.disabled = true;
    cityField.loading = true;
    this.refreshFormConfig();

    this.geoService.getCitiesByState(countryName, regionName).subscribe({
      next: (cities) => {
        cityField.options = cities.sort();
        cityField.disabled = false;
        cityField.loading = false;
        this.refreshFormConfig();

        if (preserveCity) {
          this.activeFormGroup?.patchValue({ city: preserveCity });
        }
      },
      error: () => {
        cityField.disabled = false;
        cityField.loading = false;
        this.refreshFormConfig();
      },
    });
  }

  /**
   * Vérifie que la date de naissance correspond à un âge entre 18 et 99 ans.
   * @returns Le message d'erreur traduit si invalide, null sinon.
   */
  handleDateVerify(birthDate: string): string | null {
    if (!birthDate) return null;

    const birth = new Date(birthDate);
    const today = new Date();

    const minAgeDate = new Date(today);
    minAgeDate.setFullYear(today.getFullYear() - 18);

    const maxAgeDate = new Date(today);
    maxAgeDate.setFullYear(today.getFullYear() - 99);

    if (birth > minAgeDate) {
      return this.transloco.translate("profile.errors.birthDate.minAge");
    }
    if (birth < maxAgeDate) {
      return this.transloco.translate("profile.errors.birthDate.maxAge");
    }
    return null;
  }

  onSubmit(formData: any): void {
    const dateError = this.handleDateVerify(formData.birthDate);
    if (dateError) {
      this.hasError = true;
      this.errorMessage = dateError;
      return;
    }

    const payload = this.buildUpdatePayload(formData);
    console.log(payload);
    this.handleUpdate(payload);
  }

  handleUpdate(data: UpdateProfileDto): void {
    if (this.isLoading) return;

    this.setIsLoading(this.dialogRef, true);

    this.hasError = false;
    this.errorMessage = "";

    console.log("in update: ", data);

    this.authService.updateProfile(data).subscribe({
      next: async (updatedUser: User) => {
        await wait();

        this.setIsLoading(this.dialogRef, false);
        this.hasError = false;
        this.errorMessage = "";

        this.authService.setUser(updatedUser);

        this.handleDone(updatedUser as any);
        this.dialogRef.close();
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

  protected buildUpdatePayload(data: any): any {
    const payload: any = {
      accountId: this.profile?.id ?? this.profile?.accountId,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber ?? "",
      gender: data.gender ?? "",
      birthDate: data.birthDate ? new Date(data.birthDate).toISOString() : "",
      city: data.city ?? "",
      region: data.region ?? "",
      country: data.country ?? "",
      profession: data.profession ?? "",
    };

    // Only include bio if provided — it is optional
    if (data.bio !== undefined && data.bio !== null && data.bio !== "") {
      payload.bio = data.bio;
    }

    return payload;
  }

  protected getFullPhotoUrl(photo?: string): string {
    if (!photo) return "";
    const trimmed = photo.trim();
    const isAbsolute = /^https?:\/\//i.test(trimmed);
    if (isAbsolute) return trimmed;

    let clean = trimmed
        .replace(/^undefined\/?/, "")
        .replace(/\/undefined\/?/g, "/");

    const rawBase = environment.apiUrl;
    const base =
        rawBase && rawBase !== "undefined" ? rawBase.replace(/\/$/, "") : "";

    const path = clean.startsWith("/") ? clean : `/${clean}`;
    return base ? `${base}${path}` : path;
  }

  protected getItemLabel(item: any): string {
    return `${item.firstName} ${item.lastName}`;
  }

  handleBack(): void {
    /*************  ✨ Windsurf Command ⭐  *************/
    /**
     * Go back to the list page
     * @remarks
     * This function is supposed to navigate to the list page
     * when the user clicks on the back button.
     * However, this functionality is not implemented yet.
     */
    /*******  466e701b-5f04-4f79-9692-7a115776d69c  *******/
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
        name: "firstName",
        label: "profile.form.firstName.label",
        placeholder: "profile.form.firstName.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(50)],
        errorMessages: {
          required: "profile.errors.firstName.required",
          maxlength: "profile.errors.firstName.maxlength50",
        },
      },
      {
        name: "lastName",
        label: "profile.form.lastName.label",
        placeholder: "profile.form.lastName.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(50)],
        errorMessages: {
          required: "profile.errors.lastName.required",
          maxlength: "profile.errors.lastName.maxlength50",
        },
      },
      {
        name: "phoneNumber",
        label: "profile.form.phoneNumber.label",
        placeholder: "profile.form.phoneNumber.placeholder",
        type: "phone",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.phoneNumber.required",
        },
      },
      {
        name: "gender",
        label: "profile.form.gender.label",
        placeholder: "profile.form.gender.placeholder",
        type: "select",
        required: true,
        size: { xs: 12, md: 6 },
        options: [
          { value: Gender.MALE, label: "enums.gender.MALE" },
          { value: Gender.FEMALE, label: "enums.gender.FEMALE" },
        ],
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.gender.required",
        },
      },
      {
        name: "birthDate",
        label: "profile.form.birthDate.label",
        placeholder: "profile.form.birthDate.placeholder",
        type: "date",
        required: true,
        // L'utilisateur doit avoir au moins 18 ans
        maxDate: (() => {
          const date = new Date();
          date.setFullYear(date.getFullYear() - 18);
          return date.toISOString().split("T")[0];
        })(),
        // L'utilisateur ne peut pas avoir plus de 99 ans
        minDate: (() => {
          const date = new Date();
          date.setFullYear(date.getFullYear() - 99);
          return date.toISOString().split("T")[0];
        })(),
        size: { xs: 12, md: 6 },
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.birthDate.required",
        },
      },
      {
        name: "country",
        label: "profile.form.country.label",
        placeholder: "profile.form.country.placeholder",
        type: "country",
        required: false,
        size: { xs: 12, md: 4 },
      },
      {
        name: "region",
        label: "profile.form.region.label",
        placeholder: "profile.form.region.placeholder",
        type: "searchable-select",
        required: true,
        size: { xs: 12, md: 4 },
        options: [],
        disabled: true,
        loading: false,
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.region.required",
        },
      },
      {
        name: "city",
        label: "profile.form.city.label",
        placeholder: "profile.form.city.placeholder",
        type: "searchable-select",
        required: true,
        size: { xs: 12, md: 4 },
        options: [],
        disabled: true,
        loading: false,
        validation: [Validators.required],
        errorMessages: {
          required: "profile.errors.city.required",
        },
      },
      {
        name: "profession",
        label: "profile.form.profession.label",
        placeholder: "profile.form.profession.placeholder",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required, Validators.maxLength(120)],
        errorMessages: {
          required: "profile.errors.profession.required",
          maxlength: "profile.errors.profession.maxlength120",
        },
      },
      {
        name: "bio",
        label: "profile.form.bio.label",
        placeholder: "profile.form.bio.placeholder",
        type: "textarea",
        required: false,
        size: { xs: 12, md: 12 },
        validation: [Validators.maxLength(4000)],
        errorMessages: {
          maxlength: "profile.errors.bio.maxlength4000",
        },
      },
    ];
  }

  // Holds a reference to the GenericFormComponent rendered inside the modal template
  private modalFormRef: GenericFormComponent | null = null;

  /** Called by the ng-template when the GenericFormComponent is ready */
  onFormReady(form: any): void {
    this.activeFormGroup = form;

    // formReady emits the FormGroup — we capture the component via ViewChild at this moment
    // Use a short timeout to let Angular finish rendering the modal template
    setTimeout(() => {
      this.modalFormRef = this.form ?? null;
    });

    form.get("country")?.valueChanges.subscribe((val: string) => {
      if (val) this.onCountryChange(val);
    });
    form.get("region")?.valueChanges.subscribe((val: string) => {
      const country = form.get("country")?.value;
      if (country && val) this.onRegionChange(country, val);
    });

    // Edit mode: pre-load region/city options for the profile's existing
    // country/region so the dropdowns aren't empty on open.
    if (this.defaultValues?.country) {
      this.onCountryChange(this.defaultValues.country, this.defaultValues.region);
      if (this.defaultValues?.region) {
        this.onRegionChange(
          this.defaultValues.country,
          this.defaultValues.region,
          this.defaultValues.city,
        );
      }
    }
  }

  openModal() {
    this.modalFormRef = null;

    // Préparer les valeurs par défaut à partir du profil utilisateur
    const user = this.authService.getUser();
    if (user) {
      this.defaultValues = {
        accountId: this.profile?.id || this.profile?.accountId,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: this.profile?.phoneNumber || "",
        gender: this.profile?.gender as Gender,
        birthDate: this.profile?.birthDate
            ? formatDateForInput(this.profile.birthDate)
            : "",
        city: this.profile?.city || "",
        region: this.profile?.region || "",
        country: this.profile?.country || "",
        profession: this.profile?.profession || "",
        bio: this.profile?.bio || "",
      };
    }

    this.dialogRef = this.dialog.open(GenericModalComponent, {
      width: "600px",
      panelClass: "mat-mdc-dialog-panel",
      maxWidth: "100vw",
      data: { title: "", template: "", actions: [] },
    });

    const instance = this.dialogRef.componentInstance;

    instance.data.title = this.transloco.translate(
        "profile.dialog.editPersonalInfo.title",
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
        label: this.transloco.translate("general.save"),
        color: "primary",
      },
    ];

    const sub = this.dialogRef.componentInstance.action.subscribe(
        (res: any) => {
          if (res === "confirm") {
            if (this.modalFormRef) {
              this.modalFormRef.submit();
            }
          } else {
            this.dialogRef.close();
            sub.unsubscribe();
          }
        },
    );
  }

  editPersonalInfo() {
    this.openModal();
  }

  handleDone = (updatedProfile?: any) => {
    this.onDone.emit(updatedProfile);
  };

  handleChoose(file: GenericFileManagerFileItem) {
    console.log("The is the choosed file: ", file);

    const data = { accountId: this.profile.id, photoId: file.id };

    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = "";

    this.authService.updateProfile(data).subscribe({
      next: async (updatedUser: User) => {
        await wait();
        console.log(updatedUser);

        // ✅ Update the logged-in user in AuthService
        this.authService.setUser(updatedUser);
        this.photoFailed = false;

        this.handleDone();

        this.isLoading = false;
        this.hasError = false;
        this.errorMessage = "";
      },
      error: async (error: any) => {
        await wait();

        this.isLoading = false;
        this.hasError = true;
        this.errorMessage =
            error?.error?.message ||
            this.transloco.translate("general.genericError");
      },
    });
  }
}