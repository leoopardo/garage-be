import { Inject, Injectable } from '@nestjs/common';
import { CreateConfigDto } from './dto/create-config.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { Model } from 'mongoose';
import { Config } from './entities/config.entity';
import { TenantProvider } from 'src/providers/tenant-model.provider';

@Injectable()
export class ConfigsService {
  constructor(
    @Inject(TenantProvider.configsModel) private configs: Model<Config>,
  ) {}

  create(createConfigDto: CreateConfigDto) {
    return 'This action adds a new config';
  }

  findAll() {
    return `This action returns all configs`;
  }

  update(id: number, updateConfigDto: UpdateConfigDto) {
    return `This action updates a #${id} config`;
  }
}
