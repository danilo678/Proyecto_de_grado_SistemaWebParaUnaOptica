import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Usuario) private usuariosRepo: Repository<Usuario>,
    @InjectRepository(Cliente) private clientesRepo: Repository<Cliente>,
    @InjectRepository(Producto) private productosRepo: Repository<Producto>,
    @InjectRepository(Receta) private recetasRepo: Repository<Receta>,
    @InjectRepository(Venta) private ventasRepo: Repository<Venta>,
    @InjectRepository(OrdenTrabajo) private ordenesTrabajoRepo: Repository<OrdenTrabajo>,
  ) {}

  async getStats() {
    const [
      totalUsuarios,
      totalClientes,
      totalProductos,
      totalRecetas,
      totalVentas,
      totalOrdenesTrabajo,
      ventasHoy,
      ordenesPendientes,
      productosBajoStock,
    ] = await Promise.all([
      this.usuariosRepo.count(),
      this.clientesRepo.count(),
      this.productosRepo.count(),
      this.recetasRepo.count(),
      this.ventasRepo.count(),
      this.ordenesTrabajoRepo.count(),
      this.ventasRepo.createQueryBuilder('v')
        .where('DATE(v.fecha) = CURRENT_DATE')
        .getCount(),
      this.ordenesTrabajoRepo.count({ where: { estado: 'PENDIENTE' } }),
      this.productosRepo.createQueryBuilder('p')
        .where('p.stock <= p.stockMinimo')
        .getCount(),
    ]);

    const totalIngresos = await this.ventasRepo.createQueryBuilder('v')
      .select('COALESCE(SUM(v.total), 0)', 'sum')
      .getRawOne();

    const ingresosHoy = await this.ventasRepo.createQueryBuilder('v')
      .select('COALESCE(SUM(v.total), 0)', 'sum')
      .where('DATE(v.fecha) = CURRENT_DATE')
      .getRawOne();

    const ventasRecientes = await this.ventasRepo.find({
      order: { fecha: 'DESC' },
      take: 5,
      relations: { cliente: true, usuario: true },
    });

    const productosBajoStockLista = await this.productosRepo.find({
      order: { stock: 'ASC' },
      take: 5,
      relations: { categoria: true },
    });

    return {
      totalUsuarios,
      totalClientes,
      totalProductos,
      totalRecetas,
      totalVentas,
      totalOrdenesTrabajo,
      ventasHoy,
      ordenesPendientes,
      totalIngresos: parseFloat(totalIngresos.sum) || 0,
      ingresosHoy: parseFloat(ingresosHoy.sum) || 0,
      productosBajoStock,
      ventasRecientes,
      productosBajoStockLista: productosBajoStockLista.filter(p => p.stock <= p.stockMinimo),
    };
  }
}
