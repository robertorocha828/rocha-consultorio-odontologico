import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateNotificacionDto {
  @IsNotEmpty()
  @IsString()
  destinatario?: string;

  @IsNotEmpty()
  @IsString()
  asunto?: string;

  @IsNotEmpty()
  @IsString()
  mensaje?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsString()
  tipo?: string;

}
