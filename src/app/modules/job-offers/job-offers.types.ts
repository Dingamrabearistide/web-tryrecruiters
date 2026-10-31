import { Company } from "@modules/compagnies/companies.types";
import {
  BaseCreate,
  BaseUpdate,
  BaseDelete,
  BaseResponseInterface,
  BaseModel,
} from "../../@1hand/base.type";
import { Application } from "@modules/applications/applications.types";
import { MediaFile } from "../../@1hand/components/generic-file-manager/generic-file-manager-upload.service";

export enum JobStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  EXPIRED = "EXPIRED",
  DRAFT = "DRAFT",
}

export enum ContractType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  TEMPORARY = "TEMPORARY",
  FREELANCE = "FREELANCE",
  INTERNSHIP = "INTERNSHIP",
  CONTRACT = "CONTRACT",
}

export enum JobType {
  ONSITE = "ONSITE",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
}
export enum EducationLevel {
  HIGH_SCHOOL = "HIGH_SCHOOL",
  INTERMEDIATE = "INTERMEDIATE",
  GRADUATION = "GRADUATION",
  MASTER_DEGREE = "MASTER_DEGREE",
  BACHELOR_DEGREE = "BACHELOR_DEGREE",
}

export enum JobLevel {
  ENTRY_LEVEL = "ENTRY_LEVEL",
  MID_LEVEL = "MID_LEVEL",
  EXPERT_LEVEL = "EXPERT_LEVEL",
}

export enum OrganizationType {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
}

export enum CompanySize {
  ONE_TO_TEN = "ONE_TO_TEN",
  ELEVEN_TO_FIFTY = "ELEVEN_TO_FIFTY",
  FIFTYONE_TO_ONEHUNDRED = "FIFTYONE_TO_ONEHUNDRED",
  ONEHUNDRED_TO_THREEHUNDRED = "ONEHUNDRED_TO_THREEHUNDRED",
  THREEHUNDRED_TO_FIVEHUNDRED = "THREEHUNDRED_TO_FIVEHUNDRED",
  FIVEHUNDRED_TO_ONEK = "FIVEHUNDRED_TO_ONEK",
  OVER_ONEK = "OVER_ONEK",
}

export interface paramsDto {
  page?: number;
  limit?: number;
  keyword?: string;
  contractType?: string;
  location?: string;
  tags?: string[];
  minSalary?: number;
  startDate?: string;
  endDate?: string;
  maxSalary?: number;
  minExperience?: number;
  maxExperience?: number;
  jobType?: JobType;
  educationLevel?: string;
  jobLevel?: JobLevel;
  categoryId?: string;
  companyId?: string;
  recruiterId?: string;
  status?: JobStatus;
  // Nouveaux paramètres de filtrage
  category?: string;
  experienceLevel?: string;
  postedDate?: string;
  search?: string;
  [key: string]: any;
}

export interface Currency {
  code: string;
  label: string;
  countries: string[];
}

export interface JobOfferDto extends BaseCreate {
  title: string;
  description: string;
  requirements: string[];
  // salaryRangeMin: number;
  // salaryRangeMax: number;
  location: string;
  contractType: ContractType;
  jobType: JobType;
  jobLevel: JobLevel;
  startDate: string;
  endDate: string;
  tags?: string[];
  companyId?: string;
  recruiterId?: string;
  salary?: string;
  salaryCurrency?: string | null;
  expiresAt?: string;
}

export interface JobOffer extends BaseModel {
  id: string;
  title: string;
  description: string;
  location: string;
  contractType: ContractType; // e.g., "FULL_TIME"
  jobType?: JobType; // e.g., "REMOTE"
  salary?: number | string; // string si tu reçois du backend un salaire formaté
  salaryCurrency?: string | null;
  experienceYears?: number;
  educationLevel?: EducationLevel;
  jobLevel?: JobLevel;
  publishedAt?: string; // ISO string date
  expiresAt?: string; // ISO string date
  isPublished?: boolean;
  isExpired?: boolean;

  companyId: string;
  recruiterId: string;
  categoryId?: string;

  tags?: {
    tag: {
      name: string;
    };
  }[];
  favoritedBy: {
    accountId: string;
    jobOfferId: string;
  }[];

  // company?: {
  //   id: string;
  //   name: string;
  //   description?: string;
  //   logoUrl?: string;
  // };

  company: Company;
  applications: Application[];

  category?: {
    id: string;
    name: string;
  };

  isbookmarked?: boolean;
  verified?: boolean;

  deleted?: boolean;
  archived?: boolean;
  notes?: string;
  status?: JobStatus;
}

export interface JobOfferFormData {
  title: string;
  description: string;
  location: string;
  country?: string;
  region?: string;
  city?: string;
  contractType: ContractType;
  jobType?: JobType;
  salary?: number | string;
  salaryCurrency?: string | null;
  experienceYears?: number;
  educationLevel?: EducationLevel;
  jobLevel?: JobLevel;
  publishedAt?: string;
  expiresAt?: string;
  isPublished?: boolean;
  company: Company;

  /** Set by the "Save as draft" action — not a real form field, just a
   * flag the submitting component reads to build the right payload. */
  isDraft?: boolean;

  // categoryId?: string;

  // tags?: {
  //   tag: {
  //     name: string;
  //   };
  // }[];
}

export const ModuleRoot = "job-offers";
export interface UpdateJobOfferDto extends CreateJobOfferDto {}
export interface DeleteJobOfferDto extends BaseDelete {}
export interface CreateJobOfferDto {
  title: string;
  description: string;
  location: string;
  contractType: ContractType; // e.g., "FULL_TIME"
  jobType?: JobType; // e.g., "REMOTE"
  salary?: number | string; // string si tu reçois du backend un salaire formaté
  salaryCurrency?: string | null;
  experienceYears?: number;
  educationLevel?: EducationLevel;
  jobLevel?: JobLevel;
  publishedAt?: string; // ISO string date
  expiresAt?: string; // ISO string date
  isPublished?: boolean;

  companyId: string;
  recruiterId: string;
  categoryId?: string;

  /** Only meaningful on create: "DRAFT" saves without entering moderation
   * (no credit consumed, not published). Omit for the normal PENDING flow. */
  status?: JobStatus;

  tags?: {
    tag: {
      name: string;
    };
  }[];
}

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface JobOfferResponse extends BaseResponseInterface<JobOffer> {}
export type JobOfferResponseType = BaseResponseInterface<JobOffer>;
