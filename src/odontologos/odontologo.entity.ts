import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Especialidad } from '../especialidades/especialidad.entity';

export enum EstadoOdontologo {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('odontologos')
export class Odontologo {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  cedula?: string;

  @Column()
  nombre?: string;

  @Column()
  apellido?: string;

  @Column()
  telefono?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ nullable: true })
  userId?: string;

  @Column({ nullable: true })
  especialidadId?: number;

  @ManyToOne(() => Especialidad, (especialidad) => especialidad.odontologos, { nullable: true })
  @JoinColumn({ name: 'especialidadId' })
  especialidadRel?: Especialidad;

  @Column({ unique: true })
  numeroRegistro?: string;

  @Column({ type: 'enum', enum: EstadoOdontologo, default: EstadoOdontologo.ACTIVO })
  estado?: EstadoOdontologo;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}