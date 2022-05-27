import { AssociatedController } from '../controller';
import {
  makeAssociatedServiceStub,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeFakeAssociated,
  makeFakeAssociatedList,
  makeFakeCreateAssociatedInput,
  makeFakeUpdateAssociatedInput,
  makeValidatorStub,
} from './helpers/test-helper';

const makeSut = () => {
  const associatedServiceStub = makeAssociatedServiceStub();
  const validatorStub = makeValidatorStub();
  const sut = new AssociatedController(associatedServiceStub, validatorStub);

  return { sut, associatedServiceStub, validatorStub };
};

describe(AssociatedController.name, () => {
  describe(`When ${AssociatedController.prototype.getAll.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const getAllSpy = associatedServiceStub.getAll;

      await sut.getAll();

      expect(getAllSpy).toBeCalledWith();
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeAssociatedList()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      associatedServiceStub.getAll.mockRejectedValueOnce(
        new Error('any_get_all_associateds_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_associateds_error'),
      );
    });
  });

  describe(`When ${AssociatedController.prototype.getById.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('GetAssociatedById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const getByIdSpy = associatedServiceStub.getById;

      await sut.getById(httpRequest);

      expect(getByIdSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getById(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeAssociated({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      associatedServiceStub.getById.mockRejectedValueOnce(
        new Error('any_get_associateds_by_id_error'),
      );

      const promise = sut.getById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_associateds_by_id_error'),
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

  describe(`When ${AssociatedController.prototype.create.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateAssociatedInput(),
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.create(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'CreateAssociated',
        makeFakeCreateAssociatedInput(),
      );
    });

    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateAssociatedInput(),
      });
      const createSpy = associatedServiceStub.create;
      validatorStub.validateSchema.mockReturnValueOnce(
        makeFakeCreateAssociatedInput(),
      );

      await sut.create(httpRequest);

      expect(createSpy).toBeCalledWith(makeFakeCreateAssociatedInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.create(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('CREATED', makeFakeAssociated({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      associatedServiceStub.create.mockRejectedValueOnce(
        new Error('any_create_associated_error'),
      );

      const promise = sut.create(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_create_associated_error'),
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

  describe(`When ${AssociatedController.prototype.updateById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      body: makeFakeCreateAssociatedInput(),
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.updateById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('UpdateAssociatedById', {
        id: 777,
        ...makeFakeUpdateAssociatedInput(),
      });
    });

    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub, validatorStub } = makeSut();
      const updateByIdSpy = associatedServiceStub.updateById;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
        ...makeFakeUpdateAssociatedInput(),
      });

      await sut.updateById(httpRequest);

      expect(updateByIdSpy).toBeCalledWith(
        777,
        makeFakeCreateAssociatedInput(),
      );
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.updateById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      associatedServiceStub.updateById.mockRejectedValueOnce(
        new Error('any_update_associated_error'),
      );

      const promise = sut.updateById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_update_associated_error'),
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

  describe(`When ${AssociatedController.prototype.deleteById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.deleteById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('DeleteAssociatedById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub, validatorStub } = makeSut();
      const deleteByIdSpy = associatedServiceStub.deleteById;
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
      const { sut, associatedServiceStub } = makeSut();
      associatedServiceStub.deleteById.mockRejectedValueOnce(
        new Error('any_delete_associated_error'),
      );

      const promise = sut.deleteById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_delete_associated_error'),
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
