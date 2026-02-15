import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from 'src/projects/entities/projects';

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  FAILED = 'failed',
  CONFLICT = 'conflict',
}

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ nullable: true })
  todoistTaskId: string;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING,
  })
  syncStatus: SyncStatus;

  @Column({ nullable: true })
  lastSyncedAt: Date;

  @ManyToOne(() => Project, (project) => project.tasks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @Column({ nullable: true })
  project_id: string;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
