export const moduleName = "users";

export enum UserStatut {
  ACTIVE = "active",
  INACTIVE = "INACTIVE",
  PENDING = "PENDING",
  SUSPENDED = "SUSPENDED",
  LOCKED = "LOCKED",
  DELETED = "DELETED",
  ARCHIVED = "ARCHIVED",
}

export enum UserRole {
  RECRUITER = "RECRUITER",
  CANDIDATE = "CANDIDATE",
  ADMIN = "ADMIN",
  COADMIN = "COADMIN",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export interface Geo {
  lat: string;
  lng: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
}

export interface Company {
  name: string;
  catchPhrase: string;
  bs: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  prename?: string;
  status?: UserStatut;
  createdAt?: string;
  updatedAt?: string;
  password?: string;
  role?: UserRole;
  emailConfirmed?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: Gender | null;
  birthDate?: string | null;
  photo?: string | null;
  city?: string | null;
  region?: string | null;
  lastLogin?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpiresAt?: string | null;
  emailConfirmationToken?: string | null;
  emailConfirmationTokenExpireAt?: string | null;
  loginValidationCode?: string | null;
  loginValidationCodeExpireAt?: string | null;
  twoFactorEnabled?: boolean;
  enablePayment?: boolean;
  failedLoginAttempts?: number;
  lockedUntil?: string | null;
  resumeUrl?: string | null;
  bio?: string | null;
  profession?: string | null;
  placeOfBirth?: string | null;
  nationality?: string | null;
  photoFileId?: string | null;
  adminLevel?: string | null;
  adminPosition?: string | null;
  deleted?: boolean;
  archived?: boolean;
  notes?: string | null;
}

export interface ModuleObject extends User {
  length: any;
}

export interface ModuleResponse {
  data: ModuleObject[];
  total: number;
  page: number;
  limit: number;
}

export interface ModuleCreateDto extends Omit<User, "id"> {
  // Champs obligatoires pour la création
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
  password?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: Gender;
  birthDate?: string;
  photo?: string;
  city?: string;
  region?: string;
  notes?: string;
  prename?: string;
  status?: UserStatut;
}

export interface ModuleUpdateDto extends Partial<Omit<User, "id">> {
  name?: string;
  username?: string;
  email?: string;
  address?: Address;
  phone?: string;
  website?: string;
  company?: Company;
  prename?: string;
  status?: UserStatut;
  password?: string;
  role?: UserRole;
  emailConfirmed?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: Gender | null;
  birthDate?: string | null;
  photo?: string | null;
  city?: string | null;
  region?: string | null;
  twoFactorEnabled?: boolean;
  bio?: string | null;
  profession?: string | null;
  nationality?: string | null;
  placeOfBirth?: string | null;
  adminLevel?: string | null;
  adminPosition?: string | null;
  deleted?: boolean;
  archived?: boolean;
  notes?: string | null;
}

export interface paramDto {
  usersRole: UserRole;
  genrder: Gender;
  status: UserStatut;
}

export interface ModuleDeleteDto {
  id: number | string;
}

export interface UserFormData {
  name: string;
  username: string;
  email: string;
  phone: string;
  addressStreet: string;
  addressSuite?: string;
  addressCity: string;
  addressZipcode: string;
  companyName: string;
  companyCatchPhrase?: string;
  companyBs: string;
  website: string;
  password?: string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  gender?: Gender;
  birthDate?: string;
  photo?: string;
  city?: string;
  region?: string;
  notes?: string;
  prename?: string;
  status?: UserStatut;
}

export const ModuleRoot = "users";

export type UserPublic = Omit<
  User,
  | "password"
  | "resetPasswordToken"
  | "emailConfirmationToken"
  | "loginValidationCode"
>;

export type UserSafe = Omit<User, "password">;

export function formDataToCreateDto(formData: UserFormData): ModuleCreateDto {
  return {
    name: formData.name,
    username: formData.username,
    email: formData.email,
    phone: formData.phone,
    website: formData.website,
    address: {
      street: formData.addressStreet,
      suite: formData.addressSuite || "",
      city: formData.addressCity,
      zipcode: formData.addressZipcode,
      geo: { lat: "", lng: "" },
    },
    company: {
      name: formData.companyName,
      catchPhrase: formData.companyCatchPhrase || "",
      bs: formData.companyBs,
    },
    password: formData.password,
    role: formData.role,
    firstName: formData.firstName,
    lastName: formData.lastName,
    phoneNumber: formData.phoneNumber,
    gender: formData.gender,
    birthDate: formData.birthDate,
    photo: formData.photo,
    city: formData.city,
    region: formData.region,
    notes: formData.notes,
    prename: formData.prename,
    status: formData.status,
  };
}

export function formDataToUpdateDto(
  formData: Partial<UserFormData>,
): ModuleUpdateDto {
  const updateDto: ModuleUpdateDto = {};

  if (formData.name) updateDto.name = formData.name;
  if (formData.username) updateDto.username = formData.username;
  if (formData.email) updateDto.email = formData.email;
  if (formData.phone) updateDto.phone = formData.phone;
  if (formData.website) updateDto.website = formData.website;

  if (
    formData.addressStreet ||
    formData.addressCity ||
    formData.addressZipcode
  ) {
    updateDto.address = {
      street: formData.addressStreet || "",
      suite: formData.addressSuite || "",
      city: formData.addressCity || "",
      zipcode: formData.addressZipcode || "",
      geo: { lat: "", lng: "" },
    };
  }

  if (formData.companyName || formData.companyBs) {
    updateDto.company = {
      name: formData.companyName || "",
      catchPhrase: formData.companyCatchPhrase || "",
      bs: formData.companyBs || "",
    };
  }

  if (formData.password) updateDto.password = formData.password;
  if (formData.role) updateDto.role = formData.role;
  if (formData.firstName) updateDto.firstName = formData.firstName;
  if (formData.lastName) updateDto.lastName = formData.lastName;
  if (formData.phoneNumber) updateDto.phoneNumber = formData.phoneNumber;
  if (formData.gender !== undefined) updateDto.gender = formData.gender;
  if (formData.birthDate !== undefined)
    updateDto.birthDate = formData.birthDate;
  if (formData.photo !== undefined) updateDto.photo = formData.photo;
  if (formData.city !== undefined) updateDto.city = formData.city;
  if (formData.region !== undefined) updateDto.region = formData.region;
  if (formData.notes !== undefined) updateDto.notes = formData.notes;
  if (formData.prename) updateDto.prename = formData.prename;
  if (formData.status) updateDto.status = formData.status;

  return updateDto;
}
