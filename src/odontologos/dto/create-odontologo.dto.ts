import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { IsCedulaEcuatoriana, IsCelularEcuatoriano } from '../../common/validators/ecuador.validator';

export class CreateOdontologoDto {
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

<<<<<<< Updated upstream
  @IsNotEmpty()
=======
  @IsOptional()
>>>>>>> Stashed changes
  @IsString()
  numeroRegistro?: string;
}