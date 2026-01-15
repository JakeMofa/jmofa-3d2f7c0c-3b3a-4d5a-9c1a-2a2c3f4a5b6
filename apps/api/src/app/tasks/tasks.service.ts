import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserContext, AccessControlService } from '@jmofa/auth';
import { OrgsService } from '../orgs/orgs.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private accessControlService: AccessControlService,
    private orgsService: OrgsService,
    private auditService: AuditService,
  ) {}

  async create(user: UserContext, createTaskDto: CreateTaskDto): Promise<Task> {
    // User can only create tasks in their own org
    const task = this.tasksRepository.create({
      ...createTaskDto,
      orgId: user.orgId,
      ownerUserId: user.id,
    });

    const savedTask = await this.tasksRepository.save(task);

    await this.auditService.log({
      userId: user.id,
      action: 'task:create',
      resourceType: 'task',
      resourceId: savedTask.id,
      allowed: true,
    });

    return savedTask;
  }

  async findAll(user: UserContext): Promise<Task[]> {
    // Get child org IDs for org scoping
    const childOrgIds = await this.orgsService.getChildOrgIds(user.orgId);
    const accessibleOrgIds = this.accessControlService.getAccessibleOrgIds(
      user,
      childOrgIds,
    );

    const tasks = await this.tasksRepository.find({
      where: { orgId: In(accessibleOrgIds) },
      order: { orderIndex: 'ASC', createdAt: 'DESC' },
    });

    await this.auditService.log({
      userId: user.id,
      action: 'task:read',
      resourceType: 'task',
      allowed: true,
    });

    return tasks;
  }

  async findOne(user: UserContext, id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });

    if (!task) {
      await this.auditService.log({
        userId: user.id,
        action: 'task:read',
        resourceType: 'task',
        resourceId: id,
        allowed: false,
        reason: 'Task not found',
      });
      throw new NotFoundException('Task not found');
    }

    // Check if user can access this task's org
    const childOrgIds = await this.orgsService.getChildOrgIds(user.orgId);
    const canAccess = this.accessControlService.canAccessOrg(
      user,
      task.orgId,
      childOrgIds,
    );

    if (!canAccess) {
      await this.auditService.log({
        userId: user.id,
        action: 'task:read',
        resourceType: 'task',
        resourceId: id,
        allowed: false,
        reason: 'Org access denied',
      });
      throw new ForbiddenException('Cannot access this task');
    }

    await this.auditService.log({
      userId: user.id,
      action: 'task:read',
      resourceType: 'task',
      resourceId: id,
      allowed: true,
    });

    return task;
  }

  async update(
    user: UserContext,
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.findOne(user, id);

    // User can update if they have update permission and can access the org
    Object.assign(task, updateTaskDto);
    const updatedTask = await this.tasksRepository.save(task);

    await this.auditService.log({
      userId: user.id,
      action: 'task:update',
      resourceType: 'task',
      resourceId: id,
      allowed: true,
    });

    return updatedTask;
  }

  async remove(user: UserContext, id: string): Promise<void> {
    const task = await this.findOne(user, id);

    await this.tasksRepository.remove(task);

    await this.auditService.log({
      userId: user.id,
      action: 'task:delete',
      resourceType: 'task',
      resourceId: id,
      allowed: true,
    });
  }
}