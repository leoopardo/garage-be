import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ServiceStatusService } from './service-status.service';
import { ServiceStatusController } from './service-status.controller';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';

@Module({
  imports: [TenantModule, JwtModule],
  controllers: [ServiceStatusController],
  providers: [
    ServiceStatusService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.serviceStatusModel,
  ],
})
export class ServiceStatusModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(ServiceStatusController);
  }
}
