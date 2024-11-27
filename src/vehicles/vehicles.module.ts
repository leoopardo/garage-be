import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantModule } from 'src/tenants/tenant.module';
import { JwtModule } from '@nestjs/jwt';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { Mongoose } from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicles, VehicleSchema } from './entities/vehicle.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    TenantModule,
    JwtModule,
    CloudinaryModule,
    MongooseModule.forFeature([{ name: Vehicles.name, schema: VehicleSchema }]),
  ],
  controllers: [VehiclesController],
  providers: [
    VehiclesService,
    tenantConnectionProviders,
    tenantModels.clientModel,
    tenantModels.configsModel,
    tenantModels.vehicleModel,
  ],
})
export class VehiclesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(VehiclesController);
  }
}
