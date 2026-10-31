import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { Validators } from "@angular/forms";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { User, Gender } from "@modules/auth/auth.types";
import { AuthService } from "@modules/auth/auth.service";
import { environment } from "@env/environment";
import { wait } from "../../../../@1hand/utils";
import {
  GenericFormComponent,
  FieldConfig,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import { GenericFileManagerFileItem } from "../../../../@1hand/components/generic-file-manager/generic-file-manager-modal/generic-file-manager-modal.component";
import { GeoService } from "../../../../core/services/geo.service";

@Component({
  selector: "app-profile-settings",
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    GenericFormComponent,
  ],
  template: `
    <div
      *transloco="let t"
      class="bg-white rounded-lg  border border-gray-200 p-6"
    >
      <!-- <div class="mb-8 pb-6 border-b border-gray-200">
        <h3 class="text-base font-semibold text-gray-900 mb-4">
          {{ t("settings.profile.photo") }}
        </h3>
        <div class="flex items-center gap-6">
          <div
            class="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 relative"
          >
            <img
              *ngIf="currentUser?.photo && !isLoadingPhoto"
              [src]="getFullPhotoUrl(currentUser?.photo)"
              [alt]="t('settings.profile.photo')"
              class="w-full h-full object-cover"
            />
            <div
              *ngIf="!currentUser?.photo && !isLoadingPhoto"
              class="w-full h-full flex items-center justify-center text-gray-400"
            >
              <i class="fas fa-user text-3xl"></i>
            </div>
            <div
              *ngIf="isLoadingPhoto"
              class="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center"
            >
              <app-loader [showText]="false"></app-loader>
            </div>
          </div>
          <div>
            <app-generic-file-upload-button
              (onChoose)="handleChoosePhoto($event)"
            ></app-generic-file-upload-button>
            <p class="text-sm text-red-500 mt-2" *ngIf="photoError">
              {{ photoError }}
            </p>
          </div>
        </div>
      </div> -->

      <app-generic-form
        [fieldConfigurations]="fieldConfigs"
        [defaultValues]="defaultValues"
        [isLoading]="isLoading"
        [transationNamespace]="'settings'"
        (submitForm)="onSubmit($event)"
        (formReady)="onFormReady($event)"
      ></app-generic-form>
    </div>
  `,
})
export class ProfileSettingsComponent implements OnInit, OnChanges {
  @Input() currentUser: User | null = null;
  @Input() isLoading = false;
  @Output() profileUpdate = new EventEmitter<any>();

  fieldConfigs: FieldConfig[] = [];
  defaultValues: any = {};

  isLoadingPhoto = false;
  photoError: string = "";

  private activeFormGroup: any = null;

  constructor(
    private authService: AuthService,
    private translocoService: TranslocoService,
    private geoService: GeoService,
  ) {}

  private getFieldConfig(name: string): FieldConfig | undefined {
    return this.fieldConfigs.find((f) => f.name === name);
  }

  private refreshFieldConfigs(): void {
    this.fieldConfigs = [...this.fieldConfigs];
  }

  onFormReady(form: any): void {
    this.activeFormGroup = form;

    form.get("country")?.valueChanges.subscribe((val: string) => {
      if (val) this.onCountryChange(val);
    });
    form.get("region")?.valueChanges.subscribe((val: string) => {
      const country = form.get("country")?.value;
      if (country && val) this.onRegionChange(country, val);
    });

    if (this.currentUser?.country) {
      this.onCountryChange(this.currentUser.country, this.currentUser.region);
      if (this.currentUser.region) {
        this.onRegionChange(
          this.currentUser.country,
          this.currentUser.region,
          this.currentUser.city,
        );
      }
    }
  }

  private onCountryChange(countryName: string, preserveRegion?: string): void {
    const regionField = this.getFieldConfig("region");
    if (!regionField) return;

    if (!preserveRegion) {
      this.activeFormGroup?.patchValue({ region: "", city: "" });
    }

    regionField.options = [];
    regionField.disabled = true;
    regionField.loading = true;
    this.refreshFieldConfigs();

    this.geoService.getStatesByCountry(countryName).subscribe({
      next: (regions) => {
        regionField.options = regions.sort();
        regionField.disabled = false;
        regionField.loading = false;
        this.refreshFieldConfigs();

        if (preserveRegion) {
          this.activeFormGroup?.patchValue({ region: preserveRegion });
        }
      },
      error: () => {
        regionField.disabled = false;
        regionField.loading = false;
        this.refreshFieldConfigs();
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
    this.refreshFieldConfigs();

    this.geoService.getCitiesByState(countryName, regionName).subscribe({
      next: (cities) => {
        cityField.options = cities.sort();
        cityField.disabled = false;
        cityField.loading = false;
        this.refreshFieldConfigs();

        if (preserveCity) {
          this.activeFormGroup?.patchValue({ city: preserveCity });
        }
      },
      error: () => {
        cityField.disabled = false;
        cityField.loading = false;
        this.refreshFieldConfigs();
      },
    });
  }

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["currentUser"] && !changes["currentUser"].firstChange) {
      this.initializeForm();
    }
  }

  private initializeForm() {
    this.fieldConfigs = [
      {
        name: "firstName",
        label: "profile.firstName",
        type: "string",
        required: true,
        validation: [Validators.maxLength(50)],
        size: { md: 6 },
        errorMessages: {
          required: "validation.required",
          maxlength: "validation.maxLength",
        },
      },
      {
        name: "lastName",
        label: "profile.lastName",
        type: "string",
        required: true,
        validation: [Validators.maxLength(50)],
        size: { md: 6 },
        errorMessages: {
          required: "validation.required",
          maxlength: "validation.maxLength",
        },
      },
      {
        name: "email",
        label: "profile.email",
        type: "string",
        required: true,
        validation: [Validators.email],
        size: { md: 6 },
        errorMessages: {
          required: "validation.required",
          email: "validation.email",
        },
      },
      {
        name: "phoneNumber",
        label: "profile.phoneNumber",
        type: "phone",
        required: true,
        size: { md: 6 },
        errorMessages: {
          required: "validation.required",
        },
      },
      {
        name: "gender",
        label: "profile.gender",
        type: "select",
        required: true,
        options: [
          { value: Gender.MALE, label: "settings.profile.genderOptions.male" },
          {
            value: Gender.FEMALE,
            label: "settings.profile.genderOptions.female",
          },
        ],
        size: { md: 6 },
        errorMessages: {
          required: "validation.required",
        },
      },
      {
        name: "birthDate",
        label: "profile.birthDate",
        type: "date",
        maxDate: (() => {
          const today = new Date();
          today.setDate(today.getDate() - 1);
          return today.toISOString().split("T")[0];
        })(),
        size: { md: 6 },
      },
      {
        name: "placeOfBirth",
        label: "profile.placeOfBirth",
        type: "string",
        required: true,
        validation: [Validators.maxLength(100)],
        size: { md: 6 },
        errorMessages: {
          maxlength: "validation.maxLength",
        },
      },
      {
        name: "profession",
        label: "profile.profession",
        type: "string",
        required: true,
        validation: [Validators.maxLength(100)],
        size: { md: 6 },
        errorMessages: {
          maxlength: "validation.maxLength",
        },
      },
      {
        name: "country",
        label: "profile.country",
        type: "country",
        size: { md: 4 },
        required: true,
      },
      {
        name: "region",
        label: "profile.region",
        type: "searchable-select",
        required: true,
        size: { md: 4 },
        options: [],
        disabled: true,
        loading: false,
        errorMessages: {
          required: "validation.required",
        },
      },
      {
        name: "city",
        label: "profile.city",
        type: "searchable-select",
        required: true,
        size: { md: 4 },
        options: [],
        disabled: true,
        loading: false,
        errorMessages: {
          required: "validation.required",
        },
      },
    ];

    this.defaultValues = {
      firstName: this.currentUser?.firstName || "",
      lastName: this.currentUser?.lastName || "",
      email: this.currentUser?.email || "",
      phoneNumber: this.currentUser?.phoneNumber || "",
      gender: this.currentUser?.gender || "",
      birthDate: this.currentUser?.birthDate
        ? new Date(this.currentUser.birthDate).toISOString().split("T")[0]
        : "",
      profession: (this.currentUser as any)?.profession || "",
      placeOfBirth: (this.currentUser as any)?.placeOfBirth || "",
      country: this.currentUser?.country || "",
      region: this.currentUser?.region || "",
      city: this.currentUser?.city || "",
    };
  }

  onSubmit(formData: any) {
    const transformedData = {
      ...formData,
      phoneNumber: formData.phoneNumber,
    };
    this.profileUpdate.emit(transformedData);
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

  handleChoosePhoto(file: GenericFileManagerFileItem): void {
    if (!this.currentUser?.id) return;

    const data = { accountId: this.currentUser.id, photoId: file.id };

    this.isLoadingPhoto = true;
    this.photoError = "";

    this.authService.updateProfile(data).subscribe({
      next: async (updatedUser: User) => {
        await wait();
        this.isLoadingPhoto = false;
        this.photoError = "";

        // ✅ Update the logged-in user in AuthService
        this.authService.setUser(updatedUser);
        this.currentUser = updatedUser;
      },
      error: async (error: any) => {
        await wait();
        this.isLoadingPhoto = false;
        this.photoError =
          error?.error?.message ||
          this.translocoService.translate("settings.messages.photoUpdateError");
      },
    });
  }
}
