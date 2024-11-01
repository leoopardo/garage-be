import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TenantModule, JwtModule],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.clientModel,
    tenantModels.vehicleModel,
  ],
})
export class ClientsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(ClientsController);
  }
}
