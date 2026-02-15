import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { User } from 'src/users/entities/user.entity';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { SyncService } from 'src/todoist/sync.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private syncService: SyncService,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const task = new Task();
    task.title = createTaskDto.title;
    task.description = createTaskDto.description || '';
    task.project_id = createTaskDto.projectId || (null as any);
    task.user_id = user.id;

    const savedTask = await this.taskRepository.save(task);
    console.log('task created', savedTask.id);

    await this.syncService.syncTaskToTodoist(savedTask, user);

    return (await this.taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['project'],
    }))!;
  }

  async findAll(user: User): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { user_id: user.id },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    if (task.user_id !== user.id) {
      throw new ForbiddenException('you dont have access to this task');
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.findOne(id, user);

    if (updateTaskDto.title !== undefined) {
      task.title = updateTaskDto.title;
    }
    if (updateTaskDto.description !== undefined) {
      task.description = updateTaskDto.description;
    }
    if (updateTaskDto.isCompleted !== undefined) {
      task.isCompleted = updateTaskDto.isCompleted;
    }
    if (updateTaskDto.projectId !== undefined) {
      task.project_id = updateTaskDto.projectId;
    }

    const savedTask = await this.taskRepository.save(task);
    console.log('task updated', savedTask.id);

    await this.syncService.syncTaskToTodoist(savedTask, user);

    return (await this.taskRepository.findOne({
      where: { id: savedTask.id },
      relations: ['project'],
    }))!;
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.findOne(id, user);

    if (task.todoistTaskId) {
      await this.syncService.deleteTaskFromTodoist(task.todoistTaskId, user);
    }

    await this.taskRepository.remove(task);
  }
}
