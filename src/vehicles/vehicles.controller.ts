import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { AuthGuard } from 'src/auth/guards/jwt.guard';
import { PaymentGuard } from 'src/auth/guards/payment.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Get()
  findAll() {
    return this.vehiclesService.findAll();
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vehiclesService.findOne(+id);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehiclesService.update(+id, updateVehicleDto);
  }

  @UseGuards(AuthGuard)
  @UseGuards(PaymentGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vehiclesService.remove(+id);
  }
}
