import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateTratamientoDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  costo: number;

  @IsNotEmpty()
  @IsNumber()
  tipoTratamientoId: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}