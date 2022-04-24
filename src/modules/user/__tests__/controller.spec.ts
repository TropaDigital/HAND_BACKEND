import { UserController } from '../controller';
import {
  makeUserServiceStub,
  makeFakeApiHttpRequest,
  makeFakeApiHttpResponse,
  makeFakeUser,
  makeFakeUserList,
  makeFakeCreateUserInput,
  makeFakeUpdateUserInput,
  makeValidatorStub,
} from './helpers/test-helper';

const makeSut = () => {
  const userServiceStub = makeUserServiceStub();
  const validatorStub = makeValidatorStub({ email: 'any_email' });
  const sut = new UserController(userServiceStub, validatorStub);

  return { sut, userServiceStub, validatorStub };
};

describe(UserController.name, () => {
  describe(`When ${UserController.prototype.getAll.name} is called`, () => {
    it('should call service with validation return', async () => {
      const { sut, userServiceStub } = makeSut();
      const getAllSpy = userServiceStub.getAll;

      await sut.getAll();

      expect(getAllSpy).toBeCalledWith();
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.getAll();

      expect(result).toEqual(makeFakeApiHttpResponse('OK', makeFakeUserList()));
    });

    it('should throw when service throws', async () => {
      const { sut, userServiceStub } = makeSut();
      userServiceStub.getAll.mockRejectedValueOnce(
        new Error('any_get_all_users_error'),
      );

      const promise = sut.getAll();

      await expect(promise).rejects.toThrow(
        new Error('any_get_all_users_error'),
      );
    });
  });

  describe(`When ${UserController.prototype.getByEmail.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        params: { email: 'any_email' },
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.getByEmail(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('GetUserByEmail', {
        email: 'any_email',
      });
    });

    it('should call service with validation return', async () => {
      const { sut, userServiceStub, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { email: 777 } });
      const getByEmailSpy = userServiceStub.getByEmail;

      await sut.getByEmail(httpRequest);

      expect(getByEmailSpy).toBeCalledWith('any_email');
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.getByEmail(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('OK', makeFakeUser({})));
    });

    it('should throw when service throws', async () => {
      const { sut, userServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      userServiceStub.getByEmail.mockRejectedValueOnce(
        new Error('any_get_users_by_id_error'),
      );

      const promise = sut.getByEmail(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_get_users_by_id_error'),
      );
    });

    it('should throw when validator throws', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      validatorStub.validateSchema.mockImplementationOnce(() => {
        throw new Error('any_validate_schema_error');
      });

      const promise = sut.getByEmail(httpRequest);

      await expect(promise).rejects.toThrow(
        new Error('any_validate_schema_error'),
      );
    });
  });

  describe(`When ${UserController.prototype.create.name} is called`, () => {
    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateUserInput(),
      });
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.create(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith(
        'CreateUser',
        makeFakeCreateUserInput(),
      );
    });

    it('should call service with validation return', async () => {
      const { sut, userServiceStub, validatorStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({
        body: makeFakeCreateUserInput(),
      });
      const createSpy = userServiceStub.create;
      validatorStub.validateSchema.mockReturnValueOnce(
        makeFakeCreateUserInput(),
      );

      await sut.create(httpRequest);

      expect(createSpy).toBeCalledWith(makeFakeCreateUserInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });

      const result = await sut.create(httpRequest);

      expect(result).toEqual(
        makeFakeApiHttpResponse('CREATED', makeFakeUser({})),
      );
    });

    it('should throw when service throws', async () => {
      const { sut, userServiceStub } = makeSut();
      const httpRequest = makeFakeApiHttpRequest({ params: { id: 777 } });
      userServiceStub.create.mockRejectedValueOnce(
        new Error('any_create_user_error'),
      );

      const promise = sut.create(httpRequest);

      await expect(promise).rejects.toThrow(new Error('any_create_user_error'));
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

  describe(`When ${UserController.prototype.updateById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      body: makeFakeCreateUserInput(),
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.updateById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('UpdateUserById', {
        id: 777,
        ...makeFakeUpdateUserInput(),
      });
    });

    it('should call service with validation return', async () => {
      const { sut, userServiceStub, validatorStub } = makeSut();
      const updateByIdSpy = userServiceStub.updateById;
      validatorStub.validateSchema.mockReturnValueOnce({
        id: 777,
        ...makeFakeUpdateUserInput(),
      });

      await sut.updateById(httpRequest);

      expect(updateByIdSpy).toBeCalledWith(777, makeFakeCreateUserInput());
    });

    it('should return service response', async () => {
      const { sut } = makeSut();

      const result = await sut.updateById(httpRequest);

      expect(result).toEqual(makeFakeApiHttpResponse('NO_CONTENT'));
    });

    it('should throw when service throws', async () => {
      const { sut, userServiceStub } = makeSut();
      userServiceStub.updateById.mockRejectedValueOnce(
        new Error('any_update_user_error'),
      );

      const promise = sut.updateById(httpRequest);

      await expect(promise).rejects.toThrow(new Error('any_update_user_error'));
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

  describe(`When ${UserController.prototype.deleteById.name} is called`, () => {
    const httpRequest = makeFakeApiHttpRequest({
      params: { id: 777 },
    });

    it('should call validator with right params', async () => {
      const { sut, validatorStub } = makeSut();
      const validateSchemaSpy = validatorStub.validateSchema;

      await sut.deleteById(httpRequest);

      expect(validateSchemaSpy).toBeCalledWith('DeleteUserById', {
        id: 777,
      });
    });

    it('should call service with validation return', async () => {
      const { sut, userServiceStub, validatorStub } = makeSut();
      const deleteByIdSpy = userServiceStub.deleteById;
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
      const { sut, userServiceStub } = makeSut();
      userServiceStub.deleteById.mockRejectedValueOnce(
        new Error('any_delete_user_error'),
      );

      const promise = sut.deleteById(httpRequest);

      await expect(promise).rejects.toThrow(new Error('any_delete_user_error'));
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
