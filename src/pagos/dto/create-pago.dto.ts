import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MetodoPago } from '../pago.entity';

export class CreatePagoDto {
  @IsNotEmpty()
  @IsString()
  pacienteId?: string;

  @IsNotEmpty()
  @IsNumber()
  monto?: number;

  @IsNotEmpty()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;

  @IsOptional()
  @IsString()
  observaciones?: string;
}