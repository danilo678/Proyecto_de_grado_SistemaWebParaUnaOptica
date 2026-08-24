import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectRepository(Categoria)
    private categoriasRepo: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriasRepo.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Categoria> {
    const cat = await this.categoriasRepo.findOne({ where: { id } });
    if (!cat) throw new NotFoundException(`Categoría con id ${id} no encontrada`);
    return cat;
  }

  async create(nombre: string): Promise<Categoria> {
    const cat = this.categoriasRepo.create({ nombre });
    return this.categoriasRepo.save(cat);
  }

  async update(id: number, nombre: string): Promise<Categoria> {
    const cat = await this.findOne(id);
    cat.nombre = nombre;
    return this.categoriasRepo.save(cat);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.categoriasRepo.remove(cat);
  }
}
