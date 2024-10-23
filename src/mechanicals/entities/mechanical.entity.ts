// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { registerStatus } from 'src/types/common.types';

@Schema({ timestamps: true, versionKey: false })
export class Mechanical extends Document {
  @Prop()
  status: registerStatus;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop()
  profilePicture: string;

  @Prop({ required: true })
  cellphone: string;

  @Prop()
  startCompanyDate: Date;

  // aqui vai ser array objectId que vai referenciar a tabela de serviços
  @Prop({ default: [] })
  servicesHistory: string[];
}

export const MechanicalSchema = SchemaFactory.createForClass(Mechanical);
