import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RbacGuard, RequirePermissions } from '@jmofa/auth';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'), RbacGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @RequirePermissions('task:create')
  async create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(req.user, createTaskDto);
  }

  @Get()
  @RequirePermissions('task:read')
  async findAll(@Request() req) {
    return this.tasksService.findAll(req.user);
  }

  @Get(':id')
  @RequirePermissions('task:read')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.tasksService.findOne(req.user, id);
  }

  @Put(':id')
  @RequirePermissions('task:update')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.tasksService.update(req.user, id, updateTaskDto);
  }

  @Delete(':id')
  @RequirePermissions('task:delete')
  async remove(@Request() req, @Param('id') id: string) {
    await this.tasksService.remove(req.user, id);
    return { message: 'Task deleted successfully' };
  }
}
