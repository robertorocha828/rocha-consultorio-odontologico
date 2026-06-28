import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFacturaDto {
  @IsNotEmpty()
  @IsString()
  numero?: string;

  @IsUUID()
  pacienteId?: string;

  @IsOptional()
  @IsUUID()
  pagoId?: string;

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