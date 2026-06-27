import {
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { DiaSemana } from '../horario.entity';

export class CreateHorarioDto {
  @IsNotEmpty()
  @IsEnum(DiaSemana)
  dia?: DiaSemana;

  @IsNotEmpty()
  @IsString()
  horaInicio?: string;

  @IsNotEmpty()
  @IsString()
  horaFin?: string;
}