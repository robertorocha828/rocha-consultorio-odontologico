import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
import { Pago } from '../pagos/pago.entity';

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

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'pacienteId' })
  paciente?: Paciente;

  @ManyToOne(() => Pago, { nullable: true })
  @JoinColumn({ name: 'pagoId' })
  pago?: Pago;

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