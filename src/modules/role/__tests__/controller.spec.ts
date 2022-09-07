import { RoleController } from '../controller';
import {
  makeRoleServiceStub,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeFakeRole,
  makeFakeRoleList,
  makeFakeCreateRoleInput,
  makeFakeUpdateRoleInput,
  makeValidatorStub,
} from './helpers/test-helper';

const makeSut = () => {
  const roleServiceStub = makeRoleServiceStub();
  const validatorStub = makeValidatorStub();
  const sut = new RoleController(roleServiceStub, validatorStub);

  return { sut, roleServiceStub, validatorStub };
};

describe(RoleController.name, () => {
  describe(`When ${RoleController.prototype.getAll.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, roleServiceStub } = makeSut();
      const getAllSpy = roleServiceStub.getAll;

      await sut.getAll();

      expect(getAllSpy).toBeCalledWith();
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(makeFakeApiHttpResponse('OK', makeFakeRoleList()));
    });

    it('should throw when service throws', async () => {
      const { sut, roleServiceStub } = makeSut();
      roleServiceStub.getAll.mockRejectedValueOnce(
        new Error('any_get_all_roles_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_roles_error'),
      );
    });
  });

  describe(`When ${RoleController.prototype.getById.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('GetRoleById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, roleServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      const getByIdSpy = roleServiceStub.getById;

      await sut.getById(httpRequest);

      expect(getByIdSpy).toBeCalledWith(777);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('OK', makeFakeRole({})));
    });

    it('should throw when service throws', async () => {
      const { sut, roleServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      roleServiceStub.getById.mockRejectedValueOnce(
        new Error('any_get_roles_by_id_error'),
      );

      const promise = sut.getById(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_roles_by_id_error'),
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

  describe(`When ${RoleController.prototype.create.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateRoleInput(),
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.create(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'CreateRole',
        makeFakeCreateRoleInput(),
      );
    });

    it('should call service with validation return', async () => {
      const { sut, roleServiceStub, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateRoleInput(),
      });
      const createSpy = roleServiceStub.create;
      validatorStub.validateSchema.mockReturnValueOnce(
        makeFakeCreateRoleInput(),
      );

      await sut.create(httpRequest);

      expect(createSpy).toBeCalledWith(makeFakeCreateRoleInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.create(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('CREATED', makeFakeRole({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, roleServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      roleServiceStub.create.mockRejectedValueOnce(
        new Error('any_create_role_error'),
      );

      const promise = sut.create(httpRequest);

      await expect(promise).rejects.toThrow(new Error('any_create_role_error'));
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

  describe(`When ${RoleController.prototype.updateById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      body: makeFakeCreateRoleInput(),
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.updateById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('UpdateRoleById', {
        id: 777,
        ...makeFakeCreateRoleInput(),
      });
    });

    it('should call service with validation return', async () => {
      const { sut, roleServiceStub, validatorStub } = makeSut();
      const updateByIdSpy = roleServiceStub.updateById;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
        ...makeFakeUpdateRoleInput(),
      });

      await sut.updateById(httpRequest);

      const { id: _, ...role } = makeFakeUpdateRoleInput();
      expect(updateByIdSpy).toBeCalledWith(777, role);
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.updateById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, roleServiceStub } = makeSut();
      roleServiceStub.updateById.mockRejectedValueOnce(
        new Error('any_update_role_error'),
      );

      const promise = sut.updateById(httpRequest);

      await expect(promise).rejects.toThrow(new Error('any_update_role_error'));
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

  describe(`When ${RoleController.prototype.deleteById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.deleteById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('DeleteRoleById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, roleServiceStub, validatorStub } = makeSut();
      const deleteByIdSpy = roleServiceStub.deleteById;
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
      const { sut, roleServiceStub } = makeSut();
      roleServiceStub.deleteById.mockRejectedValueOnce(
        new Error('any_delete_role_error'),
      );

      const promise = sut.deleteById(httpRequest);

      await expect(promise).rejects.toThrow(new Error('any_delete_role_error'));
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
