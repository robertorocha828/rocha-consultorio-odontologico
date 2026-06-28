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

export enum EstadoPago {
  PENDIENTE = 'pendiente',
  COMPLETADO = 'completado',
  CANCELADO = 'cancelado',
}

export enum MetodoPago {
  EFECTIVO = 'efectivo',
  TARJETA = 'tarjeta',
  TRANSFERENCIA = 'transferencia',
}

@Entity('pagos')
export class Pago {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'pacienteId' })
  paciente?: Paciente;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monto?: number;

  @Column({ type: 'enum', enum: MetodoPago })
  metodoPago?: MetodoPago;

  @Column({ type: 'enum', enum: EstadoPago, default: EstadoPago.PENDIENTE })
  estado?: EstadoPago;

  @Column({ nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}