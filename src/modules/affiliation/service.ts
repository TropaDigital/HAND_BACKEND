import { Affiliation, Prisma } from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import { IAffiliationRepository, IAffiliationService } from './interfaces';

export class AffiliationService implements IAffiliationService {
  constructor(private readonly affiliationRepository: IAffiliationRepository) {}

  public async getAll(): Promise<Affiliation[]> {
    const result = await this.affiliationRepository.findAll();
    return result;
  }

  public async getById(id: number): Promise<Affiliation | null> {
    const result = await this.affiliationRepository.findById(id);
    if (!result) {
      throw new NotFoundError('affiliation not found with provided id');
    }
    return result;
  }

  public async create(
    payload: Prisma.AffiliationCreateInput,
  ): Promise<Affiliation> {
    const result = await this.affiliationRepository.create(payload);
    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<Omit<Affiliation, 'id'>>,
  ): Promise<void> {
    const affiliationExists = await this.affiliationRepository.findById(id);
    if (!affiliationExists) {
      throw new NotFoundError('affiliation not found with provided id');
    }
    const result = await this.affiliationRepository.updateById(id, payload);
    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const affiliationExists = await this.affiliationRepository.findById(id);
    if (!affiliationExists) {
      throw new NotFoundError('affiliation not found with provided id');
    }
    const result = await this.affiliationRepository.deleteById(id);
    return result;
  }
}
