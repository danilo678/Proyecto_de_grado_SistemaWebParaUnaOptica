import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Receta } from '../../recetas/entities/receta.entity';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('orden_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => Cliente, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'int', name: 'receta_id', nullable: true })
  recetaId: number;

  @ManyToOne(() => Receta, { eager: true })
  @JoinColumn({ name: 'receta_id' })
  receta: Receta;

  @Column({ type: 'int', name: 'venta_id', nullable: true })
  ventaId: number;

  @ManyToOne(() => Venta, (v) => v.ordenesTrabajo, { eager: true })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Column({ type: 'timestamp', name: 'fecha_ingreso', default: () => 'CURRENT_TIMESTAMP' })
  fechaIngreso: Date;

  @Column({ type: 'timestamp', name: 'fecha_entrega', nullable: true })
  fechaEntrega: Date;

  @Column({ type: 'varchar', length: 50, default: 'PENDIENTE' })
  estado: string;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}
