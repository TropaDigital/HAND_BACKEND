/* eslint-disable @typescript-eslint/no-unused-vars */
import { AffiliationController } from '../controller';
import {
  makeAffiliationServiceStub,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeFakeAffiliation,
  makeFakeAffiliationList,
  makeFakeCreateAffiliationInput,
  makeFakeUpdateAffiliationInput,
  makeValidatorStub,
} from './helpers/test-helper';

const makeSut = () => {
  const affiliationServiceStub = makeAffiliationServiceStub();
  const validatorStub = makeValidatorStub();
  const sut = new AffiliationController(affiliationServiceStub, validatorStub);

  return { sut, affiliationServiceStub, validatorStub };
};

describe(AffiliationController.name, () => {
  describe(`When ${AffiliationController.prototype.getAll.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, affiliationServiceStub } = makeSut();
      const getAllSpy = affiliationServiceStub.getAll;

      await sut.getAll();

      expect(getAllSpy).toBeCalledWith();
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeAffiliationList()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, affiliationServiceStub } = makeSut();
      affiliationServiceStub.getAll.mockRejectedValueOnce(
        new Error('any_get_all_affiliations_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_affiliations_error'),
      );
    });
  });

  describe(`When ${AffiliationController.prototype.getById.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('GetAffiliationById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, affiliationServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const getByIdSpy = affiliationServiceStub.getById;

      await sut.getById(httpRequest);

      expect(getByIdSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getById(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeAffiliation({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, affiliationServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      affiliationServiceStub.getById.mockRejectedValueOnce(
        new Error('any_get_affiliations_by_id_error'),
      );

      const promise = sut.getById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_affiliations_by_id_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.getById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${AffiliationController.prototype.create.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateAffiliationInput(),
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.create(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'CreateAffiliation',
        makeFakeCreateAffiliationInput(),
      );
    });

    it('should call service with validation return', async () => {
      const { sut, affiliationServiceStub, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateAffiliationInput(),
      });
      const createSpy = affiliationServiceStub.create;
      validatorStub.validateSchema.mockReturnValueOnce(
        makeFakeCreateAffiliationInput(),
      );

      await sut.create(httpRequest);

      expect(createSpy).toBeCalledWith(makeFakeCreateAffiliationInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.create(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('CREATED', makeFakeAffiliation({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, affiliationServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      affiliationServiceStub.create.mockRejectedValueOnce(
        new Error('any_create_affiliation_error'),
      );

      const promise = sut.create(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_create_affiliation_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.create(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${AffiliationController.prototype.updateById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      body: makeFakeCreateAffiliationInput(),
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.updateById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('UpdateAffiliationById', {
        id: 777,
        ...makeFakeCreateAffiliationInput(),
      });
    });

    it('should call service with validation return', async () => {
      const { sut, affiliationServiceStub, validatorStub } = makeSut();
      const updateByIdSpy = affiliationServiceStub.updateById;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
        ...makeFakeUpdateAffiliationInput(),
      });

      await sut.updateById(httpRequest);

      const { id: _, ...affiliation } = makeFakeUpdateAffiliationInput();

      expect(updateByIdSpy).toBeCalledWith(777, affiliation);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.updateById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, affiliationServiceStub } = makeSut();
      affiliationServiceStub.updateById.mockRejectedValueOnce(
        new Error('any_update_affiliation_error'),
      );

      const promise = sut.updateById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_update_affiliation_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.updateById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${AffiliationController.prototype.deleteById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.deleteById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('DeleteAffiliationById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, affiliationServiceStub, validatorStub } = makeSut();
      const deleteByIdSpy = affiliationServiceStub.deleteById;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
      });

      await sut.deleteById(httpRequest);

      expect(deleteByIdSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.deleteById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, affiliationServiceStub } = makeSut();
      affiliationServiceStub.deleteById.mockRejectedValueOnce(
        new Error('any_delete_affiliation_error'),
      );

      const promise = sut.deleteById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_delete_affiliation_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.deleteById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });
});
