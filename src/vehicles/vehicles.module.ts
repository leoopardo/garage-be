import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TenantModule, JwtModule],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    tenantConnectionProviders,
    tenantModels.configsModel,
  ],
})
export class VehiclesModule {}
