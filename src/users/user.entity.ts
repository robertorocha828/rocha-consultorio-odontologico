import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  username?: string;

  @Column({ unique: true })
  email?: string;

  @Column()
  password?: string;

  @Column({ default: 'usuario' })
  rol?: string;             // 'admin' | 'usuario'

  @Column({ default: true })
  activo?: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
