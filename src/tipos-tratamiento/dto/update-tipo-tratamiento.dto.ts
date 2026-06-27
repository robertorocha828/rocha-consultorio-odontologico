import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTipoTratamientoDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  nombre?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}