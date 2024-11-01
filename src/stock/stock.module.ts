import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TenantModule, JwtModule],
  controllers: [StockController],
  providers: [
    StockService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.stockModel,
  ],
})
export class StockModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(StockController);
  }
}
