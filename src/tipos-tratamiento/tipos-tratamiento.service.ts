import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoTratamiento } from './tipo-tratamiento.entity';
import { CreateTipoTratamientoDto } from './dto/create-tipo-tratamiento.dto';
import { UpdateTipoTratamientoDto } from './dto/update-tipo-tratamiento.dto';

@Injectable()
export class TiposTratamientoService {
  constructor(
    @InjectRepository(TipoTratamiento)
    private readonly tipoTratamientoRepository: Repository<TipoTratamiento>,
  ) {}

  async create(dto: CreateTipoTratamientoDto): Promise<TipoTratamiento> {
    const existe = await this.tipoTratamientoRepository.findOneBy({ nombre: dto.nombre });

    if (existe) {
      throw new ConflictException('El tipo de tratamiento ya existe');
    }

    const nuevoTipoTratamiento = this.tipoTratamientoRepository.create({
      nombre: dto.nombre,
      activo: dto.activo ?? true,
    });

    await this.tipoTratamientoRepository.save(nuevoTipoTratamiento);

    const tipoTratamientoGuardado = await this.tipoTratamientoRepository.findOneBy({
      nombre: dto.nombre,
    });

    if (!tipoTratamientoGuardado) {
      throw new NotFoundException('No se pudo guardar el tipo de tratamiento');
    }

    return tipoTratamientoGuardado;
  }

  async findAll(): Promise<TipoTratamiento[]> {
    return this.tipoTratamientoRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<TipoTratamiento> {
    const tipoTratamiento = await this.tipoTratamientoRepository.findOneBy({ id });

    if (!tipoTratamiento) {
      throw new NotFoundException('Tipo de tratamiento no encontrado');
    }

    return tipoTratamiento;
  }

  async update(id: number, dto: UpdateTipoTratamientoDto): Promise<TipoTratamiento> {
    const tipoTratamiento = await this.findOne(id);

    if (dto.nombre && dto.nombre !== tipoTratamiento.nombre) {
      const existe = await this.tipoTratamientoRepository.findOneBy({ nombre: dto.nombre });

      if (existe) {
        throw new ConflictException('El tipo de tratamiento ya existe');
      }
    }

    tipoTratamiento.nombre = dto.nombre ?? tipoTratamiento.nombre;
    tipoTratamiento.activo = dto.activo ?? tipoTratamiento.activo;

    await this.tipoTratamientoRepository.save(tipoTratamiento);

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const tipoTratamiento = await this.findOne(id);
    await this.tipoTratamientoRepository.remove(tipoTratamiento);

    return {
      message: 'Tipo de tratamiento eliminado correctamente',
    };
  }
}