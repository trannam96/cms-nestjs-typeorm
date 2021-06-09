export interface IPaginateRes<T> {
  pageIndex: number;
  pageTotal: number;
  totalItems: number;
  data: T;
}

export interface IPaginateQuery {
  limit?: number;
  pageSize?: number;
  pageIndex?: number;
}
