import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateFacturaDto {
  @IsNotEmpty()
  @IsString()
  numero?: string;

  @IsNotEmpty()
  @IsString()
  pacienteId?: string;

  @IsNotEmpty()
  @IsNumber()
  subtotal?: number;

  @IsNotEmpty()
  @IsNumber()
  total?: number;

  @IsOptional()
  @IsString()
  observaciones?: string;
}