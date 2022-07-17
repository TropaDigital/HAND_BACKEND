import { Prisma } from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import {
  IFindAllParams,
  IPaginatedAResult,
} from '../../shared/pagination/interfaces';
import {
  IAssociated,
  IAssociatedRepository,
  IAssociatedService,
  ICreateAssociatedInput,
  IUpdateAssociatedInput,
} from './interfaces';

export class AssociatedService implements IAssociatedService {
  constructor(private readonly associatedRepository: IAssociatedRepository) {}

  public async getAll(
    payload?: IFindAllParams & Prisma.AssociatedWhereInput,
  ): Promise<IPaginatedAResult<IAssociated[]>> {
    const result = await this.associatedRepository.findAll(payload);

    return result;
  }

  public async getById(id: number): Promise<IAssociated | null> {
    const result = await this.associatedRepository.findById(id);
    if (!result) {
      throw new NotFoundError('associated not found with provided id');
    }
    return result;
  }

  public async create(payload: ICreateAssociatedInput): Promise<IAssociated> {
    const result = await this.associatedRepository.create(payload);

    return result;
  }

  public async updateById(
    id: number,
    payload: IUpdateAssociatedInput,
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
