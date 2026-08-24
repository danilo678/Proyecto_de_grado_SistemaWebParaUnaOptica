import { IsNumber, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearDetalleVentaDto {
  @ApiProperty()
  @IsNumber()
  productoId: number;

  @ApiProperty({ default: 1 })
  @IsNumber()
  cantidad: number;

  @ApiProperty()
  @IsNumber()
  precioUnitario: number;
}

export class CrearVentaDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  clienteId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  usuarioId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metodoPago?: string;

  @ApiPropertyOptional({ description: 'Monto entregado al momento de la venta. Si se omite, se asume pago total' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  montoPagado?: number;

  @ApiPropertyOptional({ description: 'Fecha de entrega comprometida (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  fechaEntrega?: string;

  @ApiProperty({ type: [CrearDetalleVentaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearDetalleVentaDto)
  detalles: CrearDetalleVentaDto[];
}
