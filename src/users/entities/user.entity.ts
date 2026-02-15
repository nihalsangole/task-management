import { Exclude } from 'class-transformer';
import { Project } from 'src/projects/entities/projects';
import { Task } from 'src/tasks/entities/tasks.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  @Exclude()
  todoistApiToken: string;

  @Column({ default: false })
  isTodoistConnected: boolean;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
