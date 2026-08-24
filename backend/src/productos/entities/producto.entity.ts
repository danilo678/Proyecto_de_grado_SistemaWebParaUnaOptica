import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { DetalleVenta } from '../../ventas/entities/detalle-venta.entity';
import { decimalANumero } from '../../comun/transformers/decimal.transformer';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'categoria_id' })
  categoriaId: number;

  @ManyToOne(() => Categoria, (cat) => cat.productos, { eager: true })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  marca: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  color: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_compra', default: 0, transformer: decimalANumero })
  precioCompra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_venta', default: 0, transformer: decimalANumero })
  precioVenta: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int', name: 'stock_minimo', default: 0 })
  stockMinimo: number;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.producto)
  detallesVenta: DetalleVenta[];
}
