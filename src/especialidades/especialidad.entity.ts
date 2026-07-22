import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Odontologo } from '../odontologos/odontologo.entity';

@Entity('especialidades')
export class Especialidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  nombre: string;

  @Column({ default: true })
  activo: boolean;

  @OneToMany(() => Odontologo, (odontologo) => odontologo.especialidadRel)
  odontologos?: Odontologo[];
}