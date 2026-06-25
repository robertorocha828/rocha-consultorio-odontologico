import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @Column()
  especialidad?: string;

  @Column({ unique: true })
  numeroRegistro?: string;

  @Column({ type: 'enum', enum: EstadoOdontologo, default: EstadoOdontologo.ACTIVO })
  estado?: EstadoOdontologo;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}