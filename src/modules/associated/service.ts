import { Associated, Prisma } from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import { IAssociatedRepository, IAssociatedService } from './interfaces';

export class AssociatedService implements IAssociatedService {
  constructor(private readonly associatedRepository: IAssociatedRepository) {}

  public async getAll(): Promise<Associated[]> {
    const result = await this.associatedRepository.findAll();
    return result;
  }

  public async getById(id: number): Promise<Associated | null> {
    const result = await this.associatedRepository.findById(id);
    if (!result) {
      throw new NotFoundError('associated not found with provided id');
    }
    return result;
  }

  public async create(
    payload: Prisma.AssociatedCreateInput,
  ): Promise<Associated> {
    const result = await this.associatedRepository.create(payload);

    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<Omit<Associated, 'id'>>,
  ): Promise<void> {
    const associatedExists = await this.associatedRepository.findById(id);
    if (!associatedExists) {
      throw new NotFoundError('associated not found with provided id');
    }
    const result = await this.associatedRepository.updateById(id, payload);
    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const associatedExists = await this.associatedRepository.findById(id);
    if (!associatedExists) {
      throw new NotFoundError('associated not found with provided id');
    }
    const result = await this.associatedRepository.deleteById(id);
    return result;
  }
}
