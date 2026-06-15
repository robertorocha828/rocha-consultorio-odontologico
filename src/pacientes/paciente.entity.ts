import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Genero {
  MASCULINO = 'masculino',
  FEMENINO = 'femenino',
  OTRO = 'otro',
}

export enum EstadoPaciente {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  cedula?: string;

  @Column()
  nombre?: string;

  @Column()
  apellido?: string;

  @Column({ type: 'date' })
  fechaNacimiento?: Date;

  @Column({ type: 'enum', enum: Genero })
  genero?: Genero;

  @Column()
  telefono?: string;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({ type: 'simple-array', nullable: true })
  alergias?: string[];

  @Column({ type: 'enum', enum: EstadoPaciente, default: EstadoPaciente.ACTIVO })
  estado?: EstadoPaciente;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
