import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OdontologosController } from './odontologos.controller';
import { OdontologosService } from './odontologos.service';
import { Odontologo } from './odontologo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Odontologo])],
  controllers: [OdontologosController],
  providers: [OdontologosService],
  exports: [OdontologosService],
})
export class OdontologosModule {}