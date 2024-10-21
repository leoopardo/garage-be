export interface listResponse<T> {
  data: T[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface commonQueryParams {
  page: number;
  limit: number;
  search: string;
}

export enum registerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}
