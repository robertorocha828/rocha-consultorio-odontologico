import { IsOptional, IsString } from 'class-validator';

export class UpdateHistorialClinicoDto {
  @IsOptional()
  @IsString()
  diagnostico?: string;

  @IsOptional()
  @IsString()
  procedimientosRealizados?: string;

  @IsOptional()
  @IsString()
  proximaVisita?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
