import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Odontograma } from './schemas/odontograma.schema';
import { CreateOdontogramaDto } from './dto/create-odontograma.dto';
import { UpdateDienteDto } from './dto/update-diente.dto';

@Injectable()
export class OdontogramaService {
  constructor(
    @InjectModel(Odontograma.name)
    private readonly odontogramaModel: Model<Odontograma>,
  ) {}

  async create(dto: CreateOdontogramaDto): Promise<Odontograma | null> {
    try {
      const odontograma = new this.odontogramaModel(dto);
      return await odontograma.save();
    } catch (err) {
      console.error('Error creando odontograma:', err);
      return null;
    }
  }

  async findAll(options: { page: number; limit: number }): Promise<any | null> {
    try {
      const { page, limit } = options;
      const items = await this.odontogramaModel
        .find()
        .skip((page - 1) * limit)
        .limit(limit);
      return { items, page, limit };
    } catch (err) {
      console.error('Error listando odontogramas:', err);
      return null;
    }
  }

  async findByPaciente(
    pacienteId: string,
    options: { page: number; limit: number },
  ): Promise<any | null> {
    try {
      const { page, limit } = options;
      const items = await this.odontogramaModel
        .find({ pacienteId })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ fechaEvaluacion: -1 });
      return { items, page, limit };
    } catch (err) {
      console.error('Error buscando odontogramas por paciente:', err);
      return null;
    }
  }

  async findLatestByPaciente(pacienteId: string): Promise<Odontograma | null> {
    try {
      return await this.odontogramaModel
        .findOne({ pacienteId })
        .sort({ fechaEvaluacion: -1 });
    } catch (err) {
      console.error('Error buscando odontograma más reciente:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Odontograma | null> {
    try {
      return await this.odontogramaModel.findById(id);
    } catch (err) {
      console.error('Error buscando odontograma:', err);
      return null;
    }
  }

  async updateDiente(
    odontogramaId: string,
    dto: UpdateDienteDto,
  ): Promise<Odontograma | null> {
    try {
      const odontograma = await this.odontogramaModel.findById(odontogramaId);
      if (!odontograma) return null;

      if (!odontograma.dientes) odontograma.dientes = [];

      const diente = odontograma.dientes.find((d) => d.numero === dto.numero);

      if (diente) {
        if (dto.superficies && diente.superficies) {
          Object.assign(diente.superficies, dto.superficies);
        }
        if (dto.estadoGeneral !== undefined) diente.estadoGeneral = dto.estadoGeneral;
        if (dto.observaciones !== undefined) diente.observaciones = dto.observaciones;
      } else {
        odontograma.dientes.push({
          numero: dto.numero,
          superficies: {
            vestibular: dto.superficies?.vestibular ?? 'sano',
            distal:     dto.superficies?.distal     ?? 'sano',
            lingual:    dto.superficies?.lingual    ?? 'sano',
            mesial:     dto.superficies?.mesial     ?? 'sano',
            oclusal:    dto.superficies?.oclusal    ?? 'sano',
          },
          estadoGeneral: dto.estadoGeneral ?? 'presente',
          observaciones: dto.observaciones ?? '',
        } as any);
      }

      odontograma.markModified('dientes');
      return await odontograma.save();
    } catch (err) {
      console.error('Error actualizando diente:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Odontograma | null> {
    try {
      const odontograma = await this.findOne(id);
      if (!odontograma) return null;
      return await odontograma.deleteOne();
    } catch (err) {
      console.error('Error eliminando odontograma:', err);
      return null;
    }
  }
}
