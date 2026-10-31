import { BaseResponseInterface } from "../../@1hand/base.type";

export enum InterviewType {
  GOOGLE_MEET = "GOOGLE_MEET",
  DAILY_VIDEO_CALL = "DAILY_VIDEO_CALL",
  IN_PERSON = "IN_PERSON",
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  RESCHEDULED = "RESCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export enum CandidateInterviewResponse {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
}

// export enum InterviewStatus {
//   SCHEDULED = "SCHEDULED",
//   COMPLETED = "COMPLETED",
//   CANCELLED = "CANCELLED",
//   NO_SHOW = "NO_SHOW",
// }

export interface VideoRoom {
  id: string;
  interviewId: string;
  roomName: string;
  roomUrl: string;
  expiresAt: string;
  provider: string;
  maxParticipants: number;
  enableScreenshare: boolean;
  enableChat: boolean;
  enableRecording: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Interview {
  id?: string;
  applicationId: string;
  recruiterId: string;
  candidateId: string; // ✅ Utiliser candidateId
  scheduledAt: string;
  durationMin: number;
  type: InterviewType;
  meetUrl?: string | null; // null for IN_PERSON interviews
  location?: string; // required for IN_PERSON interviews
  timezone: string;
  notes?: string;
  status?: InterviewStatus;
  candidateResponse?: CandidateInterviewResponse;
  candidateResponseMessage?: string;
  createdAt?: string;
  updatedAt?: string;

  // Relations
  application?: any;
  recruiter?: any;
  candidate?: any;
  videoRoom?: VideoRoom;
}

export interface CreateInterviewDto {
  applicationId: string;
  recruiterId: string;
  candidateId: string; // ✅ Utiliser candidateId
  scheduledAt: string;
  durationMin: number;
  type: InterviewType;
  meetUrl?: string;
  location?: string;
  timezone: string;
  notes?: string;
}

export interface InterviewFormData {
  applicationId: string;
  recruiterId: string;
  candidateId: string; // ✅ Utiliser candidateId
  scheduledAt: string;
  durationMin: number;
  type: InterviewType;
  meetUrl?: string;
  location?: string;
  timezone: string;
  notes?: string;
}

export interface RespondToInterviewDto {
  interviewId: string;
  response: CandidateInterviewResponse.CONFIRMED | CandidateInterviewResponse.DECLINED;
  scheduledAt: string;
  location?: string;
  message?: string;
}

export interface UpdateInterviewDto {
  scheduledAt?: string;
  durationMin?: number;
  type?: InterviewType;
  meetUrl?: string;
  location?: string;
  timezone?: string;
  notes?: string;
  status?: InterviewStatus;
}

export interface InterviewResponse extends BaseResponseInterface<Interview> {}
export type InterviewResponseType = BaseResponseInterface<Interview>;
export type InterviewDeleteDto = string;

export const ModuleRoot = "interviews";
