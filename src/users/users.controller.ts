import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { commonQueryParams } from 'src/types/common.types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Request as reqType } from 'express';
import { PaymentGuard } from 'src/auth/guards/payment.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Get()
  findAll(@Query() queryParams: commonQueryParams) {
    return this.usersService.findAll(queryParams);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Patch(':id')
  update(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }

  @UseGuards(AuthGuard)
  @Post('verify')
  verifyUser(@Body('token') token: string, @Request() req: reqType) {
    return this.usersService.verifyUser(
      token,
      req.headers.authorization.split(' ')[1],
    );
  }
}
