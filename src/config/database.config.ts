import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { Task } from 'src/tasks/entities/tasks.entity';
import { SyncLog } from 'src/todoist/entities/sync-logs.entity';
import { Project } from 'src/projects/entities/projects';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('database.host'),
  port: configService.get('database.port'),
  username: configService.get('database.username'),
  password: configService.get('database.password'),
  database: configService.get('database.database'),
  entities: [User, Task, SyncLog, Project],
  synchronize: configService.get('database.synchronize'),
  logging: configService.get('database.logging'),
  retryAttempts: 10,
  retryDelay: 3000,
});
