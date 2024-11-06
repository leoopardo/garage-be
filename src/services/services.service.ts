import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Board } from 'src/boards/entities/board.entity';
import { Client } from 'src/clients/entities/client.entity';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { Quote } from 'src/quotes/entities/quote.entity';
import { ServiceStatus } from 'src/service-status/entities/service-status.entity';
import { Vehicles } from 'src/vehicles/entities/vehicle.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';
import { commonQueryParams } from 'src/types/common.types';
import { Mechanical } from 'src/mechanicals/entities/mechanical.entity';

@Injectable()
export class ServicesService {
  constructor(
    @Inject(TenantProvider.servicesModel) private services: Model<Service>,
    @Inject(TenantProvider.serviceStatusModel)
    private serviceStatus: Model<ServiceStatus>,
    @Inject(TenantProvider.boardsModel) private boards: Model<Board>,
    @Inject(TenantProvider.quotesModel) private quotes: Model<Quote>,
    @Inject(TenantProvider.clientModel) private clients: Model<Client>,
    @Inject(TenantProvider.vehicleModel) private vehicles: Model<Vehicles>,
    @Inject(TenantProvider.mechanicalsModel)
    private mechanicals: Model<Mechanical>,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    try {
      const service = await this.services.create(createServiceDto);
      const waitingQuoteStatus = await this.serviceStatus.findOne({
        name: 'Orçamento aguardando',
      });
      await this.boards.findByIdAndUpdate(waitingQuoteStatus._id, {
        $push: { services: service._id },
      });
    } catch (error) {}
  }

  async findAll({ limit, page, search }: commonQueryParams) {
    try {
      const query: any = {};
      if (search) {
        query.$or = [
          // { name: { $regex: search, $options: 'i' } },
          // { cellphone: { $regex: search, $options: 'i' } },
        ];
      }
      if (!page && !limit) {
        query.active = true;
        return await this.services
          .find(query)
          .populate('vehicleId')
          .populate('clientId')
          .populate('quote')
          .populate('board')
          .populate({
            path: 'steps', // Primeiro, popula `steps` como um todo
            populate: {
              path: 'statusId', // Depois, popula `statusId` dentro de cada `step`
              model: 'ServiceStatus', // Confirme que o nome do modelo está correto
            },
          })
          .populate('mechanical')
          .exec();
      }

      limit = limit || 15;
      page = page || 1;
      const skip = (page - 1) * limit;
      const totalServices = (await this.services.countDocuments(query)) || 0;

      const services = await this.services
        .find(query)
        .populate('vehicleId')
        .populate('clientId')
        .populate('quote')
        .populate('board')
        .populate({
          path: 'steps', // Primeiro, popula `steps` como um todo
          populate: {
            path: 'statusId', // Depois, popula `statusId` dentro de cada `step`
            model: 'ServiceStatus', // Confirme que o nome do modelo está correto
          },
        })
        .populate('mechanical')
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(limit)
        .exec();

      return {
        data: services,
        total: totalServices,
        page,
        limit,
        totalPages: Math.ceil(totalServices / limit),
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      return await this.services
        .findById(id)
        .populate('vehicleId')
        .populate('clientId')
        .populate('quote')
        .populate('board')
        .populate({
          path: 'steps.statusId',
        })
        .exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateBoard(serviceId: string, newBoardId: string) {
    try {
      const service = await this.services.findById(serviceId);
      const oldBoard = await this.boards.findById(service.board);
      const newBoard = await this.boards.findById(newBoardId);

      console.log('service', service);
      console.log('oldBoard', oldBoard);
      console.log('newBoard', newBoard);

      if (
        oldBoard.name === 'Pendente' &&
        !['Orçamento aguardando', 'Cancelado'].includes(newBoard.name) &&
        !service.mechanical
      ) {
        throw new BadRequestException(
          `O serviço não pode ser movido para '${newBoard.name}' sem um mecânico responsável.`,
        );
      }

      await this.boards.findByIdAndUpdate(oldBoard._id, {
        $pull: { services: service._id },
      });

      await this.boards.findByIdAndUpdate(newBoard._id, {
        $push: { services: service._id },
      });

      return await this.services.findByIdAndUpdate(service._id, {
        board: newBoardId,
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async changeStepDoneStatus(serviceId: string, stepId: string) {
    try {
      const service = await this.services.findById(serviceId);
      const step = service.steps.find((s) => s.statusId.toString() === stepId);
      step.done = !step.done;
      return await service.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async remove(id: string) {
    try {
      this.boards.updateOne({ services: id }, { $pull: { services: id } });
      return await this.services.findByIdAndDelete(id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    try {
      return await this.services.findByIdAndUpdate(id, updateServiceDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
