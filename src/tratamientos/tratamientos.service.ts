import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tratamiento } from './tratamiento.entity';
import { CreateTratamientoDto } from './dto/create-tratamiento.dto';
import { UpdateTratamientoDto } from './dto/update-tratamiento.dto';

@Injectable()
export class TratamientosService {
  constructor(
    @InjectRepository(Tratamiento)
    private readonly tratamientoRepository: Repository<Tratamiento>,
  ) {}

  async create(dto: CreateTratamientoDto): Promise<Tratamiento> {
    const existe = await this.tratamientoRepository.findOneBy({ nombre: dto.nombre });

    if (existe) {
      throw new ConflictException('El tratamiento ya existe');
    }

    const nuevoTratamiento = this.tratamientoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion ?? '',
      costo: dto.costo,
      tipoTratamientoId: dto.tipoTratamientoId,
      activo: dto.activo ?? true,
    });

    await this.tratamientoRepository.save(nuevoTratamiento);

    const tratamientoGuardado = await this.tratamientoRepository.findOneBy({
      nombre: dto.nombre,
    });

    if (!tratamientoGuardado) {
      throw new NotFoundException('No se pudo guardar el tratamiento');
    }

    return tratamientoGuardado;
  }

  async findAll(): Promise<Tratamiento[]> {
    return this.tratamientoRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Tratamiento> {
    const tratamiento = await this.tratamientoRepository.findOneBy({ id });

    if (!tratamiento) {
      throw new NotFoundException('Tratamiento no encontrado');
    }

    return tratamiento;
  }

  async update(id: number, dto: UpdateTratamientoDto): Promise<Tratamiento> {
    const tratamiento = await this.findOne(id);

    if (dto.nombre && dto.nombre !== tratamiento.nombre) {
      const existe = await this.tratamientoRepository.findOneBy({ nombre: dto.nombre });

      if (existe) {
        throw new ConflictException('El tratamiento ya existe');
      }
    }

    tratamiento.nombre = dto.nombre ?? tratamiento.nombre;
    tratamiento.descripcion = dto.descripcion ?? tratamiento.descripcion;
    tratamiento.costo = dto.costo ?? tratamiento.costo;
    tratamiento.tipoTratamientoId = dto.tipoTratamientoId ?? tratamiento.tipoTratamientoId;
    tratamiento.activo = dto.activo ?? tratamiento.activo;

    await this.tratamientoRepository.save(tratamiento);

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const tratamiento = await this.findOne(id);
    await this.tratamientoRepository.remove(tratamiento);

    return {
      message: 'Tratamiento eliminado correctamente',
    };
  }
}