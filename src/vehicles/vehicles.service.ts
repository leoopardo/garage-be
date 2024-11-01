import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { Model } from 'mongoose';
import { Vehicles } from './entities/vehicle.entity';
import { Client } from 'src/clients/entities/client.entity';
import { commonQueryParams } from 'src/types/common.types';

@Injectable()
export class VehiclesService {
  constructor(
    @Inject(TenantProvider.vehicleModel)
    private vehicles: Model<Vehicles>,
    @Inject(TenantProvider.clientModel)
    private clients: Model<Client>,
  ) {}

  async create(createVehicleDto: CreateVehicleDto) {
    try {
      const newVehicle = await this.vehicles.create(createVehicleDto);
      const client = await this.clients.findById(createVehicleDto.owner);
      if (!client) {
        throw new BadRequestException('Cliente não encontrado');
      }
      await this.clients.findByIdAndUpdate(createVehicleDto.owner, {
        $addToSet: { vehicles: newVehicle._id },
      });
      return newVehicle;
    } catch (error) {
      console.error('Erro ao cadastrar veículo', error.message);
      throw new Error(error);
    }
  }

  async findAll({ limit, page, search }: commonQueryParams) {
    try {
      const query: any = {};

      if (search) {
        query.$or = [
          { licensePlate: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { carModel: { $regex: search, $options: 'i' } },
          { color: { $regex: search, $options: 'i' } },
          { year: { $regex: search, $options: 'i' } },
        ];
      }

      if (!limit || page) {
        query.active = true;
        return await this.vehicles.find(query).exec();
      }

      const vehicles = await this.vehicles
        .find(query)
        .populate({
          path: 'owner',
          match: { name: { $regex: search || '', $options: 'i' } },
        })
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();

      return vehicles;
    } catch (error) {
      console.error(error);
      throw new Error('Erro ao buscar veículos.');
    }
  }

  async findOne(id: string) {
    try {
      return (await this.vehicles.findById(id)).populate('owner');
    } catch (error) {
      console.error('Erro ao buscar veículo', error.message);
      throw new Error(error);
    }
  }

  async update(id: string, updateVehicleDto: UpdateVehicleDto) {
    try {
      return await this.vehicles.findByIdAndUpdate(id, updateVehicleDto);
    } catch (error) {
      console.error('Erro ao atualizar veículo', error.message);
      throw new Error(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.vehicles.findByIdAndUpdate(id, { active: false });
    } catch (error) {
      console.error('Erro ao remover veículo', error.message);
      throw new Error(error);
    }
  }
}
