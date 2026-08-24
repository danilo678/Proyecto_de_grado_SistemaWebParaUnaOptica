import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from './entities/usuario.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { CrearUsuarioDto, ActualizarUsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
  ) {}

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const qb = this.usuariosRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.rol', 'rol');

    if (query.search) {
      qb.where('(u.nombre ILIKE :s OR u.apellido ILIKE :s OR u.usuario ILIKE :s OR u.ci ILIKE :s)', { s: `%${query.search}%` });
    }

    qb.orderBy('u.id', 'DESC').skip(skip).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<Usuario> {
    const user = await this.usuariosRepo.findOne({
      where: { id },
      relations: { rol: true },
    });
    if (!user) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return user;
  }

  async findByUsername(usuario: string): Promise<Usuario | null> {
    return this.usuariosRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.rol', 'rol')
      .addSelect('u.password')
      .where('u.usuario = :usuario', { usuario })
      .getOne();
  }

  async create(dto: CrearUsuarioDto): Promise<Usuario> {
    const existing = await this.usuariosRepo.findOne({ where: { usuario: dto.usuario } });
    if (existing) throw new ConflictException('El nombre de usuario ya existe');

    const existingCi = await this.usuariosRepo.findOne({ where: { ci: dto.ci } });
    if (existingCi) throw new ConflictException('La cédula de identidad ya está registrada');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = this.usuariosRepo.create({ ...dto, password: hashedPassword });
    const saved = await this.usuariosRepo.save(user);
    return this.findOne(saved.id);
  }

  async update(id: number, dto: ActualizarUsuarioDto): Promise<Usuario> {
    const user = await this.findOne(id);

    if (dto.usuario) {
      const dupUsuario = await this.usuariosRepo.findOne({ where: { usuario: dto.usuario } });
      if (dupUsuario && dupUsuario.id !== id) throw new ConflictException('El nombre de usuario ya existe');
    }

    if (dto.ci) {
      const dupCi = await this.usuariosRepo.findOne({ where: { ci: dto.ci } });
      if (dupCi && dupCi.id !== id) throw new ConflictException('La cédula de identidad ya está registrada');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    Object.assign(user, dto);
    await this.usuariosRepo.save(user);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    const ventasCount = await this.usuariosRepo.manager.count(Venta, { where: { usuarioId: id } });
    if (ventasCount > 0) {
      throw new ConflictException('No se puede eliminar el usuario porque tiene ventas registradas a su nombre');
    }
    await this.usuariosRepo.remove(user);
  }

  async count(): Promise<number> {
    return this.usuariosRepo.count();
  }
}
