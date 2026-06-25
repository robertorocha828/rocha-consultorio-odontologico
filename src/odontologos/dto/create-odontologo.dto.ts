import {
  IsEmail,
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

  @IsNotEmpty()
  @IsString()
  especialidad?: string;

  @IsNotEmpty()
  @IsString()
  numeroRegistro?: string;
}