import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { TenantModule } from 'src/tenants/tenant.module';
import { User, UserSchema } from 'src/users/entities/user.entity';
import { Quote, QuoteSchema } from './entities/quote.entity';
import { QuotesController } from './quotes.controller';
import { QuotesService } from './quotes.service';

@Module({
  imports: [
    TenantModule,
    JwtModule,
    CloudinaryModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Quote.name, schema: QuoteSchema },
    ]),
  ],
  controllers: [QuotesController],
  providers: [
    QuotesService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.quotesModel,
    tenantModels.stockModel,
    tenantModels.clientModel,
    tenantModels.vehicleModel,
    tenantModels.serviceStatusModel,
    tenantModels.userModel,
    tenantModels.servicesModel,
    tenantModels.boardsModel,
  ],
})
export class QuotesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(QuotesController);
  }
}
