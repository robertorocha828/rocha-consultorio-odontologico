import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DiaSemana {
  LUNES = 'lunes',
  MARTES = 'martes',
  MIERCOLES = 'miercoles',
  JUEVES = 'jueves',
  VIERNES = 'viernes',
  SABADO = 'sabado',
  DOMINGO = 'domingo',
}

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ type: 'enum', enum: DiaSemana })
  dia?: DiaSemana;

  @Column({ type: 'time' })
  horaInicio?: string;

  @Column({ type: 'time' })
  horaFin?: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}