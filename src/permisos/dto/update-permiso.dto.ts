import { IsOptional, IsString } from 'class-validator';

export class UpdatePermisoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  rolId?: string;
}
