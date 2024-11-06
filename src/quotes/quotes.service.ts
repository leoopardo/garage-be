import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { Board } from 'src/boards/entities/board.entity';
import { Client } from 'src/clients/entities/client.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Config } from 'src/configs/entities/config.entity';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { ServiceStatus } from 'src/service-status/entities/service-status.entity';
import { Service } from 'src/services/entities/service.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { commonQueryParams } from 'src/types/common.types';
import { User } from 'src/users/entities/user.entity';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from './entities/quote.entity';

@Injectable()
export class QuotesService {
  constructor(
    @Inject(TenantProvider.quotesModel)
    private quotes: Model<Quote>,
    @Inject(TenantProvider.configsModel)
    private configs: Model<Config>,
    @Inject(TenantProvider.stockModel)
    private stock: Model<Stock>,
    @Inject(TenantProvider.clientModel)
    private client: Model<Client>,
    @Inject(TenantProvider.serviceStatusModel)
    private serviceStatus: Model<ServiceStatus>,
    @Inject(TenantProvider.userModel)
    private user: Model<User>,
    @Inject(TenantProvider.servicesModel)
    private service: Model<Service>,
    @Inject(TenantProvider.boardsModel)
    private board: Model<Board>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(createQuoteDto: CreateQuoteDto) {
    try {
      const config = await this.configs.findOne({ module: 'config' });

      const itemMap: Record<
        string,
        {
          description: string;
          quantity: number;
          unitPrice: number;
          total: number;
        }
      > = {};

      for (const itemId of createQuoteDto.itens) {
        const item = await this.stock.findById(itemId); // Presume que você tenha um método `findById` no seu stockService
        if (item) {
          if (itemMap[itemId]) {
            // Se o item já existe no map, aumente a quantidade e o total
            itemMap[itemId].quantity += 1;
            itemMap[itemId].total += item.sellingPrice; // Total = quantidade * preço unitário
          } else {
            // Caso contrário, adicione o item ao map
            itemMap[itemId] = {
              description: item.name,
              quantity: 1,
              unitPrice: item.sellingPrice,
              total: item.sellingPrice, // Inicialmente o total é igual ao preço unitário
            };
          }
        }
      }

      const items = Object.values(itemMap);

      const client = await this.client.findById(createQuoteDto.clientId); // Presume que você tenha um método `findById` no seu clientService

      const serviceOrder = await this.cloudinaryService.createAndUploadPdf({
        workshopName: config.workshopName,
        responsibleName: 'Fulano de Tal',
        clientName: client.name,
        date: new Date(),
        items,
        subtotal: items.reduce((acc, item) => acc + item.total, 0),
        laborCost: createQuoteDto.laborCost,
        total:
          items.reduce((acc, item) => acc + item.total, 0) +
          createQuoteDto.laborCost,
      });

      if (!serviceOrder) {
        throw new Error('Erro ao criar ordem de serviço');
      }

      const quote = await this.quotes.create({
        ...createQuoteDto,
        serviceOrderDocument: serviceOrder,
      });

      const service = await this.service.create({
        clientId: createQuoteDto.clientId,
        steps: createQuoteDto.steps.map((step) => ({
          statusId: new Types.ObjectId(step),
          done: false,
        })),
        vehicleId: quote.vehichleId,
        quote: `${quote._id}`,
        board: (await this.board.findOne({ name: 'Orçamento aguardando' }))._id,
      });

      await this.board
        .findOne({ name: 'Orçamento aguardando' })
        .updateOne({ $push: { services: service._id } });

      return quote;
      // const newQuote = await this.quotes.create(createQuoteDto);
    } catch (error) {
      console.error('Error creating quote', error);
    }
  }

  async findAll({ limit, page, search }: commonQueryParams) {
    try {
      const query: any = {};
      if (search) {
        query.$or = [];
      }
      if (!limit || !page) {
        return await this.quotes
          .find(query)
          .populate('itens')
          .populate('steps')
          .populate('responsible')
          .exec();
      }
      limit = limit || 15;
      page = page || 1;
      const skip = (page - 1) * limit;

      const totalQuotes = (await this.quotes.countDocuments(query)) || 0;

      const quotes = await this.quotes
        .find(query)
        .skip(skip)
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('itens')
        .populate('steps')
        .populate({
          path: 'responsible',
          select: '-password', // Exclui o campo password
        })
        .exec();

      return {
        data: quotes,
        total: totalQuotes,
        page: +page,
        limit: +limit,
        totalPages: Math.ceil(totalQuotes / limit),
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} quote`;
  }

  async update(id: number, updateQuoteDto: UpdateQuoteDto) {
    return `This action updates a #${id} quote`;
  }

  async remove(id: number) {
    return `This action removes a #${id} quote`;
  }
}
