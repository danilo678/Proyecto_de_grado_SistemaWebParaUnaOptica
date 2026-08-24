import {
  Controller, Get, Post, Put, Delete, Body, Param, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { RolesGuard } from '../comun/guards/roles.guard';
import { Roles } from '../comun/decorators/roles.decorator';

@ApiTags('Categorías')
@Controller('categories')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  @Roles('Administrador', 'Vendedor')
  @ApiOperation({ summary: 'Listar categorías' })
  findAll() {
    return this.categoriasService.findAll();
  }

  @Get(':id')
  @Roles('Administrador', 'Vendedor')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.findOne(id);
  }

  @Post()
  @Roles('Administrador')
  @ApiOperation({ summary: 'Crear categoría' })
  create(@Body('nombre') nombre: string) {
    return this.categoriasService.create(nombre);
  }

  @Put(':id')
  @Roles('Administrador')
  update(@Param('id', ParseIntPipe) id: number, @Body('nombre') nombre: string) {
    return this.categoriasService.update(id, nombre);
  }

  @Delete(':id')
  @Roles('Administrador')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriasService.remove(id);
  }
}
