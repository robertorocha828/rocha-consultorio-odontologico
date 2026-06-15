import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DienteDto } from './diente.dto';

export class CreateOdontogramaDto {
  @IsNotEmpty()
  @IsString()
  pacienteId: string;

  @IsNotEmpty()
  @IsDateString()
  fechaEvaluacion: Date;

  @IsNotEmpty()
  @IsString()
  odontologoId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DienteDto)
  dientes: DienteDto[];

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  observacionesGenerales?: string;
}
