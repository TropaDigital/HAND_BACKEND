import {
  Address,
  BankAccount,
  EmploymentRelationship,
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

  public async updateBankAccountByAssociatedIdAndId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<unknown>> {
    const {
      id = 0,
      associatedId,
      ...payload
    } = this.validator.validateSchema<
      Prisma.EmploymentRelationshipUpdateInput & {
        id?: number;
        associatedId: number;
      }
    >('updateBankAccountByAssociatedIdAndId', {
      ...(httpRequest.params as { id: number; associatedId: number }),
      ...httpRequest.body,
    });

    const result = await this.associatedService.upsertBankAccountById(
      associatedId,
      id,
      payload,
    );

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getAll(
    httpRequest: IApiHttpRequest<
      unknown,
      unknown,
      unknown,
      IFindAllParams & Prisma.AssociatedWhereInput
    >,
  ): Promise<IApiHttpResponse<IPaginatedAResult<IAssociated[]> | string>> {
    const {
      contractNumber,
      telemedicine,
      publicAgency,
      csv,
      page,
      resultsPerPage,
      ...query
    } = this.validator.validateSchema<
      IFindAllParams &
        Prisma.AssociatedWhereInput & {
          contractNumber?: string;
          telemedicine?: boolean;
          csv?: boolean;
          publicAgency?: string;
        }
    >('GetAll', { ...httpRequest.query });
    const formatedQuery = {
      ...query,
      ...(!(typeof publicAgency === 'undefined')
        ? {
            employmentRelationships: {
              publicAgency,
            },
          }
        : {}),
      ...(!(typeof telemedicine === 'undefined') ||
      !(typeof contractNumber === 'undefined')
        ? {
            benefits: {
              joinedTelemedicine: telemedicine,
              code: contractNumber
                ? { contains: contractNumber }
                : contractNumber,
            },
          }
        : {}),
    };

    const result = await this.associatedService.getAll({
      ...formatedQuery,
      ...(!csv ? { page, resultsPerPage } : {}),
    } as IFindAllParams & Prisma.AssociatedWhereInput);
    if (csv) {
      const titles = [
        'codigo de inclusao',
        'nome',
        'cpf',
        'data de nascimento',
        'afilicao',
        'status',
        'telemedicina',
      ].join(';');
      const lines = result.data
        .map(line => {
          return [
            line.code,
            line.name,
            line.taxId,
            line.birthDate,
            line.affiliations.map(affiliation => affiliation.name).join('|'),
            line.status,
            (line.benefits || []).filter(benefit => benefit.joinedTelemedicine)
              .length
              ? 'S'
              : 'N',
          ].join(';');
        })
        .join('\n');

      return {
        statusCodeAsString: 'OK',
        body: '',
        attachmentFileName: 'test.csv',
        attachmentFileContent: `${titles}\n${lines}`,
        headers: {
          'content-type': 'text/csv',
        },
      };
    }

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
  ): Promise<IApiHttpResponse<Omit<IAssociated, 'benefits'>>> {
    const associated = this.validator.validateSchema<
      Omit<IAssociated, 'benefits'>
    >('CreateAssociated', {
      ...httpRequest.body,
      createdBy: httpRequest.user?.sub,
    });
    const result = await this.associatedService.create(associated);

    return { statusCodeAsString: 'CREATED', body: result };
  }

  public async updateById(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<void>> {
    const { id, ...associated } = this.validator.validateSchema<
      Partial<Omit<IAssociated, 'benefits'>> & { id: number }
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

  public async getEmploymentRelationshipsByAssociatedId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<EmploymentRelationship[]>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'getEmploymentRelationshipsByAssociatedId',
      httpRequest.params as { id: number },
    );
    const result =
      await this.associatedService.getEmploymentRelationshipsByAssociatedId(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getBankAccountsByAssociatedId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<BankAccount[]>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'getBankAccountsByAssociatedId',
      httpRequest.params as { id: number },
    );
    const result = await this.associatedService.getBankAccountByAssociatedId(
      id,
    );

    return { statusCodeAsString: 'OK', body: result };
  }

  public async getAddressesByAssociatedId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Address[]>> {
    const { id } = this.validator.validateSchema<{ id: number }>(
      'getAddressesByAssociatedId',
      httpRequest.params as { id: number },
    );
    const result = await this.associatedService.getAddressesByAssociatedId(id);

    return { statusCodeAsString: 'OK', body: result };
  }

  public async updateEmploymentRelationshipsByAssociatedIdAndId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<EmploymentRelationship>> {
    const {
      id = 0,
      associatedId,
      ...payload
    } = this.validator.validateSchema<
      Prisma.EmploymentRelationshipUpdateInput & {
        id?: number;
        associatedId: number;
      }
    >('updateEmploymentRelationshipsByAssociatedIdAndId', {
      ...(httpRequest.params as { id: number; associatedId: number }),
      ...httpRequest.body,
    });

    const result =
      await this.associatedService.upsertEmploymentRelationshipById(
        associatedId,
        id,
        payload,
      );

    return { statusCodeAsString: 'OK', body: result };
  }

  public async updateAddressByAssociatedIdAndId(
    httpRequest: IApiHttpRequest,
  ): Promise<IApiHttpResponse<Address>> {
    const {
      id = 0,
      associatedId,
      ...payload
    } = this.validator.validateSchema<
      Prisma.AddressUpdateInput & {
        id?: number;
        associatedId: number;
      }
    >('updateAddressByAssociatedIdAndId', {
      ...(httpRequest.params as { id: number; associatedId: number }),
      ...httpRequest.body,
    });

    const result = await this.associatedService.upsertAddressById(
      associatedId,
      id,
      payload,
    );

    return { statusCodeAsString: 'OK', body: result };
  }
}
