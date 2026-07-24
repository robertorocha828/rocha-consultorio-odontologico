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
import { IsCedulaEcuatoriana, IsCelularEcuatoriano } from '../../common/validators/ecuador.validator';

export class CreatePacienteDto {
  @IsNotEmpty()
  @IsString()
  @IsCedulaEcuatoriana()
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
  @IsCelularEcuatoriano()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergias?: string[];
}