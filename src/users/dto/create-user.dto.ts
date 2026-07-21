import { IsEmail, IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  // Opcional: las cuentas creadas vía Google no tienen contraseña propia.
  @IsOptional()
  @IsString()
  password?: string;

  // El rol se valida contra el catálogo de roles (tabla "roles"), gestionado
  // directamente en backend, por eso aquí solo se exige que sea un string.
  @IsOptional()
  @IsString()
  rol?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;
}