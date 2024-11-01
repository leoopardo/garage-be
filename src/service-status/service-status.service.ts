import { HttpException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { commonQueryParams, listResponse } from 'src/types/common.types';
import { CreateServiceStatusDto } from './dto/create-service-status.dto';
import { UpdateServiceStatusDto } from './dto/update-service-status.dto';
import { ServiceStatus } from './entities/service-status.entity';

@Injectable()
export class ServiceStatusService {
  constructor(
    @Inject(TenantProvider.serviceStatusModel)
    private serviceStatusModel: Model<ServiceStatus>,
  ) {}

  async create(createServiceStatusDto: CreateServiceStatusDto) {
    try {
      const newServiceStatus = await this.serviceStatusModel.create(
        createServiceStatusDto,
      );
      return await newServiceStatus.save();
    } catch (error) {
      console.error('Error creating service status', error);
      throw new HttpException('Error creating service status', 500);
    }
  }

  async findAll({ limit, page, search }: commonQueryParams) {
    try {
      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      if (!page && !limit) {
        query.active = true;
        return await this.serviceStatusModel.find(query).exec();
      }
      limit = limit || 10;
      page = page || 1;
      const skip = (page - 1) * limit;

      const totalServiceStatus =
        (await this.serviceStatusModel.countDocuments(query)) || 0;

      const totalMechanicals = await this.serviceStatusModel
        .find(query)
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      return {
        data: totalMechanicals,
        total: totalServiceStatus,
        page,
        limit,
        totalPages: Math.ceil(totalServiceStatus / limit),
      };
    } catch (error) {}
  }

  async findOne(id: number) {
    try {
      const serviceStatus = await this.serviceStatusModel.findById(id);
      return serviceStatus;
    } catch (error) {
      console.error('Erro ao encontrar status', error);
    }
  }

  async update(id: number, updateServiceStatusDto: UpdateServiceStatusDto) {
    try {
      const updatedServiceStatus =
        await this.serviceStatusModel.findByIdAndUpdate(
          id,
          updateServiceStatusDto,
        );
      return updatedServiceStatus;
    } catch (error) {
      console.error('Erro ao atualizar status', error);
    }
  }

  async remove(id: number) {
    try {
      const updatedServiceStatus =
        await this.serviceStatusModel.findByIdAndUpdate(id, { active: false });

      return updatedServiceStatus;
    } catch (error) {
      console.error('Erro ao remover status', error);
    }
  }
}
