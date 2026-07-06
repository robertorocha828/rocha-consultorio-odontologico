import { IsInt, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SuperficiesDto } from './create-odontograma.dto';

export class UpdateDienteDto {
  @IsInt() @Min(11) @Max(85) numero?: number;

  @IsOptional()
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