// src/tenant/tenant.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Tenant extends Document {
  @Prop({ required: true, unique: true })
  subdomain: string;

  @Prop({ required: true })
  workshopName: string;

  @Prop({ required: true })
  adminName: string;

  @Prop({ required: true })
  adminEmail: string;

  @Prop({ required: true })
  adminPassword: string;

  @Prop({ required: true })
  verificationToken: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);
