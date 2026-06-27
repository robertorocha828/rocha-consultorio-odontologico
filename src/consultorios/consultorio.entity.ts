import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum EstadoConsultorio {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('consultorios')
export class Consultorio {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  nombre?: string;

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ type: 'enum', enum: EstadoConsultorio, default: EstadoConsultorio.ACTIVO })
  estado?: EstadoConsultorio;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}