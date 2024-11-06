import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId, Types } from 'mongoose';
import { Client } from 'src/clients/entities/client.entity';
import { ServiceStatus } from 'src/service-status/entities/service-status.entity';
import { Service } from 'src/services/entities/service.entity';
import { Stock } from 'src/stock/entities/stock.entity';
import { User } from 'src/users/entities/user.entity';
import { Vehicles } from 'src/vehicles/entities/vehicle.entity';

export class QuoteStatus {
  static readonly PENDING = 'pending';
  static readonly APPROVED = 'approved';
  static readonly REJECTED = 'rejected';
}

@Schema({ timestamps: true, versionKey: false })
export class Quote extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Vehicles.name })
  vehichleId: ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Client.name })
  clientId: ObjectId;

  @Prop({ required: true, type: [Types.ObjectId], ref: Stock.name })
  itens: Types.ObjectId[];

  @Prop({ required: true, type: [Types.ObjectId], ref: ServiceStatus.name })
  steps: Types.ObjectId[];

  @Prop({ required: true })
  laborCost: number;

  @Prop()
  total: number;

  @Prop()
  serviceOrderDocument: string;

  @Prop({ required: true, default: QuoteStatus.PENDING })
  status: QuoteStatus;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  responsible: Types.ObjectId;
}

export const QuoteSchema = SchemaFactory.createForClass(Quote);

QuoteSchema.pre<Quote>('save', async function (next) {
  await this.populate('itens');
  await this.populate('steps');
  console.log(this.steps);

  this.total = this.itens.reduce(
    (acc, item: any) => acc + item.sellingPrice,
    0,
  );
  this.total += this.laborCost;

  next();
});
