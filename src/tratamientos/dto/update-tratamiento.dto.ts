import { IsBoolean, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateTratamientoDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  costo?: number;

  @IsOptional()
  @IsNumber()
  tipoTratamientoId?: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}