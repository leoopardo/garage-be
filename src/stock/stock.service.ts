import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { Model } from 'mongoose';
import { Stock } from './entities/stock.entity';
import { commonQueryParams } from 'src/types/common.types';

@Injectable()
export class StockService {
  constructor(
    @Inject(TenantProvider.stockModel)
    private stockModel: Model<Stock>,
  ) {}

  async create(createStockDto: CreateStockDto) {
    try {
      return await this.stockModel.create(createStockDto);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async findAll({ page, limit, search }: commonQueryParams) {
    try {
      const query: any = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { subCategory: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { costPrice: { $regex: search, $options: 'i' } },
          { sellingPrice: { $regex: search, $options: 'i' } },
        ];
      }

      if (!limit || !page) {
        query.active = true;
        return await this.stockModel.find(query).exec();
      }
      limit = limit || 15;
      page = page || 1;
      const skip = (page - 1) * limit;
      const total = await this.stockModel.countDocuments(query);
      const stocks = await this.stockModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

      return {
        data: stocks,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.stockModel.findById(id).exec();
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async update(id: string, updateStockDto: UpdateStockDto) {
    try {
      return await this.stockModel.findByIdAndUpdate(id, updateStockDto);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      return await this.stockModel.findByIdAndUpdate(id, { active: false });
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
