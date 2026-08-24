import {
  Controller, Get, Post, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VentasService } from './ventas.service';
import { CrearVentaDto } from './dto/venta.dto';
import { RolesGuard } from '../comun/guards/roles.guard';
import { Roles } from '../comun/decorators/roles.decorator';

@ApiTags('Ventas')
@Controller('sales')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Get()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Listar ventas' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'fechaDesde', required: false })
  @ApiQuery({ name: 'fechaHasta', required: false })
  @ApiQuery({ name: 'clienteId', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('clienteId') clienteId?: number,
  ) {
    return this.ventasService.findAll({ page, limit, fechaDesde, fechaHasta, clienteId });
  }

  @Get('reports/top-products')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Top productos vendidos' })
  @ApiQuery({ name: 'limit', required: false })
  productosMasVendidos(@Query('limit') limit?: number) {
    return this.ventasService.productosMasVendidos(limit);
  }

  @Get('reports/monthly')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Ventas por mes' })
  ventasPorMes() {
    return this.ventasService.ventasPorMes();
  }

  @Get('reports/by-user')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Ventas por usuario' })
  ventasPorUsuario() {
    return this.ventasService.ventasPorUsuario();
  }

  @Get(':id')
  @Roles('Administrador', 'Vendedor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ventasService.findOne(id);
  }

  @Post()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Crear venta' })
  create(@Body() dto: CrearVentaDto) {
    return this.ventasService.create(dto);
  }
}
