import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoCita {
  AGENDADA = 'agendada',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada',
}

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  pacienteId?: string;

  @Column()
  odontologoId?: string;

  @Column({ type: 'timestamp' })
  fechaHora?: Date;

  @Column()
  motivo?: string;

  @Column({ type: 'enum', enum: EstadoCita, default: EstadoCita.AGENDADA })
  estado?: EstadoCita;

  @Column({ nullable: true })
  observaciones?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
