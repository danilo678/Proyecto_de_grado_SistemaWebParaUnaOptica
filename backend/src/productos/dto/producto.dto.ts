import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CrearProductoDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoriaId: number;

  @ApiProperty({ example: 'MON001' })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  marca?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ default: 0 })
  @IsNumber()
  precioCompra: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  precioVenta: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  stock: number;

  @ApiProperty({ default: 0 })
  @IsNumber()
  stockMinimo: number;
}

export class ActualizarProductoDto {
  @IsOptional()
  @IsNumber()
  categoriaId?: number;

  @IsOptional()
  @IsString()
  codigo?: string;

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsNumber()
  precioCompra?: number;

  @IsOptional()
  @IsNumber()
  precioVenta?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsNumber()
  stockMinimo?: number;

  @IsOptional()
  @IsBoolean()
  estado?: boolean;
}
