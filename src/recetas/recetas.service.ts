import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Receta, RecetaDocument } from './receta.schema';
import { CreateRecetaDto } from './dto/create-receta.dto';
import { UpdateRecetaDto } from './dto/update-receta.dto';

@Injectable()
export class RecetasService {
  constructor(
    @InjectModel(Receta.name)
    private readonly recetaModel: Model<RecetaDocument>,
  ) {}

  async create(dto: CreateRecetaDto): Promise<Receta> {
    const nuevaReceta = new this.recetaModel(dto);
    return nuevaReceta.save();
  }

  async findAll(): Promise<Receta[]> {
    return this.recetaModel.find().exec();
  }

  async findOne(id: string): Promise<Receta> {
    const receta = await this.recetaModel.findById(id).exec();

    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    return receta;
  }

  async update(id: string, dto: UpdateRecetaDto): Promise<Receta> {
    const receta = await this.recetaModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    return receta;
  }

  async remove(id: string): Promise<{ message: string }> {
    const receta = await this.recetaModel.findByIdAndDelete(id).exec();

    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }

    return {
      message: 'Receta eliminada correctamente',
    };
  }
}