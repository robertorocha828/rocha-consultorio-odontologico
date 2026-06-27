import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Consultorio } from './consultorio.entity';
import { CreateConsultorioDto } from './dto/create-consultorio.dto';
import { UpdateConsultorioDto } from './dto/update-consultorio.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class ConsultoriosService {
  constructor(
    @InjectRepository(Consultorio)
    private readonly consultorioRepo: Repository<Consultorio>,
  ) {}

  async create(dto: CreateConsultorioDto): Promise<Consultorio | null> {
    try {
      const consultorio = this.consultorioRepo.create(dto);
      return await this.consultorioRepo.save(consultorio);
    } catch (err) {
      console.error('Error creando consultorio:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Consultorio> | null> {
    try {
      const { page, limit, search, sort, order } = queryDto;
      const query = this.consultorioRepo.createQueryBuilder('consultorio');

      if (search) {
        query.where('consultorio.nombre ILIKE :search', { search: `%${search}%` });
      }

      if (sort) {
        query.orderBy(`consultorio.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Consultorio>(query, { page, limit });
    } catch (err) {
      console.error('Error listando consultorios:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Consultorio | null> {
    try {
      return await this.consultorioRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando consultorio:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateConsultorioDto): Promise<Consultorio | null> {
    try {
      const consultorio = await this.findOne(id);
      if (!consultorio) return null;
      Object.assign(consultorio, dto);
      return await this.consultorioRepo.save(consultorio);
    } catch (err) {
      console.error('Error actualizando consultorio:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Consultorio | null> {
    try {
      const consultorio = await this.findOne(id);
      if (!consultorio) return null;
      return await this.consultorioRepo.remove(consultorio);
    } catch (err) {
      console.error('Error eliminando consultorio:', err);
      return null;
    }
  }
}