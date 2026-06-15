import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OdontogramaController } from './odontograma.controller';
import { OdontogramaService } from './odontograma.service';
import { Odontograma, OdontogramaSchema } from './schemas/odontograma.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Odontograma.name, schema: OdontogramaSchema },
    ]),
  ],
  controllers: [OdontogramaController],
  providers: [OdontogramaService],
  exports: [OdontogramaService], 
})
export class OdontogramaModule {}