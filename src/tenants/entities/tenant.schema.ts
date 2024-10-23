// src/tenant/tenant.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { plans } from '../types/tenant.interface';

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

  @Prop()
  plan: plans;

  @Prop()
  nextPaymentDate: Date;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

// Pre-save hook to set the default value for freeTrialEnds if plan is 'free-trial'
TenantSchema.pre<Tenant>('save', function (next) {
  if (this.plan === 'free-trial' && !this.nextPaymentDate) {
    this.nextPaymentDate = new Date(Date.now() + 31 * 24 * 60 * 60 * 1000); // 30 days from now
  }
  next();
});
