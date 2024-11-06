import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { PaymentGuard } from 'src/auth/guards/payment.guard';
import { commonQueryParams } from 'src/types/common.types';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServicesService } from './services.service';
import { UpdateServiceDto } from './dto/update-service.dto';

@Controller('services')
@UseGuards(AuthGuard)
@UseGuards(PaymentGuard)
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  findAll(@Query() query: commonQueryParams) {
    return this.servicesService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servicesService.findOne(id);
  }

  @Patch(':id/change-board/:boardId')
  update(@Param('id') id: string, @Param('boardId') boardId: string) {
    return this.servicesService.updateBoard(id, boardId);
  }

  @Patch(':id/change-step-status/:stepId')
  updtaeStepStatus(@Param('id') id: string, @Param('stepId') stepId: string) {
    return this.servicesService.changeStepDoneStatus(id, stepId);
  }

  @Patch(':id')
  updateService(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
