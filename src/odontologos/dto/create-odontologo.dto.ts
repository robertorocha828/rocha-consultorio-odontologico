import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateOdontologoDto {
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

  // Se genera automáticamente en el backend si no se envía.
  @IsOptional()
  @IsString()
  numeroRegistro?: string;
}