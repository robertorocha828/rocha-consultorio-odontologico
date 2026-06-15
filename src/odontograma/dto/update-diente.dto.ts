import {
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SuperficiesDto } from './superficies.dto';

export class UpdateDienteDto {
  @IsNotEmpty()
  @IsInt()
  @Min(11)
  @Max(85)
  numero?: number;

  @ValidateNested()
  @Type(() => SuperficiesDto)
  superficies?: SuperficiesDto;

  @IsString()
  estadoGeneral?: string;

  @IsString()
  observaciones?: string;
}
