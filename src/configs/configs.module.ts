import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { TenantModule } from 'src/tenants/tenant.module';
import { ConfigsController } from './configs.controller';
import { ConfigsService } from './configs.service';

@Module({
  imports: [TenantModule],
  controllers: [ConfigsController],
  providers: [
    ConfigsService,
    tenantConnectionProviders,
    tenantModels.configsModel,
  ],
})
export class ConfigsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(ConfigsController);
  }
}
