import { IsNumber, IsNotEmpty, IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearRecetaDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clinicaExterna?: string;

  @IsOptional()
  @IsNumber()
  esferaOd?: number;

  @IsOptional()
  @IsNumber()
  cilindroOd?: number;

  @IsOptional()
  @IsNumber()
  ejeOd?: number;

  @IsOptional()
  @IsNumber()
  addOd?: number;

  @IsOptional()
  @IsNumber()
  dpOd?: number;

  @IsOptional()
  @IsNumber()
  esferaOs?: number;

  @IsOptional()
  @IsNumber()
  cilindroOs?: number;

  @IsOptional()
  @IsNumber()
  ejeOs?: number;

  @IsOptional()
  @IsNumber()
  addOs?: number;

  @IsOptional()
  @IsNumber()
  dpOs?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class ActualizarRecetaDto extends CrearRecetaDto {}
