import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Receta, RecetaSchema } from './receta.schema';
import { RecetasController } from './recetas.controller';
import { RecetasService } from './recetas.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Receta.name, schema: RecetaSchema }])],
  controllers: [RecetasController],
  providers: [RecetasService],
  exports: [RecetasService],
})
export class RecetasModule {}