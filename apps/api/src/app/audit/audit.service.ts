import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditRepository: Repository<AuditLog>,
  ) {}

  async log(logData: {
    userId: string;
    action: string;
    resourceType: string;
    resourceId?: string;
    allowed: boolean;
    reason?: string;
  }): Promise<void> {
    const log = this.auditRepository.create(logData);
    await this.auditRepository.save(log);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditRepository.find({ order: { timestamp: 'DESC' } });
  }
}
