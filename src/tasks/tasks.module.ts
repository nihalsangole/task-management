import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task } from './entities/tasks.entity';
import { TodoistModule } from 'src/todoist/todoist.module';

@Module({
  imports: [TypeOrmModule.forFeature([Task]), TodoistModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
