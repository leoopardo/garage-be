// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Board } from 'src/boards/entities/board.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Mechanical } from 'src/mechanicals/entities/mechanical.entity';
import { Quote } from 'src/quotes/entities/quote.entity';
import { ServiceStatus } from 'src/service-status/entities/service-status.entity';
import { Vehicles } from 'src/vehicles/entities/vehicle.entity';

@Schema({ _id: false }) // Define como subdocumento, sem _id separado
class Step {
  @Prop({ required: true, type: Types.ObjectId, ref: ServiceStatus.name })
  statusId: Types.ObjectId;

  @Prop({ default: false })
  done: boolean;
}

const StepSchema = SchemaFactory.createForClass(Step);

@Schema({ timestamps: true, versionKey: false })
export class Service extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: Vehicles.name })
  vehicleId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Client.name })
  clientId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: Quote.name })
  quote: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Board?.name || 'Board' })
  board: Types.ObjectId;

  @Prop({ required: true, type: [StepSchema] }) // Usa o schema de subdocumento
  steps: Step[];

  @Prop({ type: Types.ObjectId, ref: ServiceStatus.name })
  currentStep: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Mechanical.name })
  mechanical: Types.ObjectId;

  @Prop()
  endDate: Date;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
