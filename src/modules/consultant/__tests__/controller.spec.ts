import { ConsultantController } from '../controller';
import {
  makeConsultantServiceStub,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeFakeConsultant,
  makeFakeConsultantList,
  makeFakeCreateConsultantInput,
  makeFakeUpdateConsultantInput,
  makeValidatorStub,
} from './helpers/test-helper';

const makeSut = () => {
  const consultantServiceStub = makeConsultantServiceStub();
  const validatorStub = makeValidatorStub();
  const sut = new ConsultantController(consultantServiceStub, validatorStub);

  return { sut, consultantServiceStub, validatorStub };
};

describe(ConsultantController.name, () => {
  describe(`When ${ConsultantController.prototype.getAll.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const getAllSpy = consultantServiceStub.getAll;

      await sut.getAll();

      expect(getAllSpy).toBeCalledWith();
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeConsultantList()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      consultantServiceStub.getAll.mockRejectedValueOnce(
        new Error('any_get_all_consultants_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_consultants_error'),
      );
    });
  });

  describe(`When ${ConsultantController.prototype.getById.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('GetConsultantById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const getByIdSpy = consultantServiceStub.getById;

      await sut.getById(httpRequest);

      expect(getByIdSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getById(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeConsultant()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      consultantServiceStub.getById.mockRejectedValueOnce(
        new Error('any_get_consultants_by_id_error'),
      );

      const promise = sut.getById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_consultants_by_id_error'),
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

  describe(`When ${ConsultantController.prototype.create.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateConsultantInput(),
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.create(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'CreateConsultant',
        makeFakeCreateConsultantInput(),
      );
    });

    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateConsultantInput(),
      });
      const createSpy = consultantServiceStub.create;
      validatorStub.validateSchema.mockReturnValueOnce(
        makeFakeCreateConsultantInput(),
      );

      await sut.create(httpRequest);

      expect(createSpy).toBeCalledWith(makeFakeCreateConsultantInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.create(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('CREATED', makeFakeConsultant()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      consultantServiceStub.create.mockRejectedValueOnce(
        new Error('any_create_consultant_error'),
      );

      const promise = sut.create(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_create_consultant_error'),
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

  describe(`When ${ConsultantController.prototype.updateById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      body: makeFakeCreateConsultantInput(),
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.updateById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('UpdateConsultantById', {
        id: 777,
        ...makeFakeUpdateConsultantInput(),
      });
    });

    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub, validatorStub } = makeSut();
      const updateByIdSpy = consultantServiceStub.updateById;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
        ...makeFakeUpdateConsultantInput(),
      });

      await sut.updateById(httpRequest);

      expect(updateByIdSpy).toBeCalledWith(
        777,
        makeFakeCreateConsultantInput(),
      );
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.updateById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      consultantServiceStub.updateById.mockRejectedValueOnce(
        new Error('any_update_consultant_error'),
      );

      const promise = sut.updateById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_update_consultant_error'),
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

  describe(`When ${ConsultantController.prototype.deleteById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.deleteById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('DeleteConsultantById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub, validatorStub } = makeSut();
      const deleteByIdSpy = consultantServiceStub.deleteById;
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
      const { sut, consultantServiceStub } = makeSut();
      consultantServiceStub.deleteById.mockRejectedValueOnce(
        new Error('any_delete_consultant_error'),
      );

      const promise = sut.deleteById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_delete_consultant_error'),
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
