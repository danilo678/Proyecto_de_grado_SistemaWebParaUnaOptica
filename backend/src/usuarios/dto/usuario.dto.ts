import { IsString, IsNotEmpty, IsOptional, IsNumber, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const REGEX_CI = /^[0-9]{6,15}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/;
const REGEX_TELEFONO = /^[0-9]{6,15}$/;
const REGEX_LOGIN = /^[a-zA-Z0-9._]{3,50}$/;

export class CrearUsuarioDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX_NOMBRE, { message: 'El nombre solo acepta letras' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Pérez' })
  @IsOptional()
  @IsString()
  @Matches(REGEX_NOMBRE, { message: 'El apellido solo acepta letras' })
  apellido?: string;

  @ApiProperty({ example: '6687532' })
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX_CI, { message: 'El CI debe contener entre 6 y 15 números' })
  ci: string;

  @ApiProperty({ example: 'jperez' })
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX_LOGIN, { message: 'El usuario solo acepta letras, números, punto y guion bajo (3-50 caracteres)' })
  usuario: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: '70123456' })
  @IsOptional()
  @IsString()
  @Matches(REGEX_TELEFONO, { message: 'El teléfono debe contener entre 6 y 15 números' })
  telefono?: string;

  @ApiPropertyOptional({ example: 'Calle Principal #123' })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  rolId: number;
}

export class ActualizarUsuarioDto {
  @IsOptional()
  @IsString()
  @Matches(REGEX_NOMBRE, { message: 'El nombre solo acepta letras' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_NOMBRE, { message: 'El apellido solo acepta letras' })
  apellido?: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_CI, { message: 'El CI debe contener entre 6 y 15 números' })
  ci?: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_LOGIN, { message: 'El usuario solo acepta letras, números, punto y guion bajo (3-50 caracteres)' })
  usuario?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsString()
  @Matches(REGEX_TELEFONO, { message: 'El teléfono debe contener entre 6 y 15 números' })
  telefono?: string;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @IsNumber()
  rolId?: number;
}
