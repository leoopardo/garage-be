import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TenantProvider } from 'src/providers/tenant-model.provider';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Quote } from './entities/quote.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Config } from 'src/configs/entities/config.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { Client } from 'src/clients/entities/client.entity';

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

      return await this.quotes.create({
        ...createQuoteDto,
        serviceOrderDocument: serviceOrder,
      });

      // const newQuote = await this.quotes.create(createQuoteDto);
    } catch (error) {
      console.error('Error creating quote', error);
    }
  }

  async findAll() {
    return `This action returns all quotes`;
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
