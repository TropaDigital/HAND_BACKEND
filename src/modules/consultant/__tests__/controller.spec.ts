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

jest.useFakeTimers().setSystemTime(new Date('1912-06-23').getTime());

const makeSut = () => {
  const consultantServiceStub = makeConsultantServiceStub();
  const validatorStub = makeValidatorStub();
  const sut = new ConsultantController(consultantServiceStub, validatorStub);

  return { sut, consultantServiceStub, validatorStub };
};

describe(ConsultantController.name, () => {
  describe(`When ${ConsultantController.prototype.getAllConsultants.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const getAllConsultantsSpy = consultantServiceStub.getAllConsultants;

      await sut.getAllConsultants();

      expect(getAllConsultantsSpy).toBeCalledWith();
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.getAllConsultants();

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeConsultantList()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      consultantServiceStub.getAllConsultants.mockRejectedValueOnce(
        new Error('any_get_all_consultants_error'),
      );

      const promise = sut.getAllConsultants();

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_consultants_error'),
      );
    });
  });

  describe(`When ${ConsultantController.prototype.getConsultantById.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getConsultantById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('GetConsultantById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const getConsultantByIdSpy = consultantServiceStub.getConsultantById;

      await sut.getConsultantById(httpRequest);

      expect(getConsultantByIdSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getConsultantById(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeConsultant()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      consultantServiceStub.getConsultantById.mockRejectedValueOnce(
        new Error('any_get_consultants_by_id_error'),
      );

      const promise = sut.getConsultantById(httpRequest);

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

      const promise = sut.getConsultantById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${ConsultantController.prototype.createConsultant.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateConsultantInput(),
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.createConsultant(httpRequest);

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
      const createConsultantSpy = consultantServiceStub.createConsultant;
      validatorStub.validateSchema.mockReturnValueOnce(
        makeFakeCreateConsultantInput(),
      );

      await sut.createConsultant(httpRequest);

      expect(createConsultantSpy).toBeCalledWith(
        makeFakeCreateConsultantInput(),
      );
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.createConsultant(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('CREATED', makeFakeConsultant()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      consultantServiceStub.createConsultant.mockRejectedValueOnce(
        new Error('any_create_consultant_error'),
      );

      const promise = sut.createConsultant(httpRequest);

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

      const promise = sut.createConsultant(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${ConsultantController.prototype.updateConsultant.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      body: makeFakeCreateConsultantInput(),
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.updateConsultant(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('UpdateConsultant', {
        id: 777,
        ...makeFakeUpdateConsultantInput(),
      });
    });

    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub, validatorStub } = makeSut();
      const updateConsultantSpy = consultantServiceStub.updateConsultant;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
        ...makeFakeUpdateConsultantInput(),
      });

      await sut.updateConsultant(httpRequest);

      expect(updateConsultantSpy).toBeCalledWith(
        777,
        makeFakeCreateConsultantInput(),
      );
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.updateConsultant(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      consultantServiceStub.updateConsultant.mockRejectedValueOnce(
        new Error('any_update_consultant_error'),
      );

      const promise = sut.updateConsultant(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_update_consultant_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.updateConsultant(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${ConsultantController.prototype.deleteConsultant.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.deleteConsultant(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('DeleteConsultantById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, consultantServiceStub, validatorStub } = makeSut();
      const deleteConsultantSpy = consultantServiceStub.deleteConsultant;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
      });

      await sut.deleteConsultant(httpRequest);

      expect(deleteConsultantSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.deleteConsultant(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, consultantServiceStub } = makeSut();
      consultantServiceStub.deleteConsultant.mockRejectedValueOnce(
        new Error('any_delete_consultant_error'),
      );

      const promise = sut.deleteConsultant(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_delete_consultant_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.deleteConsultant(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });
});
