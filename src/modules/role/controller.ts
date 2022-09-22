import { Role, Prisma } from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import { IRoleController, IRoleService } from './interfaces';
import * as schemas from './schemas';

export class RoleController implements IRoleController {
  constructor(
    private readonly roleService: IRoleService,
    private readonly validator: IValidator<typeof schemas>,
  ) { }

  public async getAll(): Promise<IApiHttpResponse<Role[]>> {
    const result = await this.roleService.getAll();

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Role | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetRoleById',
      httpRequest.params as { id: number },
    );
    const result = await this.roleService.getById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Role>> {
    const role = this.validator.validateSchema<Prisma.RoleCreateInput>(
      'CreateRole',
      httpRequest.body,
    );
    const result = await this.roleService.create(role);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...role } = this.validator.validateSchema<
      Prisma.RoleUpdateInput & { id: number }
    >('UpdateRoleById', {
      ...httpRequest.body,
      ...httpRequest.params,
      updatedBy: httpRequest.user?.sub,
    });
    const result = await this.roleService.updateById(id, role);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }

  public async deleteById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteRoleById',
      httpRequest.params as { id: number },
    );
    const result = await this.roleService.deleteById(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}
