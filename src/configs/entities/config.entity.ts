// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { plans } from 'src/tenants/types/tenant.interface';
import { User } from 'src/users/entities/user.entity';
import { CreditCard } from '../dto/create-config.dto';

@Schema({ timestamps: true, versionKey: false })
export class Config extends Document {
  @Prop({ default: 'config' })
  module: string;

  @Prop({ required: true })
  subdomain: string;

  @Prop({ required: true })
  workshopName: string;

  @Prop({ required: true })
  plan: plans;

  @Prop({ required: true })
  nextPaymentDate: Date;

  @Prop({ type: Types.ObjectId, ref: User.name })
  admin: Types.ObjectId;

  @Prop({
    type: {
      number: { type: String, required: true },
      cvv: { type: String, required: true },
      expirationDate: { type: String, required: true },
      holderName: { type: String, required: true },
      holderDocument: { type: String, required: true },
    },
  })
  creditCardData: CreditCard;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
