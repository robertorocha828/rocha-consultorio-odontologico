import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('inventario')
export class Inventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 100 })
  nombre: string;

  @Column({ length: 50, nullable: true })
  categoria: string;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @Column({ type: 'int', default: 0 })
  stockMinimo: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  precioUnitario: number;

  @Column({ default: true })
  activo: boolean;
}