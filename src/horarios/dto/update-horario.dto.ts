import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { DiaSemana } from '../horario.entity';

export class UpdateHorarioDto {
  @IsOptional()
  @IsEnum(DiaSemana)
  dia?: DiaSemana;

  @IsOptional()
  @IsString()
  horaInicio?: string;

  @IsOptional()
  @IsString()
  horaFin?: string;
}