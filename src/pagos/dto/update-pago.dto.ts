import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { EstadoPago, MetodoPago } from '../pago.entity';

export class UpdatePagoDto {
  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsOptional()
  @IsEnum(MetodoPago)
  metodoPago?: MetodoPago;

  @IsOptional()
  @IsEnum(EstadoPago)
  estado?: EstadoPago;

  @IsOptional()
  @IsString()
  observaciones?: string;
}