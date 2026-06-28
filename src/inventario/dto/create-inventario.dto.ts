import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateInventarioDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  nombre: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  categoria?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  cantidad: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  stockMinimo?: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precioUnitario: number;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}