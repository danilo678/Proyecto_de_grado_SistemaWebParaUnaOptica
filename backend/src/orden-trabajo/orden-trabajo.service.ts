import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenTrabajo } from './entities/orden-trabajo.entity';
import { CrearOrdenTrabajoDto, ActualizarOrdenTrabajoDto } from './dto/orden-trabajo.dto';

@Injectable()
export class OrdenTrabajoService {
  constructor(
    @InjectRepository(OrdenTrabajo)
    private ordenTrabajoRepo: Repository<OrdenTrabajo>,
  ) {}

  async findAll(query: { page?: number; limit?: number; estado?: string; clienteId?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.ordenTrabajoRepo.createQueryBuilder('ot')
      .leftJoinAndSelect('ot.cliente', 'cliente')
      .leftJoinAndSelect('ot.receta', 'receta')
      .leftJoinAndSelect('ot.venta', 'venta')
      .leftJoinAndSelect('venta.recibo', 'recibo')
      .leftJoinAndSelect('venta.detalles', 'detalles')
      .leftJoinAndSelect('detalles.producto', 'producto');

    if (query.estado) {
      qb.andWhere('ot.estado = :estado', { estado: query.estado });
    }
    if (query.clienteId) {
      qb.andWhere('ot.clienteId = :cid', { cid: query.clienteId });
    }

    qb.orderBy('ot.id', 'DESC').skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<OrdenTrabajo> {
    const ot = await this.ordenTrabajoRepo.findOne({
      where: { id },
      relations: { cliente: true, receta: true, venta: { recibo: true, detalles: { producto: true } } },
    });
    if (!ot) throw new NotFoundException(`Orden de trabajo con id ${id} no encontrada`);
    return ot;
  }

  async create(dto: CrearOrdenTrabajoDto): Promise<OrdenTrabajo> {
    const ot = this.ordenTrabajoRepo.create(dto);
    const saved = await this.ordenTrabajoRepo.save(ot);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: ActualizarOrdenTrabajoDto): Promise<OrdenTrabajo> {
    const ot = await this.findOne(id);
    Object.assign(ot, dto);
    await this.ordenTrabajoRepo.save(ot);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const ot = await this.findOne(id);
    await this.ordenTrabajoRepo.remove(ot);
  }

  async count(): Promise<number> {
    return this.ordenTrabajoRepo.count();
  }

  async countByEstado(estado: string): Promise<number> {
    return this.ordenTrabajoRepo.count({ where: { estado } });
  }
}
