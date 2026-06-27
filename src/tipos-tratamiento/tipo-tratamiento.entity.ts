import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipos_tratamiento')
export class TipoTratamiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  nombre: string;

  @Column({ default: true })
  activo: boolean;
}