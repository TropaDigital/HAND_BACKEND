import { Prisma } from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  IAssociated,
  IAssociatedController,
  IAssociatedService,
} from './interfaces';
import * as schemas from './schemas';

export class AssociatedController implements IAssociatedController {
  constructor(
    private readonly associatedService: IAssociatedService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async getAll(
    httpRequest: IApiHttpRequest<
      unknown,
      unknown,
      unknown,
      IFindAllParams & Prisma.AssociatedWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAResult<IAssociated[]>>> {
    const result = await this.associatedService.getAll(httpRequest.query);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<IAssociated | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetAssociatedById',
      httpRequest.params as { id: number },
    );
    const result = await this.associatedService.getById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<IAssociated>> {
    const associated = this.validator.validateSchema<IAssociated>(
      'CreateAssociated',
      { ...httpRequest.body, createdBy: httpRequest.user?.sub },
    );
    const result = await this.associatedService.create(associated);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...associated } = this.validator.validateSchema<
      Partial<IAssociated> & { id: number }
    >('UpdateAssociatedById', {
      ...httpRequest.body,
      ...httpRequest.params,
    });
    const result = await this.associatedService.updateById(id, associated);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }

  public async deleteById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteAssociatedById',
      httpRequest.params as { id: number },
    );
    const result = await this.associatedService.deleteById(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}
