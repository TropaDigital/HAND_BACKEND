import { Benefit, Prisma } from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  IBenefitRepository,
  IBenefitService,
  ICreateBenefitParams,
} from './interfaces';

export class BenefitService implements IBenefitService {
  constructor(private readonly benefitRepository: IBenefitRepository) {}

  public async getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<Benefit[]>> {
    const result = await this.benefitRepository.findAll(payload);

    return result;
  }

  public async getById(id: number): Promise<Benefit | null> {
    const result = await this.benefitRepository.findById(id);
    if (!result) {
      throw new NotFoundError('benefit not found with provided id');
    }

    return result;
  }

  public async create(payload: ICreateBenefitParams): Promise<Benefit> {
    const { associatedId, consultantId, ...benefit } = payload;
    const result = await this.benefitRepository.create({
      ...benefit,
      associated: {
        connect: {
          id: associatedId,
        },
      },
      consultant: {
        connect: {
          id: consultantId,
        },
      },
    });

    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<Omit<Benefit, 'id'>>,
  ): Promise<void> {
    const benefitExists = await this.benefitRepository.findById(id);
    if (!benefitExists) {
      throw new NotFoundError('benefit not found with provided id');
    }
    const result = await this.benefitRepository.updateById(id, payload);

    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const benefitExists = await this.benefitRepository.findById(id);
    if (!benefitExists) {
      throw new NotFoundError('benefit not found with provided id');
    }
    const result = await this.benefitRepository.deleteById(id);

    return result;
  }
}
