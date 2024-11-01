import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TenantModule, JwtModule],
  controllers: [ServicesController],
  providers: [
    ServicesService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.servicesModel,
  ],
})
export class ServicesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(ServicesController);
  }
}
