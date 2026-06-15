import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Paciente } from './paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { OdontogramaService } from 'src/odontograma/odontograma.service';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepo: Repository<Paciente>,
    private readonly odontogramaService: OdontogramaService,
  ) {}

  async create(dto: CreatePacienteDto): Promise<Paciente | null> {
    try {
      const paciente = this.pacienteRepo.create(dto);
      return await this.pacienteRepo.save(paciente);
    } catch (err) {
      console.error('Error creando paciente:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Paciente> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.pacienteRepo.createQueryBuilder('paciente');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'nombre':
              query.where('paciente.nombre ILIKE :search', { search: `%${search}%` });
              break;
            case 'apellido':
              query.where('paciente.apellido ILIKE :search', { search: `%${search}%` });
              break;
            case 'cedula':
              query.where('paciente.cedula ILIKE :search', { search: `%${search}%` });
              break;
            default:
              query.where(
                '(paciente.nombre ILIKE :search OR paciente.apellido ILIKE :search OR paciente.cedula ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(paciente.nombre ILIKE :search OR paciente.apellido ILIKE :search OR paciente.cedula ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`paciente.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Paciente>(query, { page, limit });
    } catch (err) {
      console.error('Error listando pacientes:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Paciente | null> {
    try {
      return await this.pacienteRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando paciente:', err);
      return null;
    }
  }

  async findByCedula(cedula: string): Promise<Paciente | null> {
    try {
      return await this.pacienteRepo.findOne({ where: { cedula } });
    } catch (err) {
      console.error('Error buscando paciente por cédula:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdatePacienteDto): Promise<Paciente | null> {
    try {
      const paciente = await this.findOne(id);
      if (!paciente) return null;
      Object.assign(paciente, dto);
      return await this.pacienteRepo.save(paciente);
    } catch (err) {
      console.error('Error actualizando paciente:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Paciente | null> {
    try {
      const paciente = await this.findOne(id);
      if (!paciente) return null;
      return await this.pacienteRepo.remove(paciente);
    } catch (err) {
      console.error('Error eliminando paciente:', err);
      return null;
    }
  }

  async findOneConOdontograma(id: string): Promise<any | null> {
    try {
      const paciente = await this.findOne(id);
      if (!paciente) return null;

      const odontograma = await this.odontogramaService.findLatestByPaciente(id);

      return { paciente, odontograma };
    } catch (err) {
      console.error('Error buscando paciente con odontograma:', err);
      return null;
    }
  }
}
