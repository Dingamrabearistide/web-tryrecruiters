import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnChanges,
  AfterViewInit,
  OnDestroy,
  SimpleChanges,
  ChangeDetectorRef,
} from "@angular/core";
import { Validators } from "@angular/forms";
import {
  FieldConfig,
  GenericFormComponent,
} from "../../../../@1hand/components/generic-form/generic-form.component";
import {
  JobType,
  ContractType,
  JobLevel,
  EducationLevel,
  JobOfferFormData as FormData,
} from "@modules/job-offers/job-offers.types";
import { Company } from "@modules/compagnies/companies.types";
import { GeoService } from "../../../../core/services/geo.service";
import { JobOffersService } from "@modules/job-offers/job-offers.service";

@Component({
  standalone: false,

  selector: "app-job-offers-form",
  templateUrl: "./job-offers-form.component.html",
  styleUrls: ["./job-offers-form.component.scss", "../../../../../styles/legacy-styles.css"],
})
export class JobOffersFormComponent
  implements OnInit, OnChanges, AfterViewInit, OnDestroy
{
  @ViewChild("genericFormComp", { static: false })
  formComponent!: GenericFormComponent;

  @Input() isLoading = false;
  @Input() defaultValues?: FormData = {} as FormData;
  @Input() companies?: Company[];

  @Output() onSubmit: EventEmitter<FormData> = new EventEmitter();

  genericFormConfig: FieldConfig[] = [];

  /** defaultValues actually handed to app-generic-form: the raw `location`
   * string is split into country/city here since the backend still only
   * stores a single location string. */
  formDefaultValues: any = {};

  private subs: Array<any> = [];

  constructor(
    private cdr: ChangeDetectorRef,
    private geoService: GeoService,
    private jobOffersService: JobOffersService,
  ) {}

  private loadCurrencies(): void {
    this.jobOffersService.getCurrencies().subscribe({
      next: (currencies) => {
        const salaryField = this.getFieldConfig("salary");
        if (salaryField?.unitField) {
          salaryField.unitField.options = currencies.map((c) => ({
            value: c.code,
            label: `${c.code} — ${c.label} (${(c.countries || []).join(", ")})`,
          }));
          this.refreshConfig();
          // Adding options after the <select> has rendered can make the
          // browser visually default to the first one; re-assert the
          // control's real value so nothing looks pre-selected.
          this.preserveSelectValue("salaryCurrency");
        }
      },
      error: (err) => console.error("Error loading currencies:", err),
    });
  }

  /** Re-writes a select control's current value after its options list
   * changes, to counter the browser defaulting the visible selection to
   * the first newly-added option when nothing was actually chosen. */
  private preserveSelectValue(fieldName: string): void {
    const control = this.formComponent?.form?.get(fieldName);
    if (!control) return;
    const current = control.value ?? "";
    control.setValue(current, { emitEvent: false });
  }

  /** salaryCurrency becomes required as soon as an amount is entered in
   * salary; an empty salary makes it optional again (backend rejects a
   * priced offer with no currency, but accepts a currency-less empty
   * salary). */
  private syncSalaryCurrencyValidator(salaryValue: any): void {
    const control = this.formComponent?.form?.get("salaryCurrency");
    if (!control) return;

    const hasSalary = salaryValue !== null && salaryValue !== undefined && salaryValue !== "";
    control.setValidators(hasSalary ? [Validators.required] : []);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private getFieldConfig(name: string): FieldConfig | undefined {
    return this.genericFormConfig.find((f) => f.name === name);
  }

  private refreshConfig(): void {
    this.genericFormConfig = [...this.genericFormConfig];
    this.cdr.detectChanges();
  }

  private onCountryChange(countryName: string, preserveRegion?: string): void {
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

  private onRegionChange(countryName: string, regionName: string, preserveCity?: string): void {
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

  /** Legacy job offers only ever stored city + country (no region) — when
   * editing one of those, skip the region gate so the existing city still
   * loads, instead of leaving the city field disabled forever for lack of
   * a region we have no way to infer. */
  private loadCitiesByCountryOnly(countryName: string, preserveCity?: string): void {
    const cityField = this.getFieldConfig("city");
    if (!cityField) return;

    cityField.options = [];
    cityField.disabled = true;
    cityField.loading = true;
    this.refreshConfig();

    this.geoService.getCitiesByCountry(countryName).subscribe({
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

  /** Best-effort split of a legacy free-text "location" value into
   * "City, Country" so existing job offers can be pre-filled for editing. */
  private splitLocation(location?: string): { city?: string; country?: string } {
    if (!location) return {};
    const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 2) {
      return { city: parts[0], country: parts[parts.length - 1] };
    }
    return {};
  }

  private buildFormDefaultValues(): void {
    const { city, country } = this.splitLocation(this.defaultValues?.location);
    this.formDefaultValues = {
      ...(this.defaultValues || {}),
      country: this.defaultValues?.country || country,
      city: this.defaultValues?.city || city,
    };
  }

  ngOnInit(): void {
    this.buildFormDefaultValues();
    this.loadCurrencies();

    this.genericFormConfig = [
      {
        name: "company",
        label: "form.company",
        placeholder: "form.company",
        type: "autocomplete",
        required: true,
        size: { xs: 12 },
        displayFn: (item) => item.name,
        options: this.companies,
        defaultValue: !this.defaultValues?.company
          ? undefined
          : this.companies?.find(
              (c) => c.id === this.defaultValues?.company.id,
            ),
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.company.required",
        },
      },
      {
        name: "title",
        label: "form.title",
        placeholder: "form.title",
        type: "string",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(255),
        ],
        errorMessages: {
          required: "form.errors.fields.title.required",
          minlength: "form.errors.fields.title.minlength",
          maxlength: "form.errors.fields.title.maxlength",
        },
      },
      {
        name: "jobType",
        label: "form.jobType",
        placeholder: "form.jobType",
        type: "select",
        multiple: false,
        required: true,
        size: { xs: 12, md: 6 },
        options: [
          { value: JobType.ONSITE, label: "joboffers.jobType.ONSITE" },
          { value: JobType.HYBRID, label: "joboffers.jobType.HYBRID" },
          { value: JobType.REMOTE, label: "joboffers.jobType.REMOTE" },
        ],
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.jobType.required",
        },
      },
      {
        name: "description",
        label: "form.description",
        placeholder: "form.description",
        type: "richtext",
        multiline: true,
        rows: 6,
        required: true,
        size: { xs: 12 },
        editorOptions: {
          // minHeight: 300,
        },
        validation: [Validators.required, Validators.minLength(10)],
        errorMessages: {
          required: "form.errors.fields.description.required",
          minlength: "form.errors.fields.description.minlength",
        },
      },
      {
        name: "country",
        label: "form.country",
        placeholder: "form.country",
        type: "country",
        required: true,
        size: { xs: 12, md: 4 },
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.country.required",
        },
      },
      {
        name: "region",
        label: "form.region",
        placeholder: "form.region",
        type: "searchable-select",
        required: false,
        size: { xs: 12, md: 4 },
        options: [],
        disabled: true,
        loading: false,
      },
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
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.city.required",
        },
      },
      {
        name: "salary",
        label: "form.salary",
        placeholder: "form.salary",
        type: "number-with-select",
        required: false,
        size: { xs: 12, md: 6 },
        validation: [Validators.min(0)],
        errorMessages: {
          min: "form.errors.fields.salary.min",
        },
        unitField: {
          name: "salaryCurrency",
          placeholder: "form.salaryCurrency",
          options: [],
          loading: false,
          validation: [],
          errorMessages: {
            required: "form.errors.fields.salaryCurrency.required",
          },
        },
      },
      {
        name: "contractType",
        label: "form.contractType",
        placeholder: "form.contractType",
        type: "select",
        required: true,
        size: { xs: 12, md: 6 },
        options: [
          {
            value: ContractType.FULL_TIME,
            label: "joboffers.contractType.FULL_TIME",
          },
          {
            value: ContractType.PART_TIME,
            label: "joboffers.contractType.PART_TIME",
          },
          {
            value: ContractType.TEMPORARY,
            label: "joboffers.contractType.TEMPORARY",
          },
          {
            value: ContractType.FREELANCE,
            label: "joboffers.contractType.FREELANCE",
          },
          {
            value: ContractType.INTERNSHIP,
            label: "joboffers.contractType.INTERNSHIP",
          },
        ],
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.contractType.required",
        },
      },
      {
        name: "experienceYears",
        label: "form.experienceYears",
        placeholder: "form.experienceYears",
        type: "number",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [
          Validators.required,
          Validators.min(0),
          Validators.max(50),
        ],
        errorMessages: {
          required: "form.errors.fields.experienceYears.required",
          min: "form.errors.fields.experienceYears.min",
          max: "form.errors.fields.experienceYears.max",
        },
      },
      {
        name: "educationLevel",
        label: "form.educationLevel",
        placeholder: "form.educationLevel",
        type: "select",
        required: true,
        size: { xs: 12, md: 6 },
        options: [
          {
            value: EducationLevel.HIGH_SCHOOL,
            label: "joboffers.educationLevel.HIGH_SCHOOL",
          },
          {
            value: EducationLevel.BACHELOR_DEGREE,
            label: "joboffers.educationLevel.BACHELOR_DEGREE",
          },
          {
            value: EducationLevel.MASTER_DEGREE,
            label: "joboffers.educationLevel.MASTER_DEGREE",
          },
          {
            value: EducationLevel.GRADUATION,
            label: "joboffers.educationLevel.GRADUATION",
          },
        ],
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.educationLevel.required",
        },
      },
      {
        name: "jobLevel",
        label: "form.jobLevel",
        placeholder: "form.jobLevel",
        type: "select",
        required: true,
        size: { xs: 12, md: 6 },
        options: [
          {
            value: JobLevel.ENTRY_LEVEL,
            label: "joboffers.jobLevel.ENTRY_LEVEL",
          },
          { value: JobLevel.MID_LEVEL, label: "joboffers.jobLevel.MID_LEVEL" },
          {
            value: JobLevel.EXPERT_LEVEL,
            label: "joboffers.jobLevel.EXPERT_LEVEL",
          },
        ],
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.jobLevel.required",
        },
      },
      {
        name: "expiresAt",
        label: "form.expiresAt",
        placeholder: "form.expiresAt",
        type: "date",
        required: true,
        size: { xs: 12, md: 6 },
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.expiresAt.required",
        },
        formatDefaultValue: (value: any) => {
          if (!value) return "";
          // API returns ISO datetime; <input type="date"> needs YYYY-MM-DD
          return typeof value === "string" ? value.substring(0, 10) : value;
        },
      },
      {
        name: "isPublished",
        label: "form.isPublished",
        placeholder: "form.isPublished",
        type: "select",
        required: true,
        size: { xs: 12, md: 6 },
        defaultValue: false,
        options: [
          { value: true, label: "options.yes" },
          { value: false, label: "options.no" },
        ],
        validation: [Validators.required],
        errorMessages: {
          required: "form.errors.fields.isPublished.required",
        },
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["defaultValues"] && !changes["defaultValues"].isFirstChange()) {
      this.buildFormDefaultValues();
    }
  }

  ngAfterViewInit(): void {
    const waitForForm = () => {
      const form = this.formComponent?.form;
      if (!form) {
        setTimeout(waitForForm, 50);
        return;
      }

      const countrySub = form.get("country")?.valueChanges.subscribe((val) => {
        if (val) this.onCountryChange(val);
      });
      const regionSub = form.get("region")?.valueChanges.subscribe((val) => {
        const country = form.get("country")?.value;
        if (country && val) this.onRegionChange(country, val);
      });
      this.subs.push(countrySub, regionSub);

      // Edit mode: pre-load for the country/region/city parsed from
      // `location`. Older offers only ever had city + country (no region),
      // so fall back to a country-wide city list instead of leaving the
      // city field disabled forever waiting on a region we can't infer.
      if (this.formDefaultValues?.country) {
        if (this.formDefaultValues?.region) {
          this.onCountryChange(this.formDefaultValues.country, this.formDefaultValues.region);
          this.onRegionChange(
            this.formDefaultValues.country,
            this.formDefaultValues.region,
            this.formDefaultValues.city,
          );
        } else {
          this.onCountryChange(this.formDefaultValues.country);
          this.loadCitiesByCountryOnly(
            this.formDefaultValues.country,
            this.formDefaultValues.city,
          );
        }
      }

      const salarySub = form.get("salary")?.valueChanges.subscribe((val) => {
        this.syncSalaryCurrencyValidator(val);
      });
      this.subs.push(salarySub);
      this.syncSalaryCurrencyValidator(form.get("salary")?.value);
    };

    waitForForm();
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s && s.unsubscribe && s.unsubscribe());
  }

  /** Triggers the shared form's own validation/submit path (so draft and
   * publish go through the same required-field checks) but tags the
   * emitted payload so the parent page knows which one was requested. */
  isDraftSubmit = false;

  saveDraft(): void {
    this.isDraftSubmit = true;
    this.formComponent.onSubmit();
  }

  handleSubmit(data: FormData) {
    const country = (data as any).country;
    const city = (data as any).city;
    const location = [city, country].filter(Boolean).join(", ");

    const isDraft = this.isDraftSubmit;
    this.isDraftSubmit = false;

    this.onSubmit.emit({
      ...data,
      location,
      isDraft,
    });
  }
}
