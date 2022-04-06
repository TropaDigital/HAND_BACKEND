import { Consultant, Prisma } from '@prisma/client';

import JoiAdapter from '../../adapters/joi/JoiAdapter';
import { ApiHttpRequest, ApiHttpResponse } from '../../interfaces/http';
import { IConsultantController } from './interfaces';
import * as schemas from './schemas';
import { ConsultantService } from './service';

export class ConsultantController implements IConsultantController {
  constructor(
    private readonly consultantService: ConsultantService,
    private readonly validator: JoiAdapter<typeof schemas>,
  ) {}

  public async getAllConsultants(): Promise<ApiHttpResponse<Consultant[]>> {
    const result = await this.consultantService.getAllConsultants();

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getConsultantById(
    httpRequest: ApiHttpRequest,
  ): Promise<ApiHttpResponse<Consultant | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetConsultantById',
      httpRequest.params,
    );
    const result = await this.consultantService.getConsultantById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async createConsultant(
    httpRequest: ApiHttpRequest,
  ): Promise<ApiHttpResponse<Consultant>> {
    const consultant =
      this.validator.validateSchema<Prisma.ConsultantCreateInput>(
        'CreateConsultant',
        httpRequest.body,
      );
    const result = await this.consultantService.createConsultant(consultant);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateConsultant(
    httpRequest: ApiHttpRequest,
  ): Promise<ApiHttpResponse<void>> {
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
    httpRequest: ApiHttpRequest,
  ): Promise<ApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteConsultantById',
      httpRequest.params,
    );
    const result = await this.consultantService.deleteConsultant(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}
