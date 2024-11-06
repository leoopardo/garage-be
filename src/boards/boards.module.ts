import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { TenantModule } from 'src/tenants/tenant.module';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [TenantModule, JwtModule],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    tenantConnectionProviders,
    tenantModels.configsModel,
    tenantModels.servicesModel,
    tenantModels.serviceStatusModel,
    tenantModels.boardsModel,
    tenantModels.quotesModel,
    tenantModels.clientModel,
    tenantModels.vehicleModel,
    tenantModels.mechanicalsModel,
  ],
})
export class BoardsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(BoardsController);
  }
}
