// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false, collection: 'service-status' })
export class ServiceStatus extends Document {
  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;
}

export const ServiceStatusSchema = SchemaFactory.createForClass(ServiceStatus);
