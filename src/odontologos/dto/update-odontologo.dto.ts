import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoOdontologo } from '../odontologo.entity';

export class UpdateOdontologoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
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