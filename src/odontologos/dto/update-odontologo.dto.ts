import {
  IsEmail,
  IsEnum,
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
  especialidad?: string;

  @IsOptional()
  @IsString()
  numeroRegistro?: string;

  @IsOptional()
  @IsEnum(EstadoOdontologo)
  estado?: EstadoOdontologo;
}