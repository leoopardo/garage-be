// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { tenantConnectionProviders } from './providers/tenant-connection.provider';
import { tenantModels } from './providers/tenant-model.provider';
import { ValidationExceptionFilter } from './providers/validation-exception.filter';
import { TenantModule } from './tenants/tenant.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { MechanicalsModule } from './mechanicals/mechanicals.module';
import { ConfigsModule } from './configs/configs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('SMTP_HOST'),
          port: configService.get('SMTP_PORT'),
          secure: false, // true for 465, false for other ports
          auth: {
            user: configService.get('SMTP_USER'), // generated ethereal user
            pass: configService.get('SMTP_PASS'), // generated ethereal password
          },
        },
        defaults: {
          from: '"nest-modules" <noreply@localhost>', // outgoing email ID
        },
        template: {
          dir: process.cwd() + '/template/',
          adapter: new HandlebarsAdapter(), // or new PugAdapter()
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    TenantModule,
    UsersModule,
    AuthModule,
    JwtModule,
    VehiclesModule,
    MechanicalsModule,
    ConfigsModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    tenantConnectionProviders,
    tenantModels.userModel,
    tenantModels.configsModel,
    AuthService,
  ],
  controllers: [UsersController],
})
export class AppModule {}
