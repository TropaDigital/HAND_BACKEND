import * as service from '../service';

interface IFakeType {
  any: string;
}
const makeSut = () => ({ sut: service });

describe('Pagination Tests', () => {
  describe('getFindManyParams', () => {
    it('Should return correct value when default is provided', () => {
      const { sut } = makeSut();

      const result = sut.getFindManyParams();

      expect(result).toEqual({ where: {} });
    });
    it('Should return correct value when pages params is provided', () => {
      const { sut } = makeSut();

      const result = sut.getFindManyParams({ page: 1, resultsPerPage: 10 });

      expect(result).toEqual({ skip: 0, take: 10, where: {} });
    });
  });

  describe('parsePaginatedResult', () => {
    it('Should return correct value when default is provided', () => {
      const { sut } = makeSut();

      const result = sut.parsePaginatedResult<IFakeType, IFakeType>(
        { any: 'any' },
        1,
        { any: 'any' },
      );

      expect(result).toEqual({
        currentPage: 1,
        data: { any: 'any' },
        totalPages: 1,
        totalResults: 1,
      });
    });

    it('Should return correct value when pages params is provided', () => {
      const { sut } = makeSut();

      const result = sut.parsePaginatedResult<IFakeType, IFakeType>(
        { any: 'any' },
        1,
        { any: 'any', page: 1, resultsPerPage: 10 },
      );

      expect(result).toEqual({
        currentPage: 1,
        data: { any: 'any' },
        totalPages: 1,
        totalResults: 1,
      });
    });
  });
});
