import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from '../entities/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AccessControlService } from '@jmofa/auth';
import { OrgsModule } from '../orgs/orgs.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), OrgsModule, AuditModule],
  controllers: [TasksController],
  providers: [TasksService, AccessControlService],
})
export class TasksModule {}
