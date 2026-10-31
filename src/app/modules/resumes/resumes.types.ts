import { BaseResponseInterface } from "../../@1hand/base.type";
import { MediaFile } from "../../@1hand/components/generic-file-manager/generic-file-manager-upload.service";

export interface Resume {
  id?: string;
  name: string;
  url: string;
  isDefault: boolean;
  accountId: string;
  createdAt?: string;
  updatedAt?: string;
  fileSize?: number;
  fileName?: string;
  resumeFile: MediaFile;
}

export interface CreateResumeDto {
  name: string;
  resumeFileId: string;
  isDefault?: boolean;
  accountId: string;
}

export interface UpdateResumeDto {
  name?: string;
  isDefault?: boolean;
}

export interface ResumeFormData {
  name: string;
  isDefault: boolean;
  resumeFile: MediaFile;
}

export interface ResumeResponse extends BaseResponseInterface<Resume> {}
export type ResumeResponseType = BaseResponseInterface<Resume>;
export type ResumeDeleteDto = string;

export const ModuleRoot = "resumes";
