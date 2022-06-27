import { Benefit, Prisma } from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import {
  IAssociatedFindAllParams,
  IPaginatedAssociatedResult,
} from '../../shared/pagination/interfaces';
import { IBenefitRepository, IBenefitService } from './interfaces';

export class BenefitService implements IBenefitService {
  constructor(private readonly benefitRepository: IBenefitRepository) {}

  public async getAll(
    payload?: IAssociatedFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAssociatedResult<Benefit[]>> {
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

  public async create(payload: Prisma.BenefitCreateInput): Promise<Benefit> {
    const result = await this.benefitRepository.create(payload);

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
