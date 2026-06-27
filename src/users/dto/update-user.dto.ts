import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(['admin', 'usuario'])
  rol?: string;

  @IsOptional()
  @IsBoolean()
  activo?: boolean;
}
