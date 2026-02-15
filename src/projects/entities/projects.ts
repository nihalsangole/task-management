import { Task } from 'src/tasks/entities/tasks.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

export enum SyncStatus {
  SYNCED = 'synced',
  PENDING = 'pending',
  FAILED = 'failed',
  CONFLICT = 'conflict',
}

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  todoistProjectId: string;

  @Column({
    type: 'enum',
    enum: SyncStatus,
    default: SyncStatus.PENDING,
  })
  syncStatus: SyncStatus;

  @Column({ nullable: true })
  lastSyncedAt: Date;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  @OneToMany(() => Task, (task) => task.project)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
