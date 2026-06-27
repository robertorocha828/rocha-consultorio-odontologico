import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Horario } from './horario.entity';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class HorariosService {
  constructor(
    @InjectRepository(Horario)
    private readonly horarioRepo: Repository<Horario>,
  ) {}

  async create(dto: CreateHorarioDto): Promise<Horario | null> {
    try {
      const horario = this.horarioRepo.create(dto);
      return await this.horarioRepo.save(horario);
    } catch (err) {
      console.error('Error creando horario:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Horario> | null> {
    try {
      const { page, limit, sort, order } = queryDto;
      const query = this.horarioRepo.createQueryBuilder('horario');

      if (sort) {
        query.orderBy(`horario.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Horario>(query, { page, limit });
    } catch (err) {
      console.error('Error listando horarios:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Horario | null> {
    try {
      return await this.horarioRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando horario:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateHorarioDto): Promise<Horario | null> {
    try {
      const horario = await this.findOne(id);
      if (!horario) return null;
      Object.assign(horario, dto);
      return await this.horarioRepo.save(horario);
    } catch (err) {
      console.error('Error actualizando horario:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Horario | null> {
    try {
      const horario = await this.findOne(id);
      if (!horario) return null;
      return await this.horarioRepo.remove(horario);
    } catch (err) {
      console.error('Error eliminando horario:', err);
      return null;
    }
  }
}