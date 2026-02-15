import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('tasks')
@ApiTags('Tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const result = await this.tasksService.create(createTaskDto, req.user);
    return {
      data: result,
      error: {},
      info: 'task creation',
      meta: {},
      message: 'task created successfully',
    };
  }

  @Get()
  async findAll(@Request() req) {
    const result = await this.tasksService.findAll(req.user);
    return {
      data: result,
      error: {},
      info: 'tasks list',
      meta: {},
      message: 'tasks retrived successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const result = await this.tasksService.findOne(id, req.user);
    return {
      data: result,
      error: {},
      info: 'task details',
      meta: {},
      message: 'task retrived successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const result = await this.tasksService.update(id, updateTaskDto, req.user);
    return {
      data: result,
      error: {},
      info: 'task update',
      meta: {},
      message: 'task updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.tasksService.remove(id, req.user);
    return {
      data: null,
      error: {},
      info: 'task deletion',
      meta: {},
      message: 'Task deleted successfully',
    };
  }
}
