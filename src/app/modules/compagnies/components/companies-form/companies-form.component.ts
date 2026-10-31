import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  ViewChild,
  OnInit,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from "@angular/core";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import { Validators } from "@angular/forms";
import { CompanyFormData as FormData } from "@modules/compagnies/companies.types";
import { GeoService } from "../../../../core/services/geo.service";

@Component({
  standalone: false,

  selector: "app-companies-form",
  templateUrl: "./companies-form.component.html",
  styleUrls: [
    "./companies-form.component.scss",
    "../../../../../styles/legacy-styles.css",
  ],
})
export class CompaniesFormComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild(GenericFormComponent, { static: false })
  formComponent!: GenericFormComponent;

  @Input() isLoading = false;
  @Input() defaultValues?: FormData;
  @Output() onSubmit: EventEmitter<FormData> = new EventEmitter();

  private _canSave: boolean = false;
  private subs: Array<any> = [];

  genericFormConfig: FieldConfig[] = [
    {
      name: "name",
      label: "form.name",
      required: true,
      placeholder: "form.name",
      type: "string",
      size: { xs: 12, md: 6 },
      validation: [Validators.minLength(2), Validators.maxLength(255)],
      errorMessages: {
        required: "form.errors.fields.name.required",
        maxlength: "form.errors.fields.name.maxlength",
        pattern: "form.errors.fields.name.pattern",
      },
    },
    {
      name: "email",
      label: "form.email",
      placeholder: "form.email",
      type: "string",
      required: true,
      size: { xs: 12, md: 6 },
      validation: [Validators.email, Validators.maxLength(255)],
      errorMessages: {
        required: "form.errors.fields.email.required",
        email: "form.errors.fields.email.email",
        maxlength: "form.errors.fields.email.maxlength",
      },
    },
    {
      name: "logoFile",
      label: "form.logo",
      required: false,
      placeholder: "form.logo",
      type: "fileuploader",
      size: { xs: 12 },
    },
    {
      name: "description",
      label: "form.description",
      placeholder: "form.description",
      type: "richtext",
      multiline: true,
      rows: 4,
      size: { xs: 12 },
      validation: [Validators.maxLength(1000)],
      errorMessages: {
        maxlength: "form.errors.fields.description.maxlength",
      },
    },
    {
      name: "website",
      label: "form.website",
      placeholder: "form.website",
      type: "string",
      size: { xs: 12, md: 6 },
      required: true,
      validation: [
        Validators.pattern(/^https?:\/\/[^\s$.?#].[^\s]*$/),
        Validators.minLength(5),
        Validators.maxLength(255),
      ],
      errorMessages: {
        required: "form.errors.fields.website.required",
        pattern: "form.errors.fields.website.pattern",
        minlength: "form.errors.minLength",
        maxlength: "form.errors.maxLength",
      },
    },
    {
      name: "phoneNumber",
      label: "form.phoneNumber",
      placeholder: "form.phoneNumber",
      type: "phone",
      required: true,
      size: { xs: 12, md: 6 },
      errorMessages: {
        required: "form.errors.fields.phoneNumber.required",
        pattern: "form.errors.validatePhoneNumber",
      },
    },
    //  country : searchable dropdown with flags, self-loads its own list
    {
      name: "country",
      label: "form.country",
      placeholder: "form.country",
      type: "country",
      required: true,
      size: { xs: 12, md: 4 },
      validation: [Validators.maxLength(100)],
      errorMessages: {
        required: "form.errors.fields.country.required",
        maxlength: "form.errors.fields.country.maxlength",
      },
    },
    // region : searchable dropdown, disabled until a country is chosen
    {
      name: "region",
      label: "form.region",
      placeholder: "form.region",
      type: "searchable-select",
      required: true,
      size: { xs: 12, md: 4 },
      options: [],
      disabled: true,
      loading: false,
      validation: [Validators.maxLength(100)],
      errorMessages: {
        required: "form.errors.fields.region.required",
        maxlength: "form.errors.fields.region.maxlength",
      },
    },
    // city : searchable dropdown, disabled until a region is chosen
    {
      name: "city",
      label: "form.city",
      placeholder: "form.city",
      type: "searchable-select",
      required: true,
      size: { xs: 12, md: 4 },
      options: [],
      disabled: true,
      loading: false,
      validation: [Validators.maxLength(100)],
      errorMessages: {
        required: "form.errors.fields.city.required",
        maxlength: "form.errors.fields.city.maxlength",
      },
    },
    {
      name: "addressLine1",
      label: "form.addressLine1",
      placeholder: "form.addressLine1",
      type: "string",
      size: { xs: 12, md: 4 },
      validation: [Validators.maxLength(255)],
      errorMessages: {
        required: "form.errors.fields.addressLine1.required",
        maxlength: "form.errors.fields.addressLine1.maxlength",
      },
    },
    // {
    //   name: "addressLine2",
    //   label: "form.addressLine2",
    //   placeholder: "form.addressLine2",
    //   type: "string",
    //   size: { xs: 12, md: 6 },
    //   validation: [Validators.maxLength(255)],
    //   errorMessages: {
    //     maxlength: "form.errors.fields.addressLine2.maxlength",
    //   },
    // },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private geoService: GeoService,
  ) {}

  // ─── Helpers config ────────────────────────────────────────────────────────

  private getFieldConfig(name: string): FieldConfig | undefined {
    return this.genericFormConfig.find((f) => f.name === name);
  }

  /** Déclenche la détection de changements sur genericFormConfig pour que
   *  GenericFormComponent reçoive les nouvelles options/disabled/loading */
  private refreshConfig(): void {
    this.genericFormConfig = [...this.genericFormConfig];
    this.cdr.detectChanges();
  }

  // ─── GeoService ────────────────────────────────────────────────────────────

  onCountryChange(countryName: string, preserveRegion?: string): void {
    const regionField = this.getFieldConfig("region");
    if (!regionField) return;

    if (!preserveRegion) {
      this.formComponent?.form?.patchValue({ region: "", city: "" });
    }

    regionField.options = [];
    regionField.disabled = true;
    regionField.loading = true;
    this.refreshConfig();

    this.geoService.getStatesByCountry(countryName).subscribe({
      next: (regions) => {
        regionField.options = regions.sort();
        regionField.disabled = false;
        regionField.loading = false;
        this.refreshConfig();

        if (preserveRegion) {
          this.formComponent?.form?.patchValue({ region: preserveRegion });
        }
      },
      error: (err) => {
        console.error("Error loading regions:", err);
        regionField.disabled = false;
        regionField.loading = false;
        this.refreshConfig();
      },
    });
  }

  onRegionChange(countryName: string, regionName: string, preserveCity?: string): void {
    const cityField = this.getFieldConfig("city");
    if (!cityField) return;

    if (!preserveCity) {
      this.formComponent?.form?.patchValue({ city: "" });
    }

    cityField.options = [];
    cityField.disabled = true;
    cityField.loading = true;
    this.refreshConfig();

    this.geoService.getCitiesByState(countryName, regionName).subscribe({
      next: (cities) => {
        cityField.options = cities.sort();
        cityField.disabled = false;
        cityField.loading = false;
        this.refreshConfig();

        if (preserveCity) {
          this.formComponent?.form?.patchValue({ city: preserveCity });
        }
      },
      error: (err) => {
        console.error("Error loading cities:", err);
        cityField.disabled = false;
        cityField.loading = false;
        this.refreshConfig();
      },
    });
  }

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    const hasNewDefaults =
      !!changes["defaultValues"] && !changes["defaultValues"].isFirstChange();
    const loadingChangedToFalse =
      !!changes["isLoading"] &&
      changes["isLoading"].previousValue === true &&
      changes["isLoading"].currentValue === false;

    if (!this.formComponent) return;

    if (hasNewDefaults || (loadingChangedToFalse && this.defaultValues)) {
      const form = this.formComponent.form;

      if (form && form.dirty) {
        const current = form.getRawValue() || {};
        const merged = {
          ...(this.defaultValues || {}),
          ...current,
        } as FormData;
        this.formComponent.defaultValues = merged;
        return;
      }

      if (!this.isLoading) {
        this.formComponent.defaultValues = this.defaultValues || {};

        //  Si on est en mode édition et qu'un pays est déjà renseigné,
        //    charger les régions puis les villes correspondantes
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
    }
  }

  ngAfterViewInit(): void {
    const waitForForm = () => {
      const form = this.formComponent?.form;
      if (!form) {
        setTimeout(waitForForm, 50);
        return;
      }

      const compute = () => {
        this._canSave = this.isUpdateMode
          ? form.dirty && form.valid
          : form.valid;
        this.cdr.detectChanges();
      };

      compute();

      //  Écoute les changements du champ country pour charger les régions
      const countrySub = form.get("country")?.valueChanges.subscribe((val) => {
        if (val) this.onCountryChange(val);
      });
      //  Écoute les changements du champ region pour charger les villes
      const regionSub = form.get("region")?.valueChanges.subscribe((val) => {
        const country = form.get("country")?.value;
        if (country && val) this.onRegionChange(country, val);
      });

      const s1 = form.statusChanges.subscribe(() => compute());
      const s2 = form.valueChanges.subscribe(() => compute());
      this.subs.push(s1, s2, countrySub, regionSub);
    };

    waitForForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s && s.unsubscribe && s.unsubscribe());
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  get isUpdateMode(): boolean {
    return !!this.defaultValues;
  }

  get canSave(): boolean {
    return this._canSave;
  }

  submitManually(): void {
    if (this.formComponent) {
      this.formComponent.submit();
    } else {
      console.warn("generic form not found.");
    }
  }

  handleSubmit(data: FormData): void {
    this.onSubmit.emit(data);
  }
}
