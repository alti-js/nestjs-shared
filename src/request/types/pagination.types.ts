export interface PaginationQuery {
  offset?: number;
  limit?: number;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
  lastUpdated?: T | null;
} 