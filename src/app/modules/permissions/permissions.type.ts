import {
  BaseCreate,
  BaseUpdate,
  BaseDelete,
  BaseResponseInterface,
  BaseModel,
} from "../../@1hand/base.type";

export enum PermissionAction {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  MANAGE = "MANAGE",
}

export enum ResourceType {
  USERS = "USERS",
  CANDIDATES = "CANDIDATES",
  RECRUITERS = "RECRUITERS",
  COMPANIES = "COMPANIES",
  JOB_OFFERS = "JOB_OFFERS",
  APPLICATIONS = "APPLICATIONS",
  INTERVIEWS = "INTERVIEWS",
  JOB_CATEGORIES = "JOB_CATEGORIES",
  PLATFORM_SETTINGS = "PLATFORM_SETTINGS",
  REPORTS = "REPORTS",
  LOGS = "LOGS",
  FILES = "FILES",
}

export interface Permission extends BaseModel {
  id: string;
  name: string;
  description?: string;
  action: PermissionAction;
  resource: ResourceType;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  archived?: boolean;
  notes?: string;
}

export interface CreatePermissionDto {
  name: string;
  description?: string;
  resource: ResourceType;
  action: PermissionAction;
}

export interface UpdatePermissionDto {
  name?: string;
  description?: string;
  resource?: ResourceType;
  action?: PermissionAction;
  archived?: boolean;
  notes?: string;
}

export interface DeletePermissionDto {
  id: string;
}

export interface FilterPermissionsDto {
  page?: number;
  limit?: number;
  search?: string;
  resource?: ResourceType;
  action?: PermissionAction;
  deleted?: boolean;
  archived?: boolean;
}

export interface PermissionFormData {
  name: string;
  description?: string;
  resource: ResourceType;
  action: PermissionAction;
  archived?: boolean;
  notes?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PermissionResponse extends BaseResponseInterface<Permission> {}

export const ModuleRoot = "permissions";
