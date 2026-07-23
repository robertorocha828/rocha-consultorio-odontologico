import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OdontologosController } from './odontologos.controller';
import { OdontologosService } from './odontologos.service';
import { Odontologo } from './odontologo.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Odontologo]), UsersModule],
  controllers: [OdontologosController],
  providers: [OdontologosService],
  exports: [OdontologosService],
})
export class OdontologosModule {}