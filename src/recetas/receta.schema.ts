import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RecetaDocument = Receta & Document;

@Schema({ timestamps: true })
export class Receta {
  @Prop({ required: true })
  pacienteId: string;

  @Prop({ required: true })
  odontologoId: string;

  @Prop({ required: true })
  fechaEmision: Date;

  @Prop({ type: [{ medicamento: String, dosis: String, indicaciones: String }], default: [] })
  medicamentos: {
    medicamento: string;
    dosis: string;
    indicaciones: string;
  }[];

  @Prop({ default: '' })
  observaciones: string;

  @Prop({ default: 'activa' })
  estado: string;
}

export const RecetaSchema = SchemaFactory.createForClass(Receta);