// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Vehicles extends Document {
  @Prop({ default: true })
  active: boolean;

  @Prop()
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Client' })
  owner: Types.ObjectId;

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  carModel: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  color: string;

  @Prop({ required: true, unique: true })
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

export const VehicleSchema = SchemaFactory.createForClass(Vehicles);
