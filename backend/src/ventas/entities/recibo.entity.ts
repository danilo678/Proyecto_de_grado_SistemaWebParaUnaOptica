import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from './venta.entity';
import { decimalANumero } from '../../comun/transformers/decimal.transformer';

@Entity('recibos')
export class Recibo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'venta_id', unique: true })
  ventaId: number;

  @OneToOne(() => Venta, (v) => v.recibo, { eager: true })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @Column({ type: 'varchar', length: 50, unique: true, name: 'numero_recibo' })
  numeroRecibo: string;

  @Column({ type: 'timestamp', name: 'fecha_emision', default: () => 'CURRENT_TIMESTAMP' })
  fechaEmision: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monto_pagado', default: 0, transformer: decimalANumero })
  montoPagado: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, transformer: decimalANumero })
  saldo: number;

  @Column({ type: 'timestamp', name: 'fecha_entrega', nullable: true })
  fechaEntrega: Date;

  @Column({ type: 'text', nullable: true })
  observaciones: string;
}
