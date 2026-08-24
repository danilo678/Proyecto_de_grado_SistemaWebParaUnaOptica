import { IsNumber, IsOptional, IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export const ESTADOS_ORDEN = ['PENDIENTE', 'EN PROCESO', 'LISTO PARA ENTREGA', 'ENTREGADO'];

export class CrearOrdenTrabajoDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  recetaId?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  ventaId?: number;

  @ApiPropertyOptional({ example: '2026-07-25' })
  @IsOptional()
  @IsString()
  fechaEntrega?: string;

  @ApiPropertyOptional({ example: 'PENDIENTE', enum: ESTADOS_ORDEN })
  @IsOptional()
  @IsIn(ESTADOS_ORDEN)
  estado?: string;

  @ApiPropertyOptional({ example: 'Montaje de lentes progresivos' })
  @IsOptional()
  @IsString()
  observaciones?: string;
}

export class ActualizarOrdenTrabajoDto {
  @IsOptional()
  @IsNumber()
  clienteId?: number;

  @IsOptional()
  @IsNumber()
  recetaId?: number;

  @IsOptional()
  @IsNumber()
  ventaId?: number;

  @IsOptional()
  @IsString()
  fechaEntrega?: string;

  @IsOptional()
  @IsIn(ESTADOS_ORDEN)
  estado?: string;

  @IsOptional()
  @IsString()
  observaciones?: string;
}
