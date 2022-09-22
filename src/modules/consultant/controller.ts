import { Consultant, Prisma } from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import { IConsultantController, IConsultantService } from './interfaces';
import * as schemas from './schemas';

export class ConsultantController implements IConsultantController {
  constructor(
    private readonly consultantService: IConsultantService,
    private readonly validator: IValidator<typeof schemas>,
  ) { }

  public async getAll(): Promise<IApiHttpResponse<Consultant[]>> {
    const result = await this.consultantService.getAll();

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Consultant | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetConsultantById',
      httpRequest.params as { id: number },
    );
    const result = await this.consultantService.getById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Consultant>> {
    const consultant =
      this.validator.validateSchema<Prisma.ConsultantCreateInput>(
        'CreateConsultant',
        {
          ...httpRequest.body,
          createdBy: httpRequest.user?.sub,
        },
      );
    const result = await this.consultantService.create(consultant);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...consultant } = this.validator.validateSchema<
      Prisma.ConsultantUpdateInput & { id: number }
    >('UpdateConsultantById', {
      ...httpRequest.body,
      ...httpRequest.params,
      updatedBy: httpRequest.user?.sub,
    });
    await this.consultantService.updateById(id, consultant);

    return { statusCodeAsString: 'NO_CONTENT', body: undefined };
  }

  public async deleteById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteConsultantById',
      httpRequest.params as { id: number },
    );
    const result = await this.consultantService.deleteById(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}
