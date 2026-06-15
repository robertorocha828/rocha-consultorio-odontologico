import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum EstadoSuperficie {
  SANO = 'sano',
  CARIES = 'caries',
  OBTURADO = 'obturado',
  FRACTURA = 'fractura',
  AUSENTE = 'ausente',
}

@Schema({ _id: false })
export class Superficies {
  @Prop({ required: true, default: EstadoSuperficie.SANO })
  vestibular?: string;

  @Prop({ required: true, default: EstadoSuperficie.SANO })
  distal?: string;

  @Prop({ required: true, default: EstadoSuperficie.SANO })
  lingual?: string;

  @Prop({ required: true, default: EstadoSuperficie.SANO })
  mesial?: string;

  @Prop({ required: true, default: EstadoSuperficie.SANO })
  oclusal?: string;
}
export const SuperficiesSchema = SchemaFactory.createForClass(Superficies);

@Schema({ _id: false })
export class Diente {
  @Prop({ required: true })
  numero?: number;

  @Prop({ type: SuperficiesSchema, required: true })
  superficies?: Superficies;

  @Prop({ default: 'presente' })
  estadoGeneral?: string;

  @Prop({ default: '' })
  observaciones?: string;
}
export const DienteSchema = SchemaFactory.createForClass(Diente);

@Schema({ timestamps: true })
export class Odontograma extends Document {
  @Prop({ required: true, index: true })
  pacienteId?: string;

  @Prop({ required: true })
  fechaEvaluacion?: Date;

  @Prop({ required: true })
  odontologoId?: string;

  @Prop({ type: [DienteSchema], required: true, default: [] })
  dientes?: Diente[];

  @Prop({ default: 'activo' })
  estado?: string;

  @Prop({ default: '' })
  observacionesGenerales?: string;
}
export const OdontogramaSchema = SchemaFactory.createForClass(Odontograma);
