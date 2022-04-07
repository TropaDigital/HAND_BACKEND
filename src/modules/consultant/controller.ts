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
  ) {}

  public async getAllConsultants(): Promise<IApiHttpResponse<Consultant[]>> {
    const result = await this.consultantService.getAllConsultants();

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getConsultantById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Consultant | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetConsultantById',
      httpRequest.params as { id: number },
    );
    const result = await this.consultantService.getConsultantById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async createConsultant(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Consultant>> {
    const consultant =
      this.validator.validateSchema<Prisma.ConsultantCreateInput>(
        'CreateConsultant',
        httpRequest.body,
      );
    const result = await this.consultantService.createConsultant(consultant);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateConsultant(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...consultant } = this.validator.validateSchema<
      Prisma.ConsultantUpdateInput & { id: number }
    >('UpdateGetConsultant', {
      ...httpRequest.body,
      ...httpRequest.params,
    });
    const result = await this.consultantService.updateConsultant(
      id,
      consultant,
    );

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }

  public async deleteConsultant(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteConsultantById',
      httpRequest.params as { id: number },
    );
    const result = await this.consultantService.deleteConsultant(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}
