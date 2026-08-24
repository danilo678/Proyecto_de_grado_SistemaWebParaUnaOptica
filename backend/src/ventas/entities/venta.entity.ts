import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { decimalANumero } from '../../comun/transformers/decimal.transformer';
import { Recibo } from './recibo.entity';
import { OrdenTrabajo } from '../../orden-trabajo/entities/orden-trabajo.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => Cliente, (c) => c.ventas, { eager: true })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'int', name: 'usuario_id' })
  usuarioId: number;

  @ManyToOne(() => Usuario, (u) => u.ventas, { eager: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: decimalANumero })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: decimalANumero })
  total: number;

  @Column({ type: 'varchar', length: 50, nullable: true, name: 'metodo_pago' })
  metodoPago: string;

  @OneToMany(() => DetalleVenta, (d) => d.venta, { eager: true, cascade: true })
  detalles: DetalleVenta[];

  @OneToOne(() => Recibo, (r) => r.venta)
  recibo: Recibo;

  @OneToMany(() => OrdenTrabajo, (o) => o.venta)
  ordenesTrabajo: OrdenTrabajo[];
}
