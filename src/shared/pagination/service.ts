import {
  IAssociatedFindAllParams,
  IPaginatedAssociatedResult,
} from './interfaces';

export const getFindManyParams = <T>(
  payload?: IAssociatedFindAllParams & T,
): {
  take?: number;
  skip?: number;
  where: T;
} => {
  if (payload?.page && payload?.resultsPerPage) {
    const take = payload.resultsPerPage;
    const skip = (payload.page - 1) * payload.resultsPerPage;
    return {
      take,
      skip,
      where: payload as T,
    };
  }
  return {
    where: payload as T,
  };
};

export const parsePaginatedResult = <T, K>(
  results: T,
  totalResults: number,
  payload?: IAssociatedFindAllParams & K,
): IPaginatedAssociatedResult<T> => {
  const totalPages =
    payload?.resultsPerPage && totalResults
      ? Math.ceil(totalResults / payload.resultsPerPage)
      : 1;
  const currentPage = payload?.page || 1;

  return { totalResults, totalPages, currentPage, data: results };
};
