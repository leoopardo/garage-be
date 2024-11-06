// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Service } from 'src/services/entities/service.entity';

@Schema({ timestamps: true, versionKey: false })
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  statusColor: string;

  @Prop({ type: [Types.ObjectId], ref: Service.name })
  services: Types.ObjectId[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
