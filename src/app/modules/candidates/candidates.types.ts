import { Resume } from "@modules/resumes/resumes.types";
import { BaseResponseInterface } from "../../@1hand/base.type";

// Enums
export enum SkillLevel {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
  EXPERT = "EXPERT",
}

export enum LanguageLevel {
  NATIVE = "NATIVE",
  PROFESSIONAL = "PROFESSIONAL",
  INTERMEDIATE = "INTERMEDIATE",
  BEGINNER = "BEGINNER",
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  REVIEWED = "REVIEWED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
}

// Interfaces

export interface CandidateDto {
  id: string;
  accountId: string;
  resumeUrl?: string;
  bio?: string;
  profession?: string;
  placeOfBirth?: string;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

export interface Candidate {
  id: string;
  accountId: string;
  resumeUrl?: string;
  bio?: string;
  profession?: string;
  placeOfBirth?: string;
  nationality?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  archived: boolean;
  notes?: string;

  // Direct fields from backend (when loaded via /candidates/:id)
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthDate?: Date | string;
  photo?: string;
  city?: string;
  region?: string;
  country?: string;
  role?: string;

  // Relations
  experiences?: CandidateExperience[];
  educations?: CandidateEducation[];
  skills?: CandidateSkill[];
  languages?: CandidateLanguage[];
  tools?: CandidateTool[];
  certifications?: CandidateCertification[];
  applications?: CandidateApplication[];
  resumes?: Resume[];
}

export interface CandidateExperience {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

export interface CandidateEducation {
  id: string;
  schoolName: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

export interface CandidateSkill {
  id: string;
  name: string;
  level?: SkillLevel;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

export interface CandidateLanguage {
  id: string;
  language: string;
  level: LanguageLevel;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

export interface CandidateTool {
  id: string;
  name: string;
  level?: SkillLevel;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

export interface CandidateCertification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

// export interface Resume {
//   id: string;
//   name: string;
//   url: string;
//   isDefault: boolean;
//   candidateId: string;
//   createdAt: string;
//   updatedAt: string;
//   deleted: boolean;
//   archived: boolean;
//   notes?: string;
// }

export interface CandidateApplication {
  id: string;
  message?: string;
  status: ApplicationStatus;
  submittedAt: string;
  jobOfferId: string;
  resumeId?: string;
  createdAt: string;
  updatedAt: string;
  deleted: boolean;
  archived: boolean;
  notes?: string;
}

/**
 * ================================
 * CANDIDATE PROFILE
 * ================================
 */
// export interface PersonalInfo {
//   title?: string;
//   email?: string;
//   phone?: string;
//   address?: string;
//   website?: string;
//   sexe?: string;
//   profile?: string;
//   name?: string;
//   lastName?: string;
// }

// export interface Experience {
//   id?: number;
//   title: string;
//   company: string;
//   period: string;
//   location: string;
//   description: string;
// }

// export interface Education {
//   id?: number;
//   degree: string;
//   school: string;
//   period: string;
//   location: string;
// }

// export interface Skill {
//   id?: number;
//   name: string;
//   level: string;
// }

// export interface Language {
//   id?: number;
//   name: string;
//   level: string;
// }

// export interface Certification {
//   id?: number;
//   name: string;
//   issuer: string;
//   date: string;
// }

// export interface Profile {
//   id: string;
//   personalInfo: PersonalInfo;
//   experiences: Experience[];
//   education: Education[];
//   skills: Skill[];
//   languages: Language[];
//   certifications: Certification[];
//   metadata?: any;
// }

export const ModuleRoot = "candidates";

export interface UpdateCandidateDto extends Candidate {}
export type DeleteCandidateDto = string;
export type DeleteCandidateInfosDto = {
  id: string;
  data: [{ id: string }];
};

export interface CandidateResponse extends BaseResponseInterface<Candidate> {}
export type CompaniesResponseType = BaseResponseInterface<Candidate>;
