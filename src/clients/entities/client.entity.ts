// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Vehicles } from 'src/vehicles/entities/vehicle.entity';

@Schema({ versionKey: false, timestamps: true, collection: 'clients' })
export class Client extends Document {
  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  cellphone: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: Vehicles.name }], default: [] })
  vehicles: Types.ObjectId[];
}

export const ClientSchema = SchemaFactory.createForClass(Client);
