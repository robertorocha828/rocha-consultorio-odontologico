import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HistorialClinico } from './schemas/historial-clinico.schema';
import { CreateHistorialClinicoDto } from './dto/create-historial-clinico.dto';
import { UpdateHistorialClinicoDto } from './dto/update-historial-clinico.dto';

@Injectable()
export class HistorialClinicoService {
  constructor(
    @InjectModel(HistorialClinico.name)
    private readonly historialModel: Model<HistorialClinico>,
  ) {}

  async create(dto: CreateHistorialClinicoDto): Promise<HistorialClinico | null> {
    try {
      const historial = new this.historialModel(dto);
      return await historial.save();
    } catch (err) {
      console.error('Error creando historial clínico:', err);
      return null;
    }
  }

  async findAll(options: { page: number; limit: number }): Promise<any | null> {
    try {
      const { page, limit } = options;
      const items = await this.historialModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ fechaConsulta: -1 });
      return { items, page, limit };
    } catch (err) {
      console.error('Error listando historiales:', err);
      return null;
    }
  }

  async findByPaciente(
    pacienteId: string,
    options: { page: number; limit: number },
  ): Promise<any | null> {
    try {
      const { page, limit } = options;
      const items = await this.historialModel
        .find({ pacienteId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ fechaConsulta: -1 });
      return { items, page, limit };
    } catch (err) {
      console.error('Error buscando historiales por paciente:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<HistorialClinico | null> {
    try {
      return await this.historialModel.findById(id);
    } catch (err) {
      console.error('Error buscando historial:', err);
      return null;
    }
  }

  async update(
    id: string,
    dto: UpdateHistorialClinicoDto,
  ): Promise<HistorialClinico | null> {
    try {
      const historial = await this.findOne(id);
      if (!historial) return null;
      Object.assign(historial, dto);
      historial.markModified('diagnostico');
      return await historial.save();
    } catch (err) {
      console.error('Error actualizando historial:', err);
      return null;
    }
  }

  async remove(id: string): Promise<HistorialClinico | null> {
    try {
      const historial = await this.findOne(id);
      if (!historial) return null;
      return await historial.deleteOne();
    } catch (err) {
      console.error('Error eliminando historial:', err);
      return null;
    }
  }
}
