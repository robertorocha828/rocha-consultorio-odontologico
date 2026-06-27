import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRolDto {
  @IsNotEmpty()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}
