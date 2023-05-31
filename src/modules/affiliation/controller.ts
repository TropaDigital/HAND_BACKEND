import { Address, Affiliation } from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import {
  IAffiliation,
  IAffiliationController,
  IAffiliationService,
} from './interfaces';
import * as schemas from './schemas';

export class AffiliationController implements IAffiliationController {
  constructor(
    private readonly affiliationService: IAffiliationService,
    private readonly validator: IValidator<typeof schemas>,
  ) {}

  public async getAll(): Promise<IApiHttpResponse<Affiliation[]>> {
    const result = await this.affiliationService.getAll();

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Affiliation | null>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'GetAffiliationById',
      httpRequest.params as { id: number },
    );
    const result = await this.affiliationService.getById(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async create(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Affiliation>> {
    const { address, ...affiliation } = this.validator.validateSchema<
      Affiliation & { address: Address }
    >('CreateAffiliation', httpRequest.body);
    const result = await this.affiliationService.create({
      address,
      ...affiliation,
    });

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...affiliation } = this.validator.validateSchema<IAffiliation>(
      'UpdateAffiliationById',
      {
        ...httpRequest.body,
        ...httpRequest.params,
      },
    );
    const result = await this.affiliationService.updateById(id, affiliation);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }

  public async deleteById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'DeleteAffiliationById',
      httpRequest.params as { id: number },
    );
    const result = await this.affiliationService.deleteById(id);

    return { statusCodeAsString: 'NO_CONTENT', body: result };
  }
}
