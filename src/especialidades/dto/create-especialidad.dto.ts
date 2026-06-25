import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty({ example: 'Ortodoncia', description: 'Nombre único de la especialidad' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la especialidad es obligatorio' })
  @MaxLength(100)
  nombre?: string;

  @ApiProperty({ example: 'Corrección de malposiciones dentales', required: false })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}