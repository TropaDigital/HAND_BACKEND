import { Consultant, Prisma } from '@prisma/client';

import { IConsultantRepository, IConsultantService } from './interfaces';

export class ConsultantService implements IConsultantService {
  constructor(private readonly consultantRepository: IConsultantRepository) {}

  public async getAllConsultants(): Promise<Consultant[]> {
    const result = await this.consultantRepository.findAll();

    return result;
  }

  public async getConsultantById(id: number): Promise<Consultant | null> {
    const result = await this.consultantRepository.findById(id);

    return result;
  }

  public async createConsultant(
    consultant: Prisma.ConsultantCreateInput,
  ): Promise<Consultant> {
    const result = await this.consultantRepository.create(consultant);

    return result;
  }

  public async updateConsultant(
    id: number,
    consultant: Prisma.ConsultantUpdateInput,
  ): Promise<void> {
    const result = await this.consultantRepository.update(id, consultant);

    return result;
  }

  public async deleteConsultant(id: number): Promise<void> {
    const result = await this.consultantRepository.delete(id);

    return result;
  }
}
