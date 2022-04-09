import { Consultant, Prisma } from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import { IConsultantRepository, IConsultantService } from './interfaces';

export class ConsultantService implements IConsultantService {
  constructor(private readonly consultantRepository: IConsultantRepository) {}

  public async getAll(): Promise<Consultant[]> {
    const result = await this.consultantRepository.findAll();
    return result.map(consultant => ({
      ...consultant,
      commission: this.formatCommissionFromPersistence(consultant.commission),
    }));
  }

  public async getById(id: number): Promise<Consultant> {
    const result = await this.consultantRepository.findById(id);

    if (!result) {
      throw new NotFoundError('consultant not found with provided id');
    }

    return {
      ...result,
      commission: this.formatCommissionFromPersistence(result.commission),
    };
  }

  public async create(
    payload: Prisma.ConsultantCreateInput,
  ): Promise<Consultant> {
    const consultant = {
      ...payload,
      commission: this.formatCommissionToPersistence(payload.commission),
    };
    const result = await this.consultantRepository.create(consultant);

    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<Omit<Consultant, 'id'>>,
  ): Promise<Consultant> {
    const consultantExists = await this.consultantRepository.findById(id);
    if (!consultantExists) {
      throw new NotFoundError('consultant not found with provided id');
    }
    const consultant = {
      ...payload,
      commission: this.formatCommissionToPersistence(payload.commission),
    };
    const result = await this.consultantRepository.updateById(id, consultant);
    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const consultantExists = await this.consultantRepository.findById(id);
    if (!consultantExists) {
      throw new NotFoundError('consultant not found with provided id');
    }
    const result = await this.consultantRepository.deleteById(id);
    return result;
  }

  private formatCommissionToPersistence(commission = 0): number {
    return commission * 100;
  }

  private formatCommissionFromPersistence(commission: number): number {
    return commission / 100;
  }
}
