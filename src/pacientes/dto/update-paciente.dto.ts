import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoPaciente, Genero } from '../paciente.entity';
import { IsCelularEcuatoriano } from '../../common/validators/ecuador.validator';

export class UpdatePacienteDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEnum(Genero)
  genero?: Genero;

  @IsOptional()
  @IsString()
  @IsCelularEcuatoriano()
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergias?: string[];

  @IsOptional()
  @IsEnum(EstadoPaciente)
  estado?: EstadoPaciente;
}