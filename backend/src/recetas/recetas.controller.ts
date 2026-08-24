import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { RecetasService } from './recetas.service';
import { CrearRecetaDto, ActualizarRecetaDto } from './dto/receta.dto';
import { RolesGuard } from '../comun/guards/roles.guard';
import { Roles } from '../comun/decorators/roles.decorator';

@ApiTags('Recetas')
@Controller('prescriptions')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Get()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Listar recetas' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'clienteId', required: false })
  findAll(@Query('page') page?: number, @Query('limit') limit?: number, @Query('clienteId') clienteId?: number) {
    return this.recetasService.findAll({ page, limit, clienteId });
  }

  @Get(':id')
  @Roles('Administrador', 'Vendedor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.findOne(id);
  }

  @Post()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Crear receta' })
  create(@Body() dto: CrearRecetaDto) {
    return this.recetasService.create(dto);
  }

  @Put(':id')
  @Roles('Administrador')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarRecetaDto) {
    return this.recetasService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.remove(id);
  }
}
