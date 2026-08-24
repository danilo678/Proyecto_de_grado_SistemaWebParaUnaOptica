import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receta } from './entities/receta.entity';
import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';
import { CrearRecetaDto, ActualizarRecetaDto } from './dto/receta.dto';

@Injectable()
export class RecetasService {
  constructor(
    @InjectRepository(Receta)
    private recetasRepo: Repository<Receta>,
  ) {}

  async findAll(query: { page?: number; limit?: number; clienteId?: number }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.recetasRepo.createQueryBuilder('r')
      .leftJoinAndSelect('r.cliente', 'cliente');

    if (query.clienteId) {
      qb.where('r.clienteId = :cid', { cid: query.clienteId });
    }

    qb.orderBy('r.fecha', 'DESC').skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Receta> {
    const rec = await this.recetasRepo.findOne({ where: { id }, relations: { cliente: true } });
    if (!rec) throw new NotFoundException(`Receta con id ${id} no encontrada`);
    return rec;
  }

  async create(dto: CrearRecetaDto): Promise<Receta> {
    const rec = this.recetasRepo.create(dto);
    const saved = await this.recetasRepo.save(rec);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: ActualizarRecetaDto): Promise<Receta> {
    const rec = await this.findOne(id);
    Object.assign(rec, dto);
    await this.recetasRepo.save(rec);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const rec = await this.findOne(id);

    const ordenesCount = await this.recetasRepo.manager.count(OrdenTrabajo, { where: { recetaId: id } });
    if (ordenesCount > 0) {
      throw new ConflictException('No se puede eliminar la receta porque está asociada a órdenes de trabajo');
    }

    await this.recetasRepo.remove(rec);
  }

  async count(): Promise<number> {
    return this.recetasRepo.count();
  }
}
