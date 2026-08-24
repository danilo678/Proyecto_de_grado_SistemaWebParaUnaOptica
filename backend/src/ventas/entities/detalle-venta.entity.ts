import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from './venta.entity';
import { Producto } from '../../productos/entities/producto.entity';
import { decimalANumero } from '../../comun/transformers/decimal.transformer';

@Entity('detalle_venta')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'venta_id' })
  ventaId: number;

  @ManyToOne(() => Venta, (v) => v.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Column({ type: 'int', name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Producto, (p) => p.detallesVenta, { eager: true })
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column({ type: 'int', default: 1 })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario', default: 0, transformer: decimalANumero })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: decimalANumero })
  subtotal: number;
}
