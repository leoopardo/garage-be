import { Inject, Injectable } from '@nestjs/common';
import { CreateMechanicalDto } from './dto/create-mechanical.dto';
import { UpdateMechanicalDto } from './dto/update-mechanical.dto';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { Model } from 'mongoose';
import { Mechanical } from './entities/mechanical.entity';
import {
  commonQueryParams,
  listResponse,
  registerStatus,
} from 'src/types/common.types';

@Injectable()
export class MechanicalsService {
  constructor(
    @Inject(TenantProvider.mechanicalsModel)
    private mechanicals: Model<Mechanical>,
  ) {}

  async create(createMechanicalDto: CreateMechanicalDto) {
    try {
      return await this.mechanicals.create({
        ...createMechanicalDto,
        status: registerStatus.ACTIVE,
      });
    } catch (error) {
      console.error('Erro ao cadastrar o mecânico', error.message);
      throw new Error(error);
    }
  }

  async findAll({ limit, page, search }: commonQueryParams) {
    try {
      const query: any = {};
      if (search) {
        query.$or = [
          { firstname: { $regex: search, $options: 'i' } },
          { lastname: { $regex: search, $options: 'i' } },
          { cellphone: { $regex: search, $options: 'i' } },
        ];
      }

      if (!limit || page) {
        query.active = true;
        return await this.mechanicals.find(query).exec();
      }
      limit = limit || 15;
      page = page || 1;
      const skip = (page - 1) * limit;

      const totalMechanicals =
        (await this.mechanicals.countDocuments(query)) || 0;
      const mechanicals = await this.mechanicals
        .find(query)
        .skip(skip)
        .sort({ createdAt: -1 })
        .sort({ active: -1 })
        .limit(limit)
        .populate('servicesHistory')
        .exec();

      return {
        data: mechanicals,
        total: totalMechanicals,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(totalMechanicals / limit),
      };
    } catch (error) {}
  }

  async findOne(id: string) {
    try {
      return await this.mechanicals.findById(id);
    } catch (error) {
      console.error(error);
    }
  }

  async update(id: string, updateMechanicalDto: UpdateMechanicalDto) {
    try {
      return await this.mechanicals.findByIdAndUpdate(id, updateMechanicalDto);
    } catch (error) {
      console.error(error);
    }
  }

  async remove(id: number) {
    return await this.mechanicals.findByIdAndUpdate(id, {
      status: registerStatus.INACTIVE,
    });
  }
}
