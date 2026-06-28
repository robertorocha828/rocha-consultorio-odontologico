import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MetodoPago } from '../pago.entity';

export class CreatePagoDto {
  @IsUUID()
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