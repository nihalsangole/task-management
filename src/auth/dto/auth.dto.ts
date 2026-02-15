import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @IsEmail()
  @ApiProperty({ example: 'nihalsangole@gmail.com' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'password123' })
  password: string;

  @IsString()
  @ApiProperty({ example: 'Nihal Sangole' })
  firstName: string;

  @IsString()
  @ApiProperty({ example: 'Sangole' })
  lastName: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty({})
  email: string;

  @IsString()
  @ApiProperty({})
  password: string;
}

export class ConnectTodoistDto {
  @IsString()
  @ApiProperty({})
  apiToken: string;
}
