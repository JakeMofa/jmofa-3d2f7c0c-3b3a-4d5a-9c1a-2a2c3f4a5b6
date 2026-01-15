import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';

@Injectable()
export class OrgsService {
  constructor(
    @InjectRepository(Organization)
    private orgsRepository: Repository<Organization>,
  ) {}

  async findById(id: string): Promise<Organization | null> {
    return this.orgsRepository.findOne({ where: { id } });
  }

  async getChildOrgIds(orgId: string): Promise<string[]> {
    const children = await this.orgsRepository.find({
      where: { parentOrgId: orgId },
    });
    return children.map((org) => org.id);
  }

  async create(orgData: Partial<Organization>): Promise<Organization> {
    const org = this.orgsRepository.create(orgData);
    return this.orgsRepository.save(org);
  }
}
