import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { commonQueryParams } from 'src/types/common.types';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';
import { Vehicles } from 'src/vehicles/entities/vehicle.entity';

@Injectable()
export class ClientsService {
  constructor(
    @Inject(TenantProvider.clientModel)
    private clients: Model<Client>,
    @Inject(TenantProvider.vehicleModel)
    private vehicles: Model<Vehicles>,
  ) {}
  async create(createClientDto: CreateClientDto) {
    try {
      const newClient = await this.clients.create(createClientDto);
      return newClient;
    } catch (error) {
      console.error('Error creating client', error);
      throw new Error(error);
    }
  }

  async findAll({ limit, page, search }: commonQueryParams) {
    try {
      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { cellphone: { $regex: search, $options: 'i' } },
        ];
      }
      if (!page && !limit) {
        query.active = true;
        return await this.clients.find(query).populate('vehicles').exec();
      }
      limit = limit || 10;
      page = page || 1;
      const skip = (page - 1) * limit;

      const totalClients = (await this.clients.countDocuments(query)) || 0;

      const clients = await this.clients
        .find(query)
        .populate('vehicles')
        .skip(skip)
        .sort({ name: -1 })
        .limit(limit)
        .exec();

      return {
        data: clients,
        total: totalClients,
        page,
        limit,
        totalPages: Math.ceil(totalClients / limit),
      };
    } catch (error) {
      console.error('Error finding clients', error);
      throw new Error(error);
    }
  }

  async findOne(id: string) {
    try {
      const client = (await this.clients.findById(id)).populated('vehicles');
      return client;
    } catch (error) {
      console.error('Error finding client', error);
      throw new Error(error);
    }
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    try {
      const updatedClient = await this.clients.findByIdAndUpdate(
        id,
        updateClientDto,
      );
      return updatedClient;
    } catch (error) {
      console.error('Error updating client', error);
      throw new Error(error);
    }
  }

  async remove(id: string) {
    try {
      const removedClient = await this.clients.findByIdAndUpdate(id, {
        active: false,
      });
      return removedClient;
    } catch (error) {
      console.error('Error removing client', error);
      throw new Error(error);
    }
  }
}
