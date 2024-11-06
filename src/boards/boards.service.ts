import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { Quote } from 'src/quotes/entities/quote.entity';
import { ServiceStatus } from 'src/service-status/entities/service-status.entity';
import { Service } from 'src/services/entities/service.entity';
import { Vehicles } from 'src/vehicles/entities/vehicle.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { Mechanical } from 'src/mechanicals/entities/mechanical.entity';

@Injectable()
export class BoardsService {
  constructor(
    @Inject(TenantProvider.boardsModel) private boardsModel: Model<Board>,
    @Inject(TenantProvider.servicesModel) private servicesModel: Model<Service>,
    @Inject(TenantProvider.quotesModel) private quotes: Model<Quote>,
    @Inject(TenantProvider.clientModel) private clients: Model<Client>,
    @Inject(TenantProvider.vehicleModel) private vehicles: Model<Vehicles>,
    @Inject(TenantProvider.serviceStatusModel)
    private serviceStatus: Model<ServiceStatus>,
    @Inject(TenantProvider.mechanicalsModel)
    private mechanicals: Model<Mechanical>,
  ) {}

  create(createBoardDto: CreateBoardDto) {
    return 'This action adds a new board';
  }

  async findAll() {
    const boards = await this.boardsModel
      .find()
      .populate({
        path: 'services',
        populate: [
          { path: 'vehicleId' },
          { path: 'clientId' },
          { path: 'quote' },
          { path: 'steps', populate: { path: 'statusId' } },
          { path: 'mechanical' },
        ],
      })
      .exec();
    return boards;
  }

  findOne(id: number) {
    return `This action returns a #${id} board`;
  }

  update(id: number, updateBoardDto: UpdateBoardDto) {
    return `This action updates a #${id} board`;
  }

  remove(id: number) {
    return `This action removes a #${id} board`;
  }
}
