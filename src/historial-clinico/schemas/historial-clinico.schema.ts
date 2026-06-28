import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class HistorialClinico extends Document {
  @Prop({ required: true, index: true })
  pacienteId?: string;

  @Prop({ required: true })
  odontologoId?: string;

  @Prop({ nullable: true })
  citaId?: string;

  @Prop({ required: true })
  fechaConsulta?: Date;

  @Prop({ required: true })
  motivoConsulta?: string;

  @Prop({ required: true })
  diagnostico?: string;

  @Prop({ default: '' })
  procedimientosRealizados?: string;

  @Prop({ default: '' })
  proximaVisita?: string;

  @Prop({ default: '' })
  observaciones?: string;
}

export const HistorialClinicoSchema = SchemaFactory.createForClass(HistorialClinico);
