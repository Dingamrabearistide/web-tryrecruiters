export enum NotificationChannel {
  EMAIL = "email",
  WHATSAPP = "whatsapp",
  SMS = "sms",
}

export enum Role {
  CANDIDATE = "CANDIDATE",
  RECRUITER = "RECRUITER",
  PLATFORM_ADMIN = "PLATFORM_ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
}

export interface PhoneNumber {
  number: string;
  internationalNumber: string;
  nationalNumber: string;
  e164Number: string;
  countryCode: string;
  dialCode: string;
}

export interface RecruiterRegisterDto {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  country: string;
  region: string;
  city: string;
}

export interface CandidateRegisterDto {
  email: string;
  password: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ForgotPasswordDto {
  email: string;
  channel: NotificationChannel;
}

export interface ResetPasswordDto {
  email: string;
  resetPasswordToken: string;
  newPassword: string;
  channel: NotificationChannel;
}

export interface ConfirmEmailDto {
  token: string;
  email: string;
}

export interface ResendConfirmEmailDto {
  email: string;
  channel: NotificationChannel;
}

export interface SendLoginCodeDto {
  email?: string;
  phone?: string;
  channel: NotificationChannel;
}

export interface ValidateLoginDto {
  email: string;
  code: string;
}

export interface User {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  // username: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate: string;
  emailConfirmed: boolean;
  country?: string;
  city?: string;
  region?: string;
  phoneNumber?: string;
  photo?: string;
}

export interface UpdateProfileDto {
  accountId: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: Gender;
  birthDate: string;
  city: string;
  region: string;
  photoId?: string;
  photoUrl?: string;
  country?: string;
  profession?: string;
  bio?: string;
}

export interface LoginResponseDto {
  message: string;
  accessToken: string;
  currentUser: User;
  role: Role;
}
