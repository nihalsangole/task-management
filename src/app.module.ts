import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TodoistModule } from './todoist/todoist.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [() => require('./config/app.config').default()],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    AuthModule,
    ProjectsModule,
    TasksModule,
    TodoistModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
