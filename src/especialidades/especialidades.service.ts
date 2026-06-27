import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidad } from './especialidad.entity';
import { CreateEspecialidadDto } from './dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from './dto/update-especialidad.dto';

@Injectable()
export class EspecialidadesService {
  constructor(
    @InjectRepository(Especialidad)
    private readonly especialidadRepository: Repository<Especialidad>,
  ) {}

  async create(dto: CreateEspecialidadDto): Promise<Especialidad> {
    const existe = await this.especialidadRepository.findOneBy({ nombre: dto.nombre });

    if (existe) {
      throw new ConflictException('La especialidad ya existe');
    }

    const nuevaEspecialidad = this.especialidadRepository.create({
      nombre: dto.nombre,
      activo: dto.activo ?? true,
    });

    await this.especialidadRepository.save(nuevaEspecialidad);

    const especialidadGuardada = await this.especialidadRepository.findOneBy({
      nombre: dto.nombre,
    });

    if (!especialidadGuardada) {
      throw new NotFoundException('No se pudo guardar la especialidad');
    }

    return especialidadGuardada;
  }

  async findAll(): Promise<Especialidad[]> {
    return this.especialidadRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Especialidad> {
    const especialidad = await this.especialidadRepository.findOneBy({ id });

    if (!especialidad) {
      throw new NotFoundException('Especialidad no encontrada');
    }

    return especialidad;
  }

  async update(id: number, dto: UpdateEspecialidadDto): Promise<Especialidad> {
    const especialidad = await this.findOne(id);

    if (dto.nombre && dto.nombre !== especialidad.nombre) {
      const existe = await this.especialidadRepository.findOneBy({ nombre: dto.nombre });

      if (existe) {
        throw new ConflictException('La especialidad ya existe');
      }
    }

    especialidad.nombre = dto.nombre ?? especialidad.nombre;
    especialidad.activo = dto.activo ?? especialidad.activo;

    await this.especialidadRepository.save(especialidad);

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const especialidad = await this.findOne(id);
    await this.especialidadRepository.remove(especialidad);

    return {
      message: 'Especialidad eliminada correctamente',
    };
  }
}