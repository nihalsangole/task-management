import { IsString, IsOptional, IsBoolean, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @IsString()
  @ApiProperty({ example: 'Buy groceries' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({})
  description?: string;

  @IsOptional()
  @IsUUID()
  @ApiProperty({})
  projectId?: string;
}

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @ApiProperty({})
  title?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({})
  description?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({})
  isCompleted?: boolean;

  @IsOptional()
  @IsUUID()
  @ApiProperty({})
  projectId?: string;
}
