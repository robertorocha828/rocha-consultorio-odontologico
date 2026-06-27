import {
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoConsultorio } from '../consultorio.entity';

export class UpdateConsultorioDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsEnum(EstadoConsultorio)
  estado?: EstadoConsultorio;
}