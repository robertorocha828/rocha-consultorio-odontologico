import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('permisos')
export class Permiso {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  nombre?: string;          // ej: crear_cita, eliminar_paciente

  @Column({ nullable: true })
  descripcion?: string;

  @Column({ nullable: true })
  rolId?: string;           // rol al que pertenece este permiso

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
