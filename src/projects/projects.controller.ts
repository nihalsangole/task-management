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
import { ProjectsService } from './projects.service';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('projects')
@ApiTags('Projects')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    const result = await this.projectsService.create(createProjectDto, req.user);
    return {
      data: result,
      error: {},
      info: 'Project Creation',
      meta: {},
      message: 'Project created successfully',
    };
  }

  @Get()
  async findAll(@Request() req) {
    const result = await this.projectsService.findAll(req.user);
    return {
      data: result,
      error: {},
      info: 'projects list',
      meta: {},
      message: 'projects retrived successfully',
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const result = await this.projectsService.findOne(id, req.user);
    return {
      data: result,
      error: {},
      info: 'project details',
      meta: {},
      message: 'project retrived successfully',
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req,
  ) {
    const result = await this.projectsService.update(id, updateProjectDto, req.user);
    return {
      data: result,
      error: {},
      info: 'project update',
      meta: {},
      message: 'project updated successfully',
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.projectsService.remove(id, req.user);
    return {
      data: null,
      error: {},
      info: 'project deletion',
      meta: {},
      message: 'project deleted successfully',
    };
  }
}
