import { Benefit, Prisma } from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import {
  IAssociatedFindAllParams,
  IPaginatedAssociatedResult,
} from '../../shared/pagination/interfaces';
import { IBenefitController, IBenefitService } from './interfaces';
import * as schemas from './schemas';

export class BenefitController implements IBenefitController {
  constructor(
    private readonly benefitService: IBenefitService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async getAll(
    httpRequest: IApiHttpRequest<
      unknown,
      unknown,
      unknown,
      IAssociatedFindAllParams & Prisma.BenefitWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAssociatedResult<Benefit[]>>> {
    const result = await this.benefitService.getAll(httpRequest.query);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Benefit | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetBenefitById',
      httpRequest.params as { id: number },
    );
    const result = await this.benefitService.getById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Benefit>> {
    const benefit = this.validator.validateSchema<Prisma.BenefitCreateInput>(
      'CreateBenefit',
      { ...httpRequest.body, createdBy: httpRequest.user?.sub },
    );
    const result = await this.benefitService.create(benefit);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...benefit } = this.validator.validateSchema<
      Prisma.BenefitUpdateInput & { id: number }
    >('UpdateBenefitById', {
      ...httpRequest.body,
      ...httpRequest.params,
    });
    const result = await this.benefitService.updateById(id, benefit);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }

  public async deleteById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteBenefitById',
      httpRequest.params as { id: number },
    );
    const result = await this.benefitService.deleteById(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}