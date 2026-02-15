import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto, LoginDto, ConnectTodoistDto } from './dto/auth.dto';
import { TodoistService } from 'src/todoist/todoist.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private todoistService: TodoistService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.toLowerCase();

    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
      ...registerDto,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const payload = { sub: savedUser.id, email: savedUser.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        isTodoistConnected: savedUser.isTodoistConnected,
      },
      accessToken,
    };
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.toLowerCase();

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isTodoistConnected: user.isTodoistConnected,
      },
      accessToken,
    };
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('user not found');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isTodoistConnected: user.isTodoistConnected,
      createdAt: user.createdAt,
    };
  }

  async connectTodoist(userId: string, connectDto: ConnectTodoistDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('  not found');
    }

    console.log('user', user);

    const isValid = await this.todoistService.validateApiToken(
      connectDto.apiToken,
    );
    console.log('check', isValid);
    if (!isValid) {
      throw new BadRequestException(
        'invlid todist API token. Please check your token and try again.',
      );
    }

    user.todoistApiToken = connectDto.apiToken;
    user.isTodoistConnected = true;

    await this.userRepository.save(user);

    return {
      message: 'todoist account connected successfully',
      isTodoistConnected: true,
    };
  }

  async disconnectTodoist(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('  not found');
    }

    user.todoistApiToken = null as any;
    user.isTodoistConnected = false;

    await this.userRepository.save(user);

    return {
      message: 'todoist account disconnected successfully',
      isTodoistConnected: false,
    };
  }
}
