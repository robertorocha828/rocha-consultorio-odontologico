import { IsEnum, IsOptional } from 'class-validator';
import { EstadoSuperficie } from '../schemas/odontograma.schema';

export class SuperficiesDto {
  @IsOptional()
  @IsEnum(EstadoSuperficie)
  vestibular?: string;

  @IsOptional()
  @IsEnum(EstadoSuperficie)
  distal?: string;

  @IsOptional()
  @IsEnum(EstadoSuperficie)
  lingual?: string;

  @IsOptional()
  @IsEnum(EstadoSuperficie)
  mesial?: string;

  @IsOptional()
  @IsEnum(EstadoSuperficie)
  oclusal?: string;
}
