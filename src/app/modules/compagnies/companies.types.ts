import { JobStatus } from "@modules/job-offers/job-offers.types";
import {
  BaseCreate,
  BaseDelete,
  BaseModel,
  BaseResponseInterface,
} from "../../@1hand/base.type";
import { Employer, EmployerCompany } from "@modules/employers/employers.type";
import { MediaFile } from "../../@1hand/components/generic-file-manager/generic-file-manager-upload.service";
import { PhoneNumber } from "@modules/auth/auth.types";

export const ModuleRoot = "companies";

export interface CompanyDto {
  // logoUrl: string;
  // industry: string;
  // companySize: string;
  // startDate: string;
  // endDate: string;
  // contractType: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  // organizationType: string;
  city: string;
  region: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  accountId?: string;
  createdById: string;
  logoFileId?: string;

  // createdById?: string;
}

export interface CompanyFormData {
  id?: string;
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phoneNumber?: string | PhoneNumber | any;
  city: string;
  region: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  logoFile?: MediaFile;
  createdAt?: string;
  updatedAt?: string;
}

export interface Company extends BaseModel {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phoneNumber?: string | PhoneNumber | any;
  city: string;
  region: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  logoUrl?: string;
  logoFileId?: string;
  logoFile?: MediaFile;
  logoPublicId?: string;
  industry?: string | null;
  companySize?: string | null;
  foundedAt?: string | null;
  foundedYear?: string | null;
  organizationType?: string | null;
  legalStatus?: string | null;
  registrationNumber?: string | null;
  registrationDocumentUrl?: string | null;
  taxIdNumber?: string | null;
  status?: string;
  rating?: number | null;
  reviewsCount?: number | null;
  applicationCount?: number | null;
  jobOffers?: any[];
  notes?: string | null;
  onboardingCompleted?: boolean;
  archived?: boolean;
  deleted?: boolean;
  verified?: boolean;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
  countryCode?: string | null;
  currency?: string | null;
  createdById?: string;
  createdBy?: any;
  updatedAt?: string;
  startDate?: Date;
}

export interface UpdateCompanyDto extends CreateCompanyDto {}
export type DeleteCompanyDto = string;
export interface CreateCompanyDto {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phoneNumber?: string;
  city: string;
  region: string;
  country: string;
  addressLine1: string;
  addressLine2?: string;
  accountId?: string;
}

export interface CompanyResponse extends BaseResponseInterface<Company> {}
export type CompaniesResponseType = BaseResponseInterface<Company>;
