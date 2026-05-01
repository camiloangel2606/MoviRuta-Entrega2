import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';
import { Ciudadano } from '../../ciudadano/entities/ciudadano.entity';
import { Paradero } from '../../paradero/entities/paradero.entity';
import { Ruta } from '../../ruta/entities/ruta.entity';

export enum BoletoEstado {
  ACTIVO = 'ACTIVO',
  COMPLETADO = 'COMPLETADO',
  CANCELADO = 'CANCELADO',
}

@Entity({ name: 'boleto' })
export class Boleto {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Ciudadano, { nullable: false, onDelete: 'RESTRICT' })
  ciudadano!: Ciudadano;

  @ManyToOne(() => Bus, { nullable: false, onDelete: 'RESTRICT' })
  bus!: Bus;

  @ManyToOne(() => Ruta, { nullable: false, onDelete: 'RESTRICT' })
  ruta!: Ruta;

  @ManyToOne(() => Paradero, { nullable: true, onDelete: 'SET NULL' })
  paraderoAbordaje?: Paradero | null;

  @ManyToOne(() => Paradero, { nullable: true, onDelete: 'SET NULL' })
  paraderoDescenso?: Paradero | null;

  @Column({ type: 'enum', enum: BoletoEstado, default: BoletoEstado.ACTIVO })
  estado!: BoletoEstado;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  costo!: string;

  @Column({ name: 'fecha_inicio', type: 'datetime' })
  fechaInicio!: Date;

  @Column({ name: 'fecha_fin', type: 'datetime', nullable: true })
  fechaFin?: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
