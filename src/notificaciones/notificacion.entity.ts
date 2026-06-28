import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  destinatario?: string;      

  @Column()
  asunto?: string;

  @Column({ type: 'text' })
  mensaje?: string;

  @Column({ default: 'enviado' })
  estado?: string;           

  @Column({ nullable: true })
  tipo?: string;              


  @CreateDateColumn()
  creadoEn?: Date;
}
