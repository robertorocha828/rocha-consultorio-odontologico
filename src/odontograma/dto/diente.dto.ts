import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SuperficiesDto } from './superficies.dto';

export class DienteDto {
  @IsNotEmpty()
  @IsInt()
  @Min(11)   // FDI: inicia en 11
  @Max(85)   // FDI: última pieza primaria
  numero?: number;

  @IsNotEmpty()
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
