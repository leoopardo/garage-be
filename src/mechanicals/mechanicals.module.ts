import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MechanicalsService } from './mechanicals.service';
import { MechanicalsController } from './mechanicals.controller';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';

@Module({
  imports: [TenantModule, JwtModule],
  controllers: [MechanicalsController],
  providers: [
    MechanicalsService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.mechanicalsModel,
  ],
})
export class MechanicalsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(MechanicalsController);
  }
}
