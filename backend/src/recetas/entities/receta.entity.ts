import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('recetas')
export class Receta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.recetas, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  fecha: Date;

  @Column({ type: 'varchar', length: 200, nullable: true, name: 'clinica_externa' })
  clinicaExterna: string;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'esfera_od' })
  esferaOd: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'cilindro_od' })
  cilindroOd: number;

  @Column({ type: 'int', nullable: true, name: 'eje_od' })
  ejeOd: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'add_od' })
  addOd: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'dp_od' })
  dpOd: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'esfera_os' })
  esferaOs: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'cilindro_os' })
  cilindroOs: number;

  @Column({ type: 'int', nullable: true, name: 'eje_os' })
  ejeOs: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'add_os' })
  addOs: number;

  @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true, name: 'dp_os' })
  dpOs: number;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}
