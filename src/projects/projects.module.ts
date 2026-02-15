import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { Project } from './entities/projects';
import { TodoistModule } from 'src/todoist/todoist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]), TodoistModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
