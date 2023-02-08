import { AssociatedController } from '../controller';
import {
  makeAssociatedServiceStub,
  makeFakeAddress,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeFakeAssociated,
  makeFakeAssociatedList,
  makeFakeBankAccount,
  makeFakeCreateAssociatedInput,
  makeFakeEmploymentRelationship,
  makeFakeUpdateAssociatedInput,
  makeValidatorStub,
} from './helpers/test-helper';

jest.mock('../../../shared/code', () => ({
  generateInsertCode: jest.fn().mockReturnValue('2022217148'),
}));

const makeSut = () => {
  const associatedServiceStub = makeAssociatedServiceStub();
  const validatorStub = makeValidatorStub();
  const sut = new AssociatedController(associatedServiceStub, validatorStub);

  return { sut, associatedServiceStub, validatorStub };
};

describe(AssociatedController.name, () => {
  describe(`When ${AssociatedController.prototype.updateBankAccountByAssociatedIdAndId.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const upsertSpy = associatedServiceStub.upsertBankAccountById;
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      await sut.updateBankAccountByAssociatedIdAndId(fakeApiHttpRequest);

      expect(upsertSpy).toBeCalledWith(undefined, 777, {});
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      const result = await sut.updateBankAccountByAssociatedIdAndId(
        fakeApiHttpRequest,
      );

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeBankAccount()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });
      associatedServiceStub.upsertBankAccountById.mockRejectedValueOnce(
        new Error('any_get_all_associateds_error'),
      );

      const promise =
        sut.updateBankAccountByAssociatedIdAndId(fakeApiHttpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_associateds_error'),
      );
    });
  });

  describe(`When ${AssociatedController.prototype.updateEmploymentRelationshipsByAssociatedIdAndId.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const upsertSpy = associatedServiceStub.upsertEmploymentRelationshipById;
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      await sut.updateEmploymentRelationshipsByAssociatedIdAndId(
        fakeApiHttpRequest,
      );

      expect(upsertSpy).toBeCalledWith(undefined, 777, {});
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      const result = await sut.updateEmploymentRelationshipsByAssociatedIdAndId(
        fakeApiHttpRequest,
      );

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeEmploymentRelationship()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });
      associatedServiceStub.upsertEmploymentRelationshipById.mockRejectedValueOnce(
        new Error('any_get_all_associateds_error'),
      );

      const promise =
        sut.updateEmploymentRelationshipsByAssociatedIdAndId(
          fakeApiHttpRequest,
        );

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_associateds_error'),
      );
    });
  });

  describe(`When ${AssociatedController.prototype.updateAddressByAssociatedIdAndId.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const upsertSpy = associatedServiceStub.upsertAddressById;
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      await sut.updateAddressByAssociatedIdAndId(fakeApiHttpRequest);

      expect(upsertSpy).toBeCalledWith(undefined, 777, {});
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      const result = await sut.updateAddressByAssociatedIdAndId(
        fakeApiHttpRequest,
      );

      expect(result).toEqual(makeFakeApiHttpResponse('OK', makeFakeAddress()));
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });
      associatedServiceStub.upsertAddressById.mockRejectedValueOnce(
        new Error('any_get_all_associateds_error'),
      );

      const promise = sut.updateAddressByAssociatedIdAndId(fakeApiHttpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_associateds_error'),
      );
    });
  });

  describe(`When ${AssociatedController.prototype.getEmploymentRelationshipsByAssociatedId.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getEmploymentRelationshipsByAssociatedId(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'getEmploymentRelationshipsByAssociatedId',
        {
          id: 777,
        },
      );
    });

    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const spy =
        associatedServiceStub.getEmploymentRelationshipsByAssociatedId;

      await sut.getEmploymentRelationshipsByAssociatedId(httpRequest);

      expect(spy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getEmploymentRelationshipsByAssociatedId(
        httpRequest,
      );

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeEmploymentRelationship()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      associatedServiceStub.getEmploymentRelationshipsByAssociatedId.mockRejectedValueOnce(
        new Error('any_get_associateds_by_id_error'),
      );

      const promise = sut.getEmploymentRelationshipsByAssociatedId(httpRequest);

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

      const promise = sut.getEmploymentRelationshipsByAssociatedId(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${AssociatedController.prototype.getBankAccountsByAssociatedId.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getBankAccountsByAssociatedId(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'getBankAccountsByAssociatedId',
        {
          id: 777,
        },
      );
    });

    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const spy = associatedServiceStub.getBankAccountByAssociatedId;

      await sut.getBankAccountsByAssociatedId(httpRequest);

      expect(spy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getBankAccountsByAssociatedId(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', makeFakeBankAccount()),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      associatedServiceStub.getBankAccountByAssociatedId.mockRejectedValueOnce(
        new Error('any_get_associateds_by_id_error'),
      );

      const promise = sut.getBankAccountsByAssociatedId(httpRequest);

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

      const promise = sut.getEmploymentRelationshipsByAssociatedId(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${AssociatedController.prototype.getAddressesByAssociatedId.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getAddressesByAssociatedId(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('getAddressesByAssociatedId', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const spy = associatedServiceStub.getAddressesByAssociatedId;

      await sut.getAddressesByAssociatedId(httpRequest);

      expect(spy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getAddressesByAssociatedId(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('OK', makeFakeAddress()));
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      associatedServiceStub.getAddressesByAssociatedId.mockRejectedValueOnce(
        new Error('any_get_associateds_by_id_error'),
      );

      const promise = sut.getAddressesByAssociatedId(httpRequest);

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

      const promise = sut.getAddressesByAssociatedId(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${AssociatedController.prototype.getAll.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const getAllSpy = associatedServiceStub.getAll;
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      await sut.getAll(fakeApiHttpRequest);

      expect(getAllSpy).toBeCalledWith({
        id: 777,
        page: undefined,
        resultsPerPage: undefined,
      });
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });

      const result = await sut.getAll(fakeApiHttpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('OK', { data: makeFakeAssociatedList() }),
      );
    });

    it('should return service response when csv param is provided', async () => {
      const { sut, validatorStub } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({
        query: { id: '2', csv: 'true' },
      });
      validatorStub.validateSchema.mockReturnValueOnce({ id: 777, csv: true });

      const result = await sut.getAll(fakeApiHttpRequest);

      expect(result).toEqual({
        attachmentFileContent: expect.any(String),
        attachmentFileName: 'associateds.csv',
        body: '',
        headers: {
          'content-type': 'text/csv',
        },
        statusCodeAsString: 'OK',
      });
    });

    it('should throw when service throws', async () => {
      const { sut, associatedServiceStub } = makeSut();
      const fakeApiHttpRequest = makeFakeApiHttpRequest({ query: { id: '2' } });
      associatedServiceStub.getAll.mockRejectedValueOnce(
        new Error('any_get_all_associateds_error'),
      );

      const promise = sut.getAll(fakeApiHttpRequest);

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

      expect(validateSchemaSpy).toBeCalledWith('CreateAssociated', {
        ...makeFakeCreateAssociatedInput(),
        createdBy: undefined,
      });
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
