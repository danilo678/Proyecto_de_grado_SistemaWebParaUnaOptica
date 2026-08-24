import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CrearUsuarioDto, ActualizarUsuarioDto } from './dto/usuario.dto';
import { RolesGuard } from '../comun/guards/roles.guard';
import { Roles } from '../comun/decorators/roles.decorator';

@ApiTags('Usuarios')
@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiBearerAuth()
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles('Administrador')
  @ApiOperation({ summary: 'Listar todos los usuarios' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string,
  ) {
    return this.usuariosService.findAll({ page, limit, search });
  }

  @Get(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findOne(id);
  }

  @Post()
  @Roles('Administrador')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  create(@Body() dto: CrearUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Put(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Actualizar un usuario' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: ActualizarUsuarioDto) {
    return this.usuariosService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Administrador')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remove(id);
  }
}
