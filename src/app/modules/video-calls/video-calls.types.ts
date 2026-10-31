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
}

// export interface Interview {
//   id: string;
//   applicationId: string;
//   recruiterId: string;
//   candidateId: string;
//   scheduledAt: string;
//   durationMin: number;
//   type: InterviewType;
//   meetUrl: string;
//   timezone?: string;
//   status: InterviewStatus;
//   notes?: string;
//   videoRoom?: VideoRoom;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface CreateInterviewDto {
//   applicationId: string;
//   recruiterId: string;
//   candidateId: string;
//   scheduledAt: string;
//   durationMin: number;
//   type: InterviewType;
//   meetUrl: string;
//   timezone?: string;
//   notes?: string;
// }

// export interface UpdateInterviewDto {
//   interviewId: string;
//   scheduledAt?: string;
//   durationMin?: number;
//   type?: InterviewType;
//   meetUrl?: string;
//   status?: InterviewStatus;
//   notes?: string;
//   timezone?: string;
// }

export interface DailyCallOptions {
  roomUrl: string;
  token?: string;
  userName?: string;
  startVideoOff?: boolean;
  startAudioOff?: boolean;
}

export interface DailyMeetingToken {
  token: string;
}

export interface JoinInterviewResponse {
  roomUrl: string;
  token: string;
  expiresAt: string;
}
