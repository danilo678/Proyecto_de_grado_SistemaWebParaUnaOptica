import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { DetalleVenta } from '../ventas/entities/detalle-venta.entity';
import { CrearProductoDto, ActualizarProductoDto } from './dto/producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private productosRepo: Repository<Producto>,
  ) {}

  async findAll(query: { page?: number; limit?: number; search?: string; categoriaId?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.productosRepo.createQueryBuilder('p')
      .leftJoinAndSelect('p.categoria', 'cat');

    if (query.search) {
      qb.where('(p.nombre ILIKE :s OR p.codigo ILIKE :s OR p.marca ILIKE :s)', { s: `%${query.search}%` });
    }
    if (query.categoriaId) {
      qb.andWhere('p.categoriaId = :cid', { cid: query.categoriaId });
    }

    qb.orderBy('p.id', 'DESC').skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Producto> {
    const product = await this.productosRepo.findOne({ where: { id }, relations: { categoria: true } });
    if (!product) throw new NotFoundException(`Producto con id ${id} no encontrado`);
    return product;
  }

  async create(dto: CrearProductoDto): Promise<Producto> {
    const existingCodigo = await this.productosRepo.findOne({ where: { codigo: dto.codigo } });
    if (existingCodigo) throw new ConflictException('Ya existe un producto con ese código');
    const product = this.productosRepo.create(dto);
    const saved = await this.productosRepo.save(product);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: ActualizarProductoDto): Promise<Producto> {
    const product = await this.findOne(id);

    if (dto.codigo) {
      const dupCodigo = await this.productosRepo.findOne({ where: { codigo: dto.codigo } });
      if (dupCodigo && dupCodigo.id !== id) throw new ConflictException('Ya existe un producto con ese código');
    }

    Object.assign(product, dto);
    await this.productosRepo.save(product);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);

    const detallesCount = await this.productosRepo.manager.count(DetalleVenta, { where: { productoId: id } });
    if (detallesCount > 0) {
      throw new ConflictException('No se puede eliminar el producto porque tiene ventas registradas');
    }

    await this.productosRepo.remove(product);
  }

  async count(): Promise<number> {
    return this.productosRepo.count();
  }

  async countLowStock(): Promise<number> {
    return this.productosRepo.createQueryBuilder('p')
      .where('p.stock <= p.stockMinimo')
      .getCount();
  }
}
