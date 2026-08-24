import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CrearClienteDto, ActualizarClienteDto } from './dto/cliente.dto';
import { RolesGuard } from '../comun/guards/roles.guard';
import { Roles } from '../comun/decorators/roles.decorator';

@ApiTags('Clientes')
@Controller('clients')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Listar clientes' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('search') search?: string) {
    return this.clientesService.findAll({ page, limit, search });
  }

  @Get(':id')
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Obtener cliente por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.findOne(id);
  }

  @Post()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Crear cliente' })
  create(@Body() dto: CrearClienteDto) {
    return this.clientesService.create(dto);
  }

  @Put(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Actualizar cliente' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarClienteDto) {
    return this.clientesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar cliente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(id);
  }
}
