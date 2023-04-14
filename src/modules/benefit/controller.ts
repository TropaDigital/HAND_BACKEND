/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Benefit,
  Installment,
  InstallmentStatus,
  Prisma,
} from '@prisma/client';

import { IApiHttpRequest } from '../../interfaces/http';
import { IApiHttpResponse } from '../../interfaces/http/IApiHttpResponse';
import { IValidator } from '../../interfaces/validation/IValidator';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  IBenefitController,
  IBenefitService,
  ICreateBenefitParams,
} from './interfaces';
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
      IFindAllParams & Prisma.BenefitWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAResult<Benefit[]>>> {
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
    const benefit = this.validator.validateSchema<ICreateBenefitParams>(
      'CreateBenefit',
      { ...httpRequest.body, createdBy: httpRequest.user?.sub },
    );

    const result = await this.benefitService.create(benefit);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async getPostponementSimulation(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse> {
    const { id, single } = this.validator.validateSchema<
      Prisma.BenefitUpdateInput & { id: number; single: boolean }
    >('GetPostponementSimulation', {
      ...httpRequest.params,
      ...httpRequest.query,
    });

    const installments = await this.benefitService.getPostponementSimulation(
      id,
      single,
    );
    return {
      statusCodeAsString: 'OK',
      body: installments,
    };
  }

  public async adjustContractById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, single } = this.validator.validateSchema<{
      id: number;
      single: boolean;
    }>('AdjustContractById', {
      ...httpRequest.params,
      ...httpRequest.query,
    });

    const result = single
      ? await this.benefitService.singlePostponementInstallment({
          id,
          reference: new Date(),
          user: String(httpRequest.user?.sub) || '',
        })
      : await this.benefitService.postponementInstallment({
          id,
          user: String(httpRequest.user?.sub) || '',
        });

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

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, code, confirmationFileUrl } = this.validator.validateSchema<{
      id: number;
      code: string;
      confirmationFileUrl: string;
    }>('UpdateBenefitById', { ...httpRequest.params, ...httpRequest.body });
    await this.benefitService.updateById(id, { code, confirmationFileUrl });

    return { statusCodeAsString: 'NO_CONTENT', body: undefined };
  }

  public async dimissInstallMentByBenefitIdAndInstallmentId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { benefitId, installmentId, user, ...payload } =
      this.validator.validateSchema<{
        benefitId: number;
        installmentId: number;
        user: string;
      }>('DimississInstallmentByBenefitIdAndInstallmentId', {
        ...httpRequest.params,
        ...httpRequest.body,
        user: httpRequest.user?.sub,
      });
    await this.benefitService.updateInstallmentByBenefitIdAndInstallmentId({
      benefitId,
      installmentId,
      user,
      payload,
    });

    return {
      statusCodeAsString: 'NO_CONTENT',
      body: undefined,
    };
  }

  public async getInstallmentBankInterfaceFile(
    _httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<unknown>> {
    return {
      statusCodeAsString: 'OK',
      body: '',
      attachmentFileName: 'test.txt',
      attachmentFileContent: 'arquivo de interface bancária.',
      headers: {
        'content-type': 'text/plain',
      },
    };
  }

  public async getInstallmentsByReferenceDates(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Installment[]>> {
    const { from, to, associated, status } = this.validator.validateSchema<{
      from: Date;
      to: Date;
      associated?: string;
      status?: InstallmentStatus;
    }>('GetInstallmentsByReferenceDates', {
      ...httpRequest.query,
    });
    const installments =
      await this.benefitService.getInstallmentsByReferenceDates({
        from,
        to,
        associated,
        status,
      });

    return {
      statusCodeAsString: 'OK',
      body: installments,
    };
  }
}
