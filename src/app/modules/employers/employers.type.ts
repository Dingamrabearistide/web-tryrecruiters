export interface Employer {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  companies: EmployerCompany[];
}

export interface EmployerCompany {
  companyId: string;
  companyName: string;
  roleInCompany?: string;
}

export interface FilterEmployersDto {
  keyword?: string;
  page?: number;
  limit?: number;
}
