import { Consultant, Prisma } from '@prisma/client';

import { IConsultantRepository, IConsultantService } from './interfaces';

export class ConsultantService implements IConsultantService {
  constructor(private readonly consultantRepository: IConsultantRepository) {}

  public async getAllConsultants(): Promise<Consultant[]> {
    const result = await this.consultantRepository.findAll();
    return result.map(consultant => ({
      ...consultant,
      commission: this.formatCommissionFromPersistence(consultant.commission),
    }));
  }

  public async getConsultantById(id: number): Promise<Consultant | null> {
    const result = await this.consultantRepository.findById(id);

    return result
      ? {
          ...result,
          commission: this.formatCommissionFromPersistence(result.commission),
        }
      : result;
  }

  public async createConsultant(
    payload: Prisma.ConsultantCreateInput,
  ): Promise<Consultant> {
    const consultant = {
      ...payload,
      commission: this.formatCommissionToPersistence(payload.commission),
    };
    const result = await this.consultantRepository.create(consultant);

    return result;
  }

  public async updateConsultant(
    id: number,
    payload: Partial<Omit<Consultant, 'id'>>,
  ): Promise<void> {
    const consultant = {
      ...payload,
      commission: this.formatCommissionToPersistence(payload.commission),
    };
    const result = await this.consultantRepository.update(id, consultant);

    return result;
  }

  public async deleteConsultant(id: number): Promise<void> {
    const result = await this.consultantRepository.delete(id);

    return result;
  }

  private formatCommissionToPersistence(commission = 0): number {
    return commission * 100;
  }

  private formatCommissionFromPersistence(commission: number): number {
    return commission / 100;
  }
}
