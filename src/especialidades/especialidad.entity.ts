import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('especialidades')
export class Especialidad {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Identificador único de la especialidad' })
  id?: number;

  @Column({ unique: true, length: 100 })
  @ApiProperty({ description: 'Nombre de la especialidad odontológica', example: 'Ortodoncia' })
  nombre?: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Descripción del área de práctica', required: false })
  descripcion?: string;

  // Un odontólogo puede ser marcado como inactivo sin eliminarlo de la base de datos
  @Column({ default: true })
  @ApiProperty({ description: 'Indica si la especialidad está activa en el sistema' })
  activo?: boolean;

  @CreateDateColumn()
  creadoEn?: Date;

  @UpdateDateColumn()
  actualizadoEn?: Date;
}