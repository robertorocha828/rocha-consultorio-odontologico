import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoFactura {
  PENDIENTE = 'pendiente',
  PAGADA = 'pagada',
  ANULADA = 'anulada',
}

@Entity('facturas')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  numero?: string;

  @Column()
  pacienteId?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total?: number;

  @Column({ type: 'enum', enum: EstadoFactura, default: EstadoFactura.PENDIENTE })
  estado?: EstadoFactura;

  @Column({ nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}