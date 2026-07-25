import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OdontologosController } from './odontologos.controller';
import { OdontologosService } from './odontologos.service';
import { Odontologo } from './odontologo.entity';
import { UsersModule } from '../users/users.module';
import { NotificacionesModule } from '../notificaciones/notificaciones.module';

@Module({
  imports: [TypeOrmModule.forFeature([Odontologo]), UsersModule, NotificacionesModule],
  controllers: [OdontologosController],
  providers: [OdontologosService],
  exports: [OdontologosService],
})
export class OdontologosModule {}