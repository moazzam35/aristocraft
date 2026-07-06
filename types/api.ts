export type ApiResponse<T = unknown> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type PaginatedResponse<T> = {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  pageSize: number;
};
