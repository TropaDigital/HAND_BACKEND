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
    const { page, resultsPerPage, ...where } = payload;
    const take = Number(resultsPerPage);
    const skip = (page - 1) * resultsPerPage;

    return {
      take,
      skip,
      where: (where || {}) as T,
    };
  }
  return {
    where: (payload || {}) as T,
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
  const currentPage = Number(payload?.page) || 1;

  return { totalResults, totalPages, currentPage, data: results };
};
