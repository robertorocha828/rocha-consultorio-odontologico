import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoCita } from '../cita.entity';

export class CreateCitaDto {
  @IsNotEmpty()
  @IsString()
  pacienteId?: string;

  @IsOptional()
  @IsEmail()
  emailPaciente?: string;

  @IsOptional()
  @IsString()
  odontologoId?: string;

  @IsNotEmpty()
  @IsDateString()
  fechaHora?: Date;

  @IsNotEmpty()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
