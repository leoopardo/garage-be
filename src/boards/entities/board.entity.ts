// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  statusColor: string;

  @Prop()
  services: string[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
