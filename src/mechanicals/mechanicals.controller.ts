import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { PaymentGuard } from 'src/auth/guards/payment.guard';
import { CreateMechanicalDto } from './dto/create-mechanical.dto';
import { UpdateMechanicalDto } from './dto/update-mechanical.dto';
import { MechanicalsService } from './mechanicals.service';
import { commonQueryParams } from 'src/types/common.types';

@Controller('mechanicals')
export class MechanicalsController {
  constructor(private readonly mechanicalsService: MechanicalsService) {}

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Post()
  create(@Body() createMechanicalDto: CreateMechanicalDto) {
    return this.mechanicalsService.create(createMechanicalDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Get()
  findAll(@Param() queryParams: commonQueryParams) {
    return this.mechanicalsService.findAll(queryParams);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mechanicalsService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMechanicalDto: UpdateMechanicalDto,
  ) {
    return this.mechanicalsService.update(+id, updateMechanicalDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mechanicalsService.remove(+id);
  }
}
