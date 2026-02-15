import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @IsString()
  @ApiProperty({ example: 'My Project' })
  name: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  @ApiProperty({})
  name?: string;
}
