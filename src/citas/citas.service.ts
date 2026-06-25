import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Cita } from './cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,
  ) {}

  async create(dto: CreateCitaDto): Promise<Cita | null> {
    try {
      const cita = this.citaRepo.create(dto);
      return await this.citaRepo.save(cita);
    } catch (err) {
      console.error('Error creando cita:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Cita> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.citaRepo.createQueryBuilder('cita');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'motivo':
              query.where('cita.motivo ILIKE :search', { search: `%${search}%` });
              break;
            case 'pacienteId':
              query.where('cita.pacienteId = :search', { search });
              break;
            case 'odontologoId':
              query.where('cita.odontologoId = :search', { search });
              break;
            default:
              query.where('cita.motivo ILIKE :search', { search: `%${search}%` });
          }
        } else {
          query.where('cita.motivo ILIKE :search', { search: `%${search}%` });
        }
      }

      if (sort) {
        query.orderBy(`cita.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Cita>(query, { page, limit });
    } catch (err) {
      console.error('Error listando citas:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Cita | null> {
    try {
      return await this.citaRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando cita:', err);
      return null;
    }
  }

  async findByPaciente(pacienteId: string, queryDto: QueryDto): Promise<Pagination<Cita> | null> {
    try {
      const { page, limit } = queryDto;
      const query = this.citaRepo
        .createQueryBuilder('cita')
        .where('cita.pacienteId = :pacienteId', { pacienteId })
        .orderBy('cita.fechaHora', 'DESC');
      return await paginate<Cita>(query, { page, limit });
    } catch (err) {
      console.error('Error buscando citas por paciente:', err);
      return null;
    }
  }

  async findByOdontologo(odontologoId: string, queryDto: QueryDto): Promise<Pagination<Cita> | null> {
    try {
      const { page, limit } = queryDto;
      const query = this.citaRepo
        .createQueryBuilder('cita')
        .where('cita.odontologoId = :odontologoId', { odontologoId })
        .orderBy('cita.fechaHora', 'ASC');
      return await paginate<Cita>(query, { page, limit });
    } catch (err) {
      console.error('Error buscando citas por odontólogo:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateCitaDto): Promise<Cita | null> {
    try {
      const cita = await this.findOne(id);
      if (!cita) return null;
      Object.assign(cita, dto);
      return await this.citaRepo.save(cita);
    } catch (err) {
      console.error('Error actualizando cita:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Cita | null> {
    try {
      const cita = await this.findOne(id);
      if (!cita) return null;
      return await this.citaRepo.remove(cita);
    } catch (err) {
      console.error('Error eliminando cita:', err);
      return null;
    }
  }
}
