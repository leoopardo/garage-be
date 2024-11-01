import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Stock } from 'src/stock/entities/stock.entity';
import { User } from 'src/users/entities/user.entity';

export class QuoteStatus {
  static readonly PENDING = 'pending';
  static readonly APPROVED = 'approved';
  static readonly REJECTED = 'rejected';
}

@Schema({ timestamps: true, versionKey: false })
export class Quote extends Document {
  @Prop({ required: true })
  vehichleId: string;

  @Prop({ required: true })
  clientId: string;

  @Prop()
  serviceId: string;

  @Prop({ required: true, type: [Types.ObjectId], ref: Stock.name })
  itens: Types.ObjectId[];

  @Prop({ required: true })
  steps: { description: string; price: number }[];

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

  this.total = this.itens.reduce(
    (acc, item: any) => acc + item.sellingPrice,
    0,
  );
  this.total += this.laborCost;

  next();
});
