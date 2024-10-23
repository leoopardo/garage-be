import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Request as reqType } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from './guards/jwt.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Request() req: reqType, @Body() credentials: AuthDto) {
    return this.authService.validateUser(credentials);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  me(@Request() req: reqType) {
    return this.authService.getMe(req.headers.authorization.split(' ')[1]);
  }
}
