import { Role, Prisma } from '@prisma/client';

import { NotFoundError } from '../../shared/errors';
import { IRoleRepository, IRoleService } from './interfaces';

export class RoleService implements IRoleService {
  constructor(private readonly roleRepository: IRoleRepository) {}

  public async getAll(): Promise<Role[]> {
    const result = await this.roleRepository.findAll();
    return result;
  }

  public async getById(id: number): Promise<Role | null> {
    const result = await this.roleRepository.findById(id);
    if (!result) {
      throw new NotFoundError('role not found with provided id');
    }
    return result;
  }

  public async create(payload: Prisma.RoleCreateInput): Promise<Role> {
    const result = await this.roleRepository.create(payload);
    return result;
  }

  public async updateById(
    id: number,
    payload: Partial<Omit<Role, 'id'>>,
  ): Promise<void> {
    const roleExists = await this.roleRepository.findById(id);
    if (!roleExists) {
      throw new NotFoundError('role not found with provided id');
    }
    const result = await this.roleRepository.updateById(id, payload);
    return result;
  }

  public async deleteById(id: number): Promise<void> {
    const roleExists = await this.roleRepository.findById(id);
    if (!roleExists) {
      throw new NotFoundError('role not found with provided id');
    }
    const result = await this.roleRepository.deleteById(id);
    return result;
  }
}
