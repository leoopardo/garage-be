import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServiceStatusService } from './service-status.service';
import { CreateServiceStatusDto } from './dto/create-service-status.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { commonQueryParams } from 'src/types/common.types';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { PaymentGuard } from 'src/auth/guards/payment.guard';

@Controller('service-status')
export class ServiceStatusController {
  constructor(private readonly serviceStatusService: ServiceStatusService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  create(@Body() createServiceStatusDto: CreateServiceStatusDto) {
    return this.serviceStatusService.create(createServiceStatusDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  findAll(@Query() queryParams: commonQueryParams) {
    return this.serviceStatusService.findAll(queryParams);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  findOne(@Param('id') id: string) {
    return this.serviceStatusService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  update(
    @Param('id') id: string,
    @Body() updateServiceStatusDto: UpdateServiceStatusDto,
  ) {
    return this.serviceStatusService.update(+id, updateServiceStatusDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  remove(@Param('id') id: string) {
    return this.serviceStatusService.remove(+id);
  }
}
