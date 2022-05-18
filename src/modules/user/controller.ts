import { Prisma } from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import { IUserController, IUserService, ResponseUser } from './interfaces';
import * as schemas from './schemas';

export class UserController implements IUserController {
  constructor(
    private readonly userService: IUserService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async getAll(): Promise<IApiHttpResponse<ResponseUser[]>> {
    const result = await this.userService.getAll();

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getByUserName(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<ResponseUser | null>> {
    const { userName } = this.validator.validateSchema<{ userName: string }>(
      'GetUserByUserName',
      httpRequest.params as { userName: string },
    );
    const result = await this.userService.getByUserName(userName);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<ResponseUser>> {
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
