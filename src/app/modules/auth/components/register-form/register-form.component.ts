import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
} from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { TranslocoService } from "@ngneat/transloco";
import { GeoService } from "../../../../core/services/geo.service";

export type AccountType = "CANDIDATE" | "RECRUITER";

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: any;
  country: string;
  region: string;
  city: string;
  password: string;
  confirmPassword: string;
}

@Component({
  standalone: false,
  selector: "app-register-form",
  templateUrl: "./register-form.component.html",
  styleUrls: ["./register-form.component.scss"],
})
export class RegisterFormComponent implements OnInit, OnChanges {
  @Input() isLoading = false;
  @Input() accountType: AccountType = "CANDIDATE";
  @Output("onSubmit") handleSubmit = new EventEmitter<RegisterFormData>();
  @Output() openTermsEvent = new EventEmitter<void>();

  form!: FormGroup;
  regions: string[] = [];
  cities: string[] = [];
  showPassword = false;
  showConfirmPassword = false;
  loadingRegions = false;
  loadingCities = false;


  constructor(
    private fb: FormBuilder,
    private translocoService: TranslocoService,
    private geoService: GeoService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        firstName: [
          "",
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[A-Za-zÀ-ÿ' -]+$/),
          ],
        ],
        lastName: [
          "",
          [
            Validators.required,
            Validators.maxLength(50),
            Validators.pattern(/^[A-Za-zÀ-ÿ' -]+$/),
          ],
        ],
        email: [
          "",
          [Validators.required, Validators.email, Validators.maxLength(100)],
        ],
        phone: [undefined, [Validators.required]],
        country: ["", [Validators.maxLength(56)]],
        region: ["", [Validators.maxLength(100)]],
        city: ["", [Validators.maxLength(100)]],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(64),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=~`[\]{}|:;"'<>,.?/\\]).+$/,
            ),
          ],
        ],
        confirmPassword: ["", [Validators.required]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordsMatch },
    );

    // Country → load regions
    this.form.get("country")?.valueChanges.subscribe((country) => {
      this.regions = [];
      this.cities = [];
      this.form.patchValue({ region: "", city: "" }, { emitEvent: false });
      if (country) {
        this.onCountryChange(country);
      }
    });

    // Region → load cities
    this.form.get("region")?.valueChanges.subscribe((region) => {
      this.cities = [];
      this.form.patchValue({ city: "" }, { emitEvent: false });
      const country = this.form.get("country")?.value;
      if (country && region) {
        this.onRegionChange(country, region);
      }
    });

    this.updateLocationValidation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["accountType"] && this.form) {
      this.updateLocationValidation();
    }
  }

  updateLocationValidation(): void {
    const countryControl = this.form.get("country");
    const regionControl = this.form.get("region");
    const cityControl = this.form.get("city");

    if (this.accountType === "RECRUITER") {
      countryControl?.setValidators([Validators.required, Validators.maxLength(56)]);
      regionControl?.setValidators([Validators.required, Validators.maxLength(100)]);
      cityControl?.setValidators([Validators.required, Validators.maxLength(100)]);
    } else {
      countryControl?.setValidators([Validators.maxLength(56)]);
      regionControl?.setValidators([Validators.maxLength(100)]);
      cityControl?.setValidators([Validators.maxLength(100)]);
      countryControl?.setValue("", { emitEvent: false });
      regionControl?.setValue("", { emitEvent: false });
      cityControl?.setValue("", { emitEvent: false });
      this.regions = [];
      this.cities = [];
    }

    countryControl?.updateValueAndValidity();
    regionControl?.updateValueAndValidity();
    cityControl?.updateValueAndValidity();
  }

  passwordsMatch(group: AbstractControl) {
    const pass = group.get("password")?.value;
    const confirm = group.get("confirmPassword")?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  loadCountries() {
    // Countries are now loaded by the CountrySelectComponent directly
  }

  onCountryChange(countryName: string) {
    this.loadingRegions = true;
    this.regions = [];
    this.cities = [];

    this.geoService.getStatesByCountry(countryName).subscribe({
      next: (states) => {
        this.regions = states.sort();
        this.loadingRegions = false;
      },
      error: (error) => {
        console.error("Error loading regions:", error);
        this.loadingRegions = false;
      },
    });
  }

  onRegionChange(countryName: string, stateName: string) {
    this.loadingCities = true;
    this.cities = [];

    this.geoService.getCitiesByState(countryName, stateName).subscribe({
      next: (cities) => {
        this.cities = cities.sort();
        this.loadingCities = false;
      },
      error: (error) => {
        console.error("Error loading cities:", error);
        this.loadingCities = false;
      },
    });
  }

  submit() {
    if (this.form.valid) {
      const value: RegisterFormData = { ...this.form.value };

      this.handleSubmit.emit(value);
    } else {
      this.form.markAllAsTouched();
    }
  }

  control(name: string): AbstractControl | null {
    return this.form.get(name);
  }

  openTerms(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.openTermsEvent.emit();
  }
}
