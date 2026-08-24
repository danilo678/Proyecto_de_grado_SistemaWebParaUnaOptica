import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Recibo } from './entities/recibo.entity';
import { Producto } from '../productos/entities/producto.entity';
import { CrearVentaDto } from './dto/venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private ventasRepo: Repository<Venta>,
    @InjectRepository(DetalleVenta)
    private detalleRepo: Repository<DetalleVenta>,
    @InjectRepository(Producto)
    private productosRepo: Repository<Producto>,
    private dataSource: DataSource,
  ) {}

  async findAll(query: { page?: number; limit?: number; fechaDesde?: string; fechaHasta?: string; clienteId?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.ventasRepo.createQueryBuilder('v')
      .leftJoinAndSelect('v.cliente', 'cliente')
      .leftJoinAndSelect('v.usuario', 'usuario')
      .leftJoinAndSelect('usuario.rol', 'rol')
      .leftJoinAndSelect('v.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto')
      .leftJoinAndSelect('v.recibo', 'recibo');

    if (query.fechaDesde) {
      qb.andWhere('v.fecha >= :fd', { fd: query.fechaDesde });
    }
    if (query.fechaHasta) {
      qb.andWhere("v.fecha < (:fh::date + INTERVAL '1 day')", { fh: query.fechaHasta });
    }
    if (query.clienteId) {
      qb.andWhere('v.clienteId = :cid', { cid: query.clienteId });
    }

    qb.orderBy('v.fecha', 'DESC').skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventasRepo.findOne({
      where: { id },
      relations: { cliente: true, usuario: { rol: true }, detalles: { producto: true }, recibo: true },
    });
    if (!venta) throw new NotFoundException(`Venta con id ${id} no encontrada`);
    return venta;
  }

  async create(dto: CrearVentaDto): Promise<Venta> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let subtotal = 0;
      const detalles: DetalleVenta[] = [];

      for (const det of dto.detalles) {
        const producto = await queryRunner.manager.findOne(Producto, { where: { id: det.productoId } });
        if (!producto) throw new BadRequestException(`Producto con id ${det.productoId} no encontrado`);
        if (producto.stock < det.cantidad) {
          throw new BadRequestException(`Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`);
        }

        producto.stock -= det.cantidad;
        await queryRunner.manager.save(producto);

        const detSubtotal = det.cantidad * det.precioUnitario;
        subtotal += detSubtotal;

        const detalle = queryRunner.manager.create(DetalleVenta, {
          productoId: det.productoId,
          cantidad: det.cantidad,
          precioUnitario: det.precioUnitario,
          subtotal: detSubtotal,
        });
        detalles.push(detalle);
      }

      const total = subtotal;

      const montoPagado = dto.montoPagado !== undefined && dto.montoPagado !== null
        ? Number(dto.montoPagado)
        : total;
      if (montoPagado < 0 || montoPagado > total) {
        throw new BadRequestException('El monto a cuenta no puede ser negativo ni mayor al total de la venta');
      }
      const saldo = Number((total - montoPagado).toFixed(2));

      const venta = queryRunner.manager.create(Venta, {
        clienteId: dto.clienteId,
        usuarioId: dto.usuarioId,
        metodoPago: dto.metodoPago || 'EFECTIVO',
        subtotal,
        total,
      });
      const savedVenta = await queryRunner.manager.save(venta);

      for (const det of detalles) {
        det.ventaId = savedVenta.id;
        await queryRunner.manager.save(det);
      }

      const recibo = queryRunner.manager.create(Recibo, {
        ventaId: savedVenta.id,
        numeroRecibo: `REC-${String(savedVenta.id).padStart(4, '0')}`,
        montoPagado,
        saldo,
        fechaEntrega: dto.fechaEntrega ? new Date(dto.fechaEntrega) : undefined,
      });
      await queryRunner.manager.save(recibo);

      await queryRunner.commitTransaction();
      return this.findOne(savedVenta.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async count(): Promise<number> {
    return this.ventasRepo.count();
  }

  async sumTotal(): Promise<number> {
    const result = await this.ventasRepo.createQueryBuilder('v')
      .select('COALESCE(SUM(v.total), 0)', 'sum')
      .getRawOne();
    return parseFloat(result.sum) || 0;
  }

  async ventasPorMes(): Promise<any[]> {
    return this.ventasRepo.createQueryBuilder('v')
      .select("TO_CHAR(v.fecha, 'YYYY-MM')", 'month')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COALESCE(SUM(v.total), 0)', 'total')
      .groupBy("TO_CHAR(v.fecha, 'YYYY-MM')")
      .orderBy("TO_CHAR(v.fecha, 'YYYY-MM')", 'DESC')
      .limit(12)
      .getRawMany();
  }

  async ventasPorUsuario(): Promise<any[]> {
    return this.ventasRepo.createQueryBuilder('v')
      .leftJoin('v.usuario', 'u')
      .select("CONCAT(u.nombre, ' ', u.apellido)", 'vendedor')
      .addSelect('COUNT(*)', 'totalVentas')
      .addSelect('COALESCE(SUM(v.total), 0)', 'montoTotal')
      .groupBy("u.nombre, u.apellido")
      .orderBy('SUM(v.total)', 'DESC')
      .getRawMany();
  }

  async productosMasVendidos(limit = 10): Promise<any[]> {
    return this.detalleRepo.createQueryBuilder('d')
      .leftJoin('d.producto', 'p')
      .select('p.nombre', 'nombre')
      .addSelect('SUM(d.cantidad)', 'totalVendido')
      .addSelect('SUM(d.subtotal)', 'totalIngresos')
      .groupBy('p.nombre')
      .orderBy('SUM(d.cantidad)', 'DESC')
      .limit(limit)
      .getRawMany();
  }
}
