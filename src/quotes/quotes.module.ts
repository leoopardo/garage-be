import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [TenantModule, JwtModule, CloudinaryModule],
  controllers: [QuotesController],
  providers: [
    QuotesService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.quotesModel,
    tenantModels.stockModel,
    tenantModels.clientModel,
    tenantModels.vehicleModel,
  ],
})
export class QuotesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(QuotesController);
  }
}
