import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
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
    // Verificamos que no exista otra especialidad con el mismo nombre antes de crearla
    const existe = await this.especialidadRepository.findOneBy({ nombre: dto.nombre });
    if (existe) {
      throw new ConflictException(`La especialidad "${dto.nombre}" ya está registrada`);
    }

    const nueva = this.especialidadRepository.create(dto);
    return this.especialidadRepository.save(nueva);
  }

  async findAll(): Promise<Especialidad[]> {
    return this.especialidadRepository.find({ order: { nombre: 'ASC' } });
  }

  async findAllActivas(): Promise<Especialidad[]> {
    // Solo retornamos especialidades activas para los formularios de asignación
    return this.especialidadRepository.findBy({ activo: true });
  }

  async findOne(id: number): Promise<Especialidad> {
    const especialidad = await this.especialidadRepository.findOneBy({ id });
    if (!especialidad) {
      throw new NotFoundException(`Especialidad con ID ${id} no encontrada`);
    }
    return especialidad;
  }

  async update(id: number, dto: UpdateEspecialidadDto): Promise<Especialidad> {
    const especialidad = await this.findOne(id);

    // Validamos que el nuevo nombre no colisione con una especialidad diferente
    if (dto.nombre! && dto.nombre !== especialidad.nombre) {
      const existe = await this.especialidadRepository.findOneBy({ nombre: dto.nombre });
      if (existe) {
        throw new ConflictException(`La especialidad "${dto.nombre}" ya está registrada`);
      }
    }

    Object.assign(especialidad, dto);
    return this.especialidadRepository.save(especialidad);
  }

  async remove(id: number): Promise<{ message: string }> {
    const especialidad = await this.findOne(id);
    await this.especialidadRepository.remove(especialidad);
    return { message: `Especialidad "${especialidad.nombre}" eliminada correctamente` };
  }
}