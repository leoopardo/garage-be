// src/cloudinary/cloudinary.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { v2 as cloudinary } from 'cloudinary';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'CLOUDINARY',
      useFactory: async (configService: ConfigService) => {
        cloudinary.config({
          cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
          api_key: configService.get<string>('CLOUDINARY_API_KEY'),
          api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
        });
        return cloudinary;
      },
      inject: [ConfigService],
    },
    CloudinaryService,
  ],
  exports: ['CLOUDINARY', CloudinaryService],
})
export class CloudinaryModule {}
