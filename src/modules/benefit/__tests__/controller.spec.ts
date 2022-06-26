import { BenefitController } from '../controller';
import {
  makeBenefitServiceStub,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeFakeBenefit,
  makeFakeBenefitList,
  makeFakeCreateBenefitInput,
  makeFakeUpdateBenefitInput,
  makeValidatorStub,
} from './helpers/test-helper';

const makeSut = () => {
  const benefitServiceStub = makeBenefitServiceStub();
  const validatorStub = makeValidatorStub();
  const sut = new BenefitController(benefitServiceStub, validatorStub);

  return { sut, benefitServiceStub, validatorStub };
};

describe(BenefitController.name, () => {
  describe(`When ${BenefitController.prototype.getAll.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, benefitServiceStub } = makeSut();
      const getAllSpy = benefitServiceStub.getAll;
      const fakeApiHttpRequest = makeFakeApiHttpRequest({});

      await sut.getAll(fakeApiHttpRequest);

      expect(getAllSpy).toBeCalledWith(undefined);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({});

      const result = await sut.getAll(fakeApiHttpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeBenefitList()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, benefitServiceStub } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({});
      benefitServiceStub.getAll.mockRejectedValueOnce(
        new Error('any_get_all_benefits_error'),
      );

      const promise = sut.getAll(fakeApiHttpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_benefits_error'),
      );
    });
  });

  describe(`When ${BenefitController.prototype.getById.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('GetBenefitById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, benefitServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const getByIdSpy = benefitServiceStub.getById;

      await sut.getById(httpRequest);

      expect(getByIdSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getById(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeBenefit({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, benefitServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      benefitServiceStub.getById.mockRejectedValueOnce(
        new Error('any_get_benefits_by_id_error'),
      );

      const promise = sut.getById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_benefits_by_id_error'),
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

  describe(`When ${BenefitController.prototype.create.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: { ...makeFakeCreateBenefitInput() },
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.create(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('CreateBenefit', {
        ...makeFakeCreateBenefitInput(),
        createdBy: undefined,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, benefitServiceStub, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: { ...makeFakeCreateBenefitInput() },
      });
      const createSpy = benefitServiceStub.create;
      validatorStub.validateSchema.mockReturnValueOnce(
        makeFakeCreateBenefitInput(),
      );

      await sut.create(httpRequest);

      expect(createSpy).toBeCalledWith(makeFakeCreateBenefitInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.create(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('CREATED', makeFakeBenefit({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, benefitServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      benefitServiceStub.create.mockRejectedValueOnce(
        new Error('any_create_benefit_error'),
      );

      const promise = sut.create(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_create_benefit_error'),
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

  describe(`When ${BenefitController.prototype.updateById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      body: makeFakeCreateBenefitInput(),
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.updateById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('UpdateBenefitById', {
        id: 777,
        ...makeFakeUpdateBenefitInput(),
      });
    });

    it('should call service with validation return', async () => {
      const { sut, benefitServiceStub, validatorStub } = makeSut();
      const updateByIdSpy = benefitServiceStub.updateById;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
        ...makeFakeUpdateBenefitInput(),
      });

      await sut.updateById(httpRequest);

      expect(updateByIdSpy).toBeCalledWith(777, makeFakeCreateBenefitInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.updateById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, benefitServiceStub } = makeSut();
      benefitServiceStub.updateById.mockRejectedValueOnce(
        new Error('any_update_benefit_error'),
      );

      const promise = sut.updateById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_update_benefit_error'),
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

  describe(`When ${BenefitController.prototype.deleteById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.deleteById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('DeleteBenefitById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, benefitServiceStub, validatorStub } = makeSut();
      const deleteByIdSpy = benefitServiceStub.deleteById;
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
      const { sut, benefitServiceStub } = makeSut();
      benefitServiceStub.deleteById.mockRejectedValueOnce(
        new Error('any_delete_benefit_error'),
      );

      const promise = sut.deleteById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_delete_benefit_error'),
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
