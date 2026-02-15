import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, ConnectTodoistDto } from './dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Public } from './public.decorator';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Public()
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      data: result,
      error: {},
      info: 'user registration',
      meta: {},
      message: 'registration successful',
    };
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      data: result,
      error: {},
      info: 'user login',
      meta: {},
      message: 'login successful',
    };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    const result = await this.authService.getProfile(req.user.id);
    return {
      data: result,
      error: {},
      info: 'profile retrieval',
      meta: {},
      message: 'profile retrieved successfully',
    };
  }

  @Post('connect-todoist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async connectTodoist(@Request() req, @Body() connectDto: ConnectTodoistDto) {
    const result = await this.authService.connectTodoist(
      req.user.id,
      connectDto,
    );
    return {
      data: result,
      error: {},
      info: 'todoist connection',
      meta: {},
      message: 'todoist account connected successfully',
    };
  }

  @Post('disconnect-todoist')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async disconnectTodoist(@Request() req) {
    const result = await this.authService.disconnectTodoist(req.user.id);
    return {
      data: result,
      error: {},
      info: 'todoist disconnection',
      meta: {},
      message: 'todoist account disconnected successfully',
    };
  }
}
