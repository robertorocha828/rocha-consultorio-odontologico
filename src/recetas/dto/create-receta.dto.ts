import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class MedicamentoDto {
  @IsNotEmpty()
  @IsString()
  medicamento: string;

  @IsNotEmpty()
  @IsString()
  dosis: string;

  @IsOptional()
  @IsString()
  indicaciones?: string;
}

export class CreateRecetaDto {
  @IsNotEmpty()
  @IsString()
  pacienteId: string;

  @IsNotEmpty()
  @IsString()
  odontologoId: string;

  @IsNotEmpty()
  @IsDateString()
  fechaEmision: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicamentoDto)
  medicamentos: MedicamentoDto[];

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}