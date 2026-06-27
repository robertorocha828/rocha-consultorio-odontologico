import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('notificaciones')
export class Notificacion {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  destinatario?: string;      // email al que se envió

  @Column()
  asunto?: string;

  @Column({ type: 'text' })
  mensaje?: string;

  @Column({ default: 'enviado' })
  estado?: string;            // enviado | fallido

  @Column({ nullable: true })
  tipo?: string;              // bienvenida | cita | cancelacion | pago

  @Column({ nullable: true })
  referenciaId?: string;      // id de la cita, pago, etc.

  @CreateDateColumn()
  creadoEn?: Date;
}
