import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Injectable,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { Model } from 'mongoose';
import { Config } from './entities/config.entity';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { PaymentGuard } from 'src/auth/guards/payment.guard';

@Injectable()
@Controller('configs')
export class ConfigsController {
  constructor(
    @Inject(TenantProvider.configsModel)
    private config: Model<Config>,
  ) {}
  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {}

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.config.find();
  }
  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConfigDto: UpdateConfigDto) {}
}
