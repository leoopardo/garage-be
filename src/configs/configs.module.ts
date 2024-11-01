import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { TenantModule } from 'src/tenants/tenant.module';
import { UsersModule } from 'src/users/users.module';
import { ConfigsController } from './configs.controller';

@Module({
  imports: [TenantModule, JwtModule, UsersModule],
  controllers: [ConfigsController],
  providers: [
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.userModel,
  ],
})
export class ConfigsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(ConfigsController);
  }
}
