import { IsOptional, IsString } from 'class-validator';

export class UpdateNotificacionDto {
  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  tipo?: string;
}
