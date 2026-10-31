//bases enumerations

export enum Role {
  CANDIDATE = "candidate",
  RECRUITER = "recruiter",
  ADMIN = "admin",
}

// bases interfaces
export interface BaseModel {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BaseCreate {
  id: string;
  createdAt?: Date;
}
export interface BaseUpdate {
  id: string;
  updatedAt?: Date;
}
export interface BaseDelete {
  id: string;
  deletedAt?: Date;
}

export interface BaseResponseInterface<T> {
  page: number;
  limit: number;
  total: number;
  data: T[];
}

export interface BaseParamsQuery {
  page?: number;
  limit?: number;

  [key: string]: any;
}
