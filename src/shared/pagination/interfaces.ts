export interface IAssociatedFindAllParams {
  page?: number;
  resultsPerPage?: number;
}

export interface IPaginatedAssociatedResult<T> {
  totalResults: number;
  totalPages: number;
  currentPage: number;
  data: T;
}
