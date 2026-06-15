import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Genero } from '../paciente.entity';

export class CreatePacienteDto {
  @IsNotEmpty()
  @IsString()
  cedula?: string;

  @IsNotEmpty()
  @IsString()
  nombre?: string;

  @IsNotEmpty()
  @IsString()
  apellido?: string;

  @IsNotEmpty()
  @IsDateString()
  fechaNacimiento?: Date;

  @IsNotEmpty()
  @IsEnum(Genero)
  genero?: Genero;

  @IsNotEmpty()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergias?: string[];
}
