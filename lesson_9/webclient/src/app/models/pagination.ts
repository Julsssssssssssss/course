export interface IPagination<T> {
  readonly page: number;
  readonly page_size: number;
  readonly total: number;
  readonly items: readonly T[];
}

export interface IPaginationRequest {
  readonly page: number;
  readonly page_size: number;
}
