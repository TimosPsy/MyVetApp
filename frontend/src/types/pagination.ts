
export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}