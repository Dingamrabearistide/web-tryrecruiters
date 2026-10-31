import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

export interface FilterCriteria {
  category?: string;
  postedDate?: string;
  experienceLevel?: string;
  location?: string;
  searchQuery?: string;
}

// Alias pour la compatibilité
export interface JobFilterCriteria extends FilterCriteria {}

@Component({
  standalone: false,

  selector: "app-top-filters",
  templateUrl: "./top-filters.component.html",
  styleUrls: ["./top-filters.component.scss"],
})
export class TopFiltersComponent implements OnChanges {
  // Input pour recevoir les filtres initiaux
  @Input() initialFilters: JobFilterCriteria = {};

  // Champs liés au formulaire
  selectedCategory: string = "";
  selectedDate: string = "";
  selectedExperience: string = "";
  selectedLocation: string = "";
  searchQuery: string = "";

  // Options dynamiques
  readonly categoryOptions = ["PRIVATE", "PUBLIC"];
  readonly dateOptions = [
    { labelKey: "filters.dateOptions.anytime", value: "anytime" },
    { labelKey: "filters.dateOptions.pastMonth", value: "past_month" },
    { labelKey: "filters.dateOptions.pastWeek", value: "past_week" },
    { labelKey: "filters.dateOptions.past24h", value: "past_24h" },
  ];
  readonly experienceOptions = [
    { labelKey: "filters.experienceOptions.entry", value: "entry" },
    { labelKey: "filters.experienceOptions.mid", value: "mid" },
    { labelKey: "filters.experienceOptions.senior", value: "senior" },
  ];
  readonly locationOptions = [
    "Remote",
    "Africa",
    "Douala",
    "Yaoundé",
    "Abuja",
    "Lagos",
    "Accra",
    "Kinshasa",
    "Johannesburg",
    "Cairo",
    "Paris",
    "London",
    "Berlin",
    "Madrid",
    "Amsterdam",
    "Dublin",
    "Toronto",
    "New York",
    "San Francisco",
    "Los Angeles",
    "Chicago",
    "Austin",
    "Seattle",
    "Boston",
    "Singapore",
    "Dubai",
    "Bangkok",
    "Hong Kong",
    "Tokyo",
    "Sydney",
    "Melbourne",
  ];

  @Output() readonly filterChange = new EventEmitter<JobFilterCriteria>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["initialFilters"] && this.initialFilters) {
      this.selectedCategory = this.initialFilters.category || "";
      this.selectedDate = this.initialFilters.postedDate || "";
      this.selectedExperience = this.initialFilters.experienceLevel || "";
      this.selectedLocation = this.initialFilters.location || "";
      this.searchQuery = this.initialFilters.searchQuery || "";
    }
  }

  // Émettre les filtres à chaque changement
  emitChange() {
    this.filterChange.emit({
      category: this.selectedCategory || undefined,
      postedDate: this.selectedDate || undefined,
      experienceLevel: this.selectedExperience || undefined,
      location: this.selectedLocation || undefined,
      searchQuery: this.searchQuery || undefined,
    });
  }

  onSearchSubmit() {
    this.emitChange();
  }

  resetFilters() {
    this.selectedCategory = "";
    this.selectedDate = "";
    this.selectedExperience = "";
    this.selectedLocation = "";
    this.searchQuery = "";
    this.emitChange();
  }
}
