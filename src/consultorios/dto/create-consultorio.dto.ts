import {
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateConsultorioDto {
  @IsNotEmpty()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}