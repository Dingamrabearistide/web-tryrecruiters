import { User } from "@modules/auth/auth.types";
import {
  BaseCreate,
  BaseUpdate,
  BaseDelete,
  BaseResponseInterface,
  BaseModel,
  BaseParamsQuery,
} from "../../@1hand/base.type";
import { JobOffer } from "@modules/job-offers/job-offers.types";
import { Candidate } from "@modules/candidates/candidates.types";
import { MediaFile } from "../../@1hand/components/generic-file-manager/generic-file-manager-upload.service";

export enum ApplicationStatusEnum {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface Application extends BaseModel {
  id: string;
  publicId: string;
  jobOfferId: string;
  accountId: string;
  recruiterId?: string;
  resumeId?: string;
  message?: string;
  status: ApplicationStatusEnum;
  submittedAt?: string;

  // Relations
  jobOffer: JobOffer;
  candidate: Candidate;
  //  {
  //   id: string;
  //   createdAt: string;
  //   updatedAt: string;
  //   accountId: string;
  //   resumeUrl?: string;
  //   bio?: string;
  //   profession?: string;
  //   placeOfBirth?: string | null;
  //   nationality?: string | null;
  //   photoFileId?: string | null;
  //   deleted: boolean;
  //   archived: boolean;
  //   notes?: string | null;

  //   account: User;
  // };
  resume?: {
    id: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    isDefault: boolean;
    accountId?: string;
    candidateId?: string;
    resumeFileId?: string;
    deleted: boolean;
    archived: boolean;
    notes?: string | null;
    resumeFile?: {
      id: string;
      originalName: string;
      filename: string;
      mimetype: string;
      size: number;
      path: string;
      url: string;
    };
  };
}

export interface CreateApplicationDto {
  jobOfferId: string;
  accountId?: string;
  candidateId?: string;
  resumeId?: string;
  message?: string;
  guestData?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    resumeFileId: string;
  };
}

export interface UpdateApplicationDto extends BaseUpdate {
  status?: ApplicationStatusEnum;
  resumeId?: string;
  message?: string;
}

export interface DeleteApplicationDto extends BaseDelete {}

export interface FilterApplicationsDto extends BaseParamsQuery {
  page?: number;
  limit?: number;
  jobOfferId?: string;
  candidateId?: string;
  recruiterId?: string;
  resumeId?: string;
  status?: ApplicationStatusEnum;
  submittedAfter?: string;
  submittedBefore?: string;
}

export interface ApplicationFormData {
  jobOfferId: string;
  candidateId: string;
  resume: MediaFile;
  message?: string;
}

export const ModuleRoot = "applications";

export interface PaginatedResponse<T> {
  total: number;
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ApplicationResponse extends BaseResponseInterface<Application> {}
export type ApplicationResponseType = BaseResponseInterface<Application>;
