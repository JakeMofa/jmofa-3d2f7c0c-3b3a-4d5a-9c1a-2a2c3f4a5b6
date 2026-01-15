import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard, RequirePermissions } from '@jmofa/auth';
import { AuditService } from './audit.service';

@Controller('audit-log')
@UseGuards(AuthGuard('jwt'), RbacGuard)
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  @RequirePermissions('audit-log:read')
  async findAll(@Request() req) {
    return this.auditService.findAll();
  }
}
