// src/stock.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Stock extends Document {
  @Prop({ required: true, default: true })
  active: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  costPrice: number;

  @Prop({ required: true })
  profitPercent: number;

  @Prop()
  sellingPrice: number;

  @Prop({ required: true, default: 0 })
  quantity: number;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  category: string;

  @Prop()
  subCategory: string;

  @Prop()
  brand: string;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

StockSchema.pre<Stock>('save', function (next) {
  const price = this.costPrice + this.costPrice * (this.profitPercent / 100);
  const decimal = price.toFixed(2);

  this.sellingPrice = +decimal;

  next();
});
