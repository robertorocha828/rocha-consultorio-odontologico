import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MedicamentoDto {
  @IsOptional()
  @IsString()
  medicamento?: string;

  @IsOptional()
  @IsString()
  dosis?: string;

  @IsOptional()
  @IsString()
  indicaciones?: string;
}

export class UpdateRecetaDto {
  @IsOptional()
  @IsString()
  pacienteId?: string;

  @IsOptional()
  @IsString()
  odontologoId?: string;

  @IsOptional()
  @IsDateString()
  fechaEmision?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicamentoDto)
  medicamentos?: MedicamentoDto[];

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}