import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/projects';
import { User } from 'src/users/entities/user.entity';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { SyncService } from 'src/todoist/sync.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private syncService: SyncService,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: User,
  ): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      user_id: user.id,
    });

    const savedProject = await this.projectRepository.save(project);
    console.log('project created', savedProject.id);

    await this.syncService.syncProjectToTodoist(savedProject, user);

    return (await this.projectRepository.findOne({
      where: { id: savedProject.id },
      relations: ['tasks'],
    }))!;
  }

  async findAll(user: User): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { user_id: user.id },
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: User): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID "${id}" not found`);
    }

    if (project.user_id !== user.id) {
      throw new ForbiddenException('you do not have access to this project');
    }

    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: User,
  ): Promise<Project> {
    const project = await this.findOne(id, user);

    Object.assign(project, updateProjectDto);

    const savedProject = await this.projectRepository.save(project);
    console.log('project updated', savedProject.id);

    await this.syncService.syncProjectToTodoist(savedProject, user);

    return (await this.projectRepository.findOne({
      where: { id: savedProject.id },
      relations: ['tasks'],
    }))!;
  }

  async remove(id: string, user: User): Promise<void> {
    const project = await this.findOne(id, user);

    if (project.todoistProjectId) {
      await this.syncService.deleteProjectFromTodoist(
        project.todoistProjectId,
        user,
      );
    }

    await this.projectRepository.remove(project);
  }
}
