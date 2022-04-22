import { User, Prisma } from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import { IUserController, IUserService } from './interfaces';
import * as schemas from './schemas';

export class UserController implements IUserController {
  constructor(
    private readonly userService: IUserService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async getAll(): Promise<IApiHttpResponse<User[]>> {
    const result = await this.userService.getAll();

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getByEmail(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<User | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetUserByEmail',
      httpRequest.params as { email: string },
    );
    const result = await this.userService.getById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<User>> {
    const user = this.validator.validateSchema<Prisma.UserCreateInput>(
      'CreateUser',
      httpRequest.body,
    );
    const result = await this.userService.create(user);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...user } = this.validator.validateSchema<
      Prisma.UserUpdateInput & { id: number }
    >('UpdateUserById', {
      ...httpRequest.body,
      ...httpRequest.params,
    });
    const result = await this.userService.updateById(id, user);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }

  public async deleteById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteUserById',
      httpRequest.params as { id: number },
    );
    const result = await this.userService.deleteById(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}
