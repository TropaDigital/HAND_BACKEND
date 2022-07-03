export interface IFindAllParams {
  page?: number;
  resultsPerPage?: number;
}

export interface IPaginatedAResult<T> {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  data: T;
}
