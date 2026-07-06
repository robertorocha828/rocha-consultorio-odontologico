import {IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty,IsOptional, IsString, Max, Min, ValidateNested,} from 'class-validator';
import { Type } from 'class-transformer';

export enum EstadoSuperficie {
  SANO     = 'sano',
  CARIES   = 'caries',
  OBTURADO = 'obturado',
  FRACTURA = 'fractura',
  AUSENTE  = 'ausente',
}

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

class DienteDto {
  @IsNotEmpty() 
  @IsInt() 
  @Min(11) 
  @Max(85) 
  numero?: number;

  @ValidateNested() 
  @Type(() => SuperficiesDto)
  superficies?: SuperficiesDto;

  @IsOptional() 
  @IsString() 
  estadoGeneral?: string;

  @IsOptional() 
  @IsString() 
  observaciones?: string;
}

export class CreateOdontogramaDto {
  @IsNotEmpty() 
  @IsString() 
  pacienteId?: string;

  @IsNotEmpty() 
  @IsDateString() 
  fechaEvaluacion?: Date;

  @IsNotEmpty() 
  @IsString() 
  odontologoId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DienteDto)
  dientes?: DienteDto[];

  @IsOptional() 
  @IsString() 
  estado?: string;

  @IsOptional() 
  @IsString() 
  observacionesGenerales?: string;
}