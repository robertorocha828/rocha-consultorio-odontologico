import {
  IsDateString, IsNotEmpty, IsOptional, IsString,
} from 'class-validator';

export class CreateHistorialClinicoDto {
  @IsNotEmpty()
  @IsString()
  pacienteId?: string;

  @IsNotEmpty()
  @IsString()
  odontologoId?: string;

  @IsOptional()
  @IsString()
  citaId?: string;

  @IsNotEmpty()
  @IsDateString()
  fechaConsulta?: Date;

  @IsNotEmpty()
  @IsString()
  motivoConsulta?: string;

  @IsNotEmpty()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsString()
  procedimientosRealizados?: string;

  @IsOptional()
  @IsString()
  proximaVisita?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
