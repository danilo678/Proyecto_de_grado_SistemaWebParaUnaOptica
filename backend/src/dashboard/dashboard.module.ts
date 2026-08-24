import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Cliente, Producto, Receta, Venta, OrdenTrabajo])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
