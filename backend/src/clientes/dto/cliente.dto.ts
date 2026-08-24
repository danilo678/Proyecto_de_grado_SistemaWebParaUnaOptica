import { IsString, IsNotEmpty, IsOptional, IsIn, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const REGEX_CI = /^[0-9]{6,15}$/;
const REGEX_NOMBRE = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]+$/;
const REGEX_TELEFONO = /^[0-9]{6,15}$/;

export class CrearClienteDto {
  @ApiProperty({ example: '1234567' })
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX_CI, { message: 'El CI debe contener entre 6 y 15 números' })
  ci: string;

  @ApiProperty({ example: 'Carlos' })
  @IsString()
  @IsNotEmpty()
  @Matches(REGEX_NOMBRE, { message: 'El nombre solo acepta letras' })
  nombre: string;

  @ApiPropertyOptional({ example: 'Gómez' })
  @IsOptional()
  @IsString()
  @Matches(REGEX_NOMBRE, { message: 'El apellido solo acepta letras' })
  apellido?: string;

  @ApiPropertyOptional({ example: '70123456' })
  @IsOptional()
  @IsString()
  @Matches(REGEX_TELEFONO, { message: 'El teléfono debe contener entre 6 y 15 números' })
  telefono?: string;

  @ApiPropertyOptional({ example: 'M', enum: ['M', 'F'] })
  @IsOptional()
  @IsIn(['M', 'F'], { message: 'El sexo solo acepta M o F' })
  sexo?: string;
}

export class ActualizarClienteDto {
  @IsOptional()
  @IsString()
  @Matches(REGEX_CI, { message: 'El CI debe contener entre 6 y 15 números' })
  ci?: string;

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
  @Matches(REGEX_TELEFONO, { message: 'El teléfono debe contener entre 6 y 15 números' })
  telefono?: string;

  @IsOptional()
  @IsIn(['M', 'F'], { message: 'El sexo solo acepta M o F' })
  sexo?: string;
}
