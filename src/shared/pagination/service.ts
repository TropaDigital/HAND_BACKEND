/* eslint-disable @typescript-eslint/no-explicit-any */
import { IFindAllParams, IPaginatedAResult } from './interfaces';

export const parsePrismaFindManyContains = <T>(object: T): T => {
  const entries = Object.entries(object || {});

  const result = entries.reduce((acc: any, [key, value]) => {
    acc[key] =
      typeof value === 'object'
        ? (acc[key] = parsePrismaFindManyContains(value))
        : (acc[key] = { contains: value });

    return acc;
  }, {});

  return result as T;
};

export const getFindManyParams = <T>(
  payload?: IFindAllParams & T,
): {
  take?: number;
  skip?: number;
  where: T;
} => {
  if (payload?.page && payload?.resultsPerPage) {
    const { page, resultsPerPage, ...where } = payload;
    const take = Number(resultsPerPage);
    const skip = (page - 1) * resultsPerPage;

    const params = parsePrismaFindManyContains(where);

    return {
      take,
      skip,
      where: params as T,
    };
  }

  const params = parsePrismaFindManyContains(payload || {});
  return {
    where: params as T,
  };
};

export const parsePaginatedResult = <T, K>(
  results: T,
  totalResults: number,
  payload?: IFindAllParams & K,
): IPaginatedAResult<T> => {
  const totalPages =
    payload?.resultsPerPage && totalResults
      ? Math.ceil(totalResults / payload.resultsPerPage)
      : 1;
  const currentPage = Number(payload?.page) || 1;

  return { totalResults, totalPages, currentPage, data: results };
};
