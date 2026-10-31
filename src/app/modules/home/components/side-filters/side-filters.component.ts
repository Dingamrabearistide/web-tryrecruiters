import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import {
  ContractType,
  JobType,
  EducationLevel,
  JobLevel,
  OrganizationType,
  CompanySize,
} from "@modules/job-offers/job-offers.types";
import { blockInvalidNumberKeys } from "../../../../@1hand/utils";

export interface SideFilterCriteria {
  contractType?: ContractType;
  jobType?: JobType;
  educationLevel?: EducationLevel;
  jobLevel?: JobLevel;
  organizationType?: OrganizationType;
  companySize?: CompanySize;
  minSalary?: number;
  maxSalary?: number;
  minExperience?: number;
  maxExperience?: number;
}

@Component({
  standalone: false,

  selector: "app-side-filters",
  templateUrl: "./side-filters.component.html",
  styleUrl: "./side-filters.component.scss",
})
export class SideFiltersComponent implements OnChanges {
  @Input() initialFilters: SideFilterCriteria = {};
  @Output() filtersChanged = new EventEmitter<SideFilterCriteria>();

  blockInvalidNumberKeys = blockInvalidNumberKeys;

  // État des filtres
  showAdvancedFilters = false;

  // Ajout pour accordion
  showContract = true;
  showJobType = true;
  showEducation = true;
  showJobLevel = true;
  showSalary = true;
  showExperience = true;
  showCompany = true;

  // Sélections - utilisation d'arrays pour les checkboxes
  selectedContractTypes: ContractType[] = [];
  selectedJobTypes: JobType[] = [];
  selectedEducationLevels: EducationLevel[] = [];
  selectedJobLevels: JobLevel[] = [];
  selectedEducationLevel: EducationLevel | "" = "";
  selectedJobLevel: JobLevel | "" = "";
  selectedOrganizationType: OrganizationType | "" = "";
  selectedCompanySize: CompanySize | "" = "";
  minSalary: number | null = null;
  maxSalary: number | null = null;
  minExperience: number | null = null;
  maxExperience: number | null = null;

  // Enums pour les options
  ContractType = ContractType;
  JobType = JobType;
  EducationLevel = EducationLevel;
  JobLevel = JobLevel;
  OrganizationType = OrganizationType;
  CompanySize = CompanySize;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["initialFilters"] && this.initialFilters) {
      // Pour l'instant, on garde la compatibilité avec l'interface existante
      this.selectedContractTypes = this.initialFilters.contractType
        ? [this.initialFilters.contractType]
        : [];
      this.selectedJobTypes = this.initialFilters.jobType
        ? [this.initialFilters.jobType]
        : [];
      this.selectedEducationLevels = this.initialFilters.educationLevel
        ? [this.initialFilters.educationLevel]
        : [];
      this.selectedJobLevels = this.initialFilters.jobLevel
        ? [this.initialFilters.jobLevel]
        : [];
      this.selectedEducationLevel = this.initialFilters.educationLevel || "";
      this.selectedJobLevel = this.initialFilters.jobLevel || "";
      this.selectedOrganizationType =
        this.initialFilters.organizationType || "";
      this.selectedCompanySize = this.initialFilters.companySize || "";
      this.minSalary = this.initialFilters.minSalary || null;
      this.maxSalary = this.initialFilters.maxSalary || null;
      this.minExperience = this.initialFilters.minExperience || null;
      this.maxExperience = this.initialFilters.maxExperience || null;
    }
  }

  // Méthodes pour gérer les checkboxes
  isContractTypeSelected(contractType: ContractType): boolean {
    return this.selectedContractTypes.includes(contractType);
  }

  toggleContractType(contractType: ContractType): void {
    const index = this.selectedContractTypes.indexOf(contractType);
    if (index > -1) {
      this.selectedContractTypes.splice(index, 1);
    } else {
      this.selectedContractTypes.push(contractType);
    }
    this.onFilterChange();
  }

  isJobTypeSelected(jobType: JobType): boolean {
    return this.selectedJobTypes.includes(jobType);
  }

  toggleJobType(jobType: JobType): void {
    const index = this.selectedJobTypes.indexOf(jobType);
    if (index > -1) {
      this.selectedJobTypes.splice(index, 1);
    } else {
      this.selectedJobTypes.push(jobType);
    }
    this.onFilterChange();
  }

  isJobLevelSelected(jobLevel: JobLevel): boolean {
    return this.selectedJobLevels.includes(jobLevel);
  }

  toggleJobLevel(jobLevel: JobLevel): void {
    const index = this.selectedJobLevels.indexOf(jobLevel);
    if (index > -1) {
      this.selectedJobLevels.splice(index, 1);
    } else {
      this.selectedJobLevels.push(jobLevel);
    }
    this.onFilterChange();
  }

  onFilterChange() {
    const filters: SideFilterCriteria = {};

    // Pour maintenir la compatibilité, on envoie le premier élément sélectionné
    if (this.selectedContractTypes.length > 0)
      filters.contractType = this.selectedContractTypes[0];
    if (this.selectedJobTypes.length > 0)
      filters.jobType = this.selectedJobTypes[0];
    if (this.selectedEducationLevels.length > 0)
      filters.educationLevel = this.selectedEducationLevels[0];
    if (this.selectedJobLevels.length > 0)
      filters.jobLevel = this.selectedJobLevels[0];
    if (this.selectedOrganizationType)
      filters.organizationType = this.selectedOrganizationType;
    if (this.selectedCompanySize)
      filters.companySize = this.selectedCompanySize;
    if (this.minSalary) filters.minSalary = this.minSalary;
    if (this.maxSalary) filters.maxSalary = this.maxSalary;
    if (this.minExperience) filters.minExperience = this.minExperience;
    if (this.maxExperience) filters.maxExperience = this.maxExperience;

    this.filtersChanged.emit(filters);
  }

  resetFilters() {
    this.selectedContractTypes = [];
    this.selectedJobTypes = [];
    this.selectedEducationLevels = [];
    this.selectedJobLevels = [];
    this.selectedEducationLevel = "";
    this.selectedJobLevel = "";
    this.selectedOrganizationType = "";
    this.selectedCompanySize = "";
    this.minSalary = null;
    this.maxSalary = null;
    this.minExperience = null;
    this.maxExperience = null;
    this.onFilterChange();
  }

  toggleAdvancedFilters() {
    this.showAdvancedFilters = !this.showAdvancedFilters;
  }
}
