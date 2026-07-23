import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';
import { Cita } from './cita.entity';
import { MailModule } from '../mail/mail.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';
import { HorariosModule } from '../horarios/horarios.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita]),
    MailModule,
    NotificacionesModule,
    HorariosModule,
  ],
  controllers: [CitasController],
  providers: [CitasService],
  exports: [CitasService],
})
export class CitasModule {}