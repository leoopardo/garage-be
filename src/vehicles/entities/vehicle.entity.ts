// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Vehicle extends Document {
  // aqui vai ser um objectId que vai referenciar a tabela de clientes
  @Prop({ required: true })
  owner: string;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  carModel: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  color: string;

  @Prop({ required: true })
  licensePlate: string;

  @Prop()
  kilometers: number;

  // aqui vai ser uma array objectId que vai referenciar a tabela de serviços
  @Prop({ default: [] })
  servicesHistory: string[];

  @Prop({
    type: [
      {
        nextOilChange: { type: Date, required: false },
        nextOilFilterChange: { type: Date, required: Date },
        nextReview: { type: Date, required: false },
      },
    ],
  })
  nextMaintenences: {
    nextOilChange: Date;
    nextOilFilterChange: Date;
    nextReview: Date;
  };
}

export const ConfigSchema = SchemaFactory.createForClass(Vehicle);
