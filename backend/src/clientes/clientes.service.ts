import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cliente } from './entities/cliente.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { Receta } from '../recetas/entities/receta.entity';
import { OrdenTrabajo } from '../orden-trabajo/entities/orden-trabajo.entity';
import { CrearClienteDto, ActualizarClienteDto } from './dto/cliente.dto';

@Injectable()
export class ClientesService {
  constructor(
    @InjectRepository(Cliente)
    private clientesRepo: Repository<Cliente>,
  ) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.clientesRepo.createQueryBuilder('c');

    if (query.search) {
      qb.where(
        '(c.nombre ILIKE :s OR c.apellido ILIKE :s OR c.ci ILIKE :s)',
        { s: `%${query.search}%` },
      );
    }

    qb.orderBy('c.id', 'DESC').skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Cliente> {
    const client = await this.clientesRepo.findOne({ where: { id } });
    if (!client) throw new NotFoundException(`Cliente con id ${id} no encontrado`);
    return client;
  }

  async create(dto: CrearClienteDto): Promise<Cliente> {
    const existing = await this.clientesRepo.findOne({ where: { ci: dto.ci } });
    if (existing) throw new ConflictException('Ya existe un cliente con esa CI');
    const client = this.clientesRepo.create(dto);
    return this.clientesRepo.save(client);
  }

  async update(id: number, dto: ActualizarClienteDto): Promise<Cliente> {
    const client = await this.findOne(id);

    if (dto.ci) {
      const dupCi = await this.clientesRepo.findOne({ where: { ci: dto.ci } });
      if (dupCi && dupCi.id !== id) throw new ConflictException('Ya existe un cliente con esa CI');
    }

    Object.assign(client, dto);
    return this.clientesRepo.save(client);
  }

  async remove(id: number): Promise<void> {
    const client = await this.findOne(id);

    const [ventasCount, recetasCount, ordenesCount] = await Promise.all([
      this.clientesRepo.manager.count(Venta, { where: { clienteId: id } }),
      this.clientesRepo.manager.count(Receta, { where: { clienteId: id } }),
      this.clientesRepo.manager.count(OrdenTrabajo, { where: { clienteId: id } }),
    ]);

    const motivos: string[] = [];
    if (ventasCount > 0) motivos.push('ventas registradas');
    if (recetasCount > 0) motivos.push('recetas asociadas');
    if (ordenesCount > 0) motivos.push('órdenes de trabajo asociadas');

    if (motivos.length > 0) {
      throw new ConflictException(`No se puede eliminar el cliente porque tiene ${motivos.join(', ')}`);
    }

    await this.clientesRepo.remove(client);
  }

  async count(): Promise<number> {
    return this.clientesRepo.count();
  }
}
