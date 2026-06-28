import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HistorialClinicoController } from './historial-clinico.controller';
import { HistorialClinicoService } from './historial-clinico.service';
import { HistorialClinico, HistorialClinicoSchema } from './schemas/historial-clinico.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: HistorialClinico.name, schema: HistorialClinicoSchema },
    ]),
  ],
  controllers: [HistorialClinicoController],
  providers: [HistorialClinicoService],
  exports: [HistorialClinicoService],
})
export class HistorialClinicoModule {}
