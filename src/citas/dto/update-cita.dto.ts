import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoCita } from '../cita.entity';

export class UpdateCitaDto {
  @IsOptional()
  @IsString()
  odontologoId?: string;

  @IsOptional()
  @IsDateString()
  fechaHora?: Date;

  @IsOptional()
  @IsString()
  motivo?: string;

  @IsOptional()
  @IsEnum(EstadoCita)
  estado?: EstadoCita;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
