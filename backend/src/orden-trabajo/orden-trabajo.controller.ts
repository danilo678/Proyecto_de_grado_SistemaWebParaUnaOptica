import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdenTrabajoService } from './orden-trabajo.service';
import { CrearOrdenTrabajoDto, ActualizarOrdenTrabajoDto } from './dto/orden-trabajo.dto';
import { RolesGuard } from '../comun/guards/roles.guard';
import { Roles } from '../comun/decorators/roles.decorator';

@ApiTags('Órdenes de Trabajo')
@Controller('work-orders')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class OrdenTrabajoController {
  constructor(private readonly ordenTrabajoService: OrdenTrabajoService) {}

  @Get()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Listar órdenes de trabajo' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'clienteId', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('estado') estado?: string,
    @Query('clienteId') clienteId?: number,
  ) {
    return this.ordenTrabajoService.findAll({ page, limit, estado, clienteId });
  }

  @Get(':id')
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Obtener orden de trabajo por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordenTrabajoService.findOne(id);
  }

  @Post()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Crear orden de trabajo' })
  create(@Body() dto: CrearOrdenTrabajoDto) {
    return this.ordenTrabajoService.create(dto);
  }

  @Put(':id')
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Actualizar orden de trabajo' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarOrdenTrabajoDto) {
    return this.ordenTrabajoService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar orden de trabajo' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordenTrabajoService.remove(id);
  }
}
