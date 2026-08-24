import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Receta } from '../../recetas/entities/receta.entity';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 30, unique: true })
  ci: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  apellido: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  telefono: string;

  @Column({ type: 'char', length: 1, nullable: true })
  sexo: string;

  @Column({ type: 'timestamp', name: 'fecha_registro', default: () => 'CURRENT_TIMESTAMP' })
  fechaRegistro: Date;

  @OneToMany(() => Receta, (receta) => receta.cliente)
  recetas: Receta[];

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}
