// src/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { userRoles } from '../types/users.types';
import { registerStatus } from 'src/types/common.types';
import { Tenant } from 'src/tenants/entities/tenant.schema';

@Schema({ timestamps: true, versionKey: false })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: userRoles;

  @Prop({})
  status: registerStatus;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: Tenant.name })
  tenant: Types.ObjectId;

  @Prop()
  verificationToken: string;

  @Prop({ default: false })
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
