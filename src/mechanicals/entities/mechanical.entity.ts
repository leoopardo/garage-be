// src/config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Mechanical extends Document {
  @Prop({ default: true })
  active: boolean;

  @Prop({ required: true })
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop()
  profilePicture: string;

  @Prop()
  profileColor: string;

  @Prop({ required: true })
  cellphone: string;

  @Prop()
  startCompanyDate: Date;

  // Aqui vai ser array objectId que vai referenciar a tabela de serviços
  @Prop({ default: [] })
  servicesHistory: string[];
}

export const MechanicalSchema = SchemaFactory.createForClass(Mechanical);

// Define uma cor pastel aleatória para `profileColor` antes de salvar o documento
MechanicalSchema.pre<Mechanical>('save', function (next) {
  if (!this.profileColor) {
    // Gera uma cor pastel aleatória
    const pastelColor = () =>
      Math.floor(200 + Math.random() * 55)
        .toString(16)
        .padStart(2, '0');
    this.profileColor = `#${pastelColor()}${pastelColor()}${pastelColor()}`;
  }
  next();
});
