import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoOdontologo } from '../odontologo.entity';
import { IsCelularEcuatoriano } from '../../common/validators/ecuador.validator';

export class UpdateOdontologoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  @IsCelularEcuatoriano()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsInt()
  especialidadId?: number;

  @IsOptional()
  @IsString()
  numeroRegistro?: string;

  @IsOptional()
  @IsEnum(EstadoOdontologo)
  estado?: EstadoOdontologo;
}