import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { tenantConnectionProviders } from 'src/providers/tenant-connection.provider';
import { tenantModels } from 'src/providers/tenant-model.provider';
import { TenantMiddleware } from 'src/tenants/tenant.middleware';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TenantModule } from 'src/tenants/tenant.module';

@Module({
  imports: [TenantModule],
  controllers: [AuthController],
  providers: [AuthService, tenantConnectionProviders, tenantModels.userModel],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes(AuthController);
  }
}
