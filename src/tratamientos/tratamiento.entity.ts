import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tratamientos')
export class Tratamiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  costo: number;

  @Column()
  tipoTratamientoId: number;

  @Column({ default: true })
  activo: boolean;
}