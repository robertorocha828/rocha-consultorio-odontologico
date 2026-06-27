import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Notificacion } from './notificacion.entity';
import { CreateNotificacionDto } from './dto/create-notificacion.dto';
import { UpdateNotificacionDto } from './dto/update-notificacion.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class NotificacionesService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepo: Repository<Notificacion>,
  ) {}

  async create(dto: CreateNotificacionDto): Promise<Notificacion | null> {
    try {
      const notificacion = this.notificacionRepo.create(dto);
      return await this.notificacionRepo.save(notificacion);
    } catch (err) {
      console.error('Error creando notificación:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Notificacion> | null> {
    try {
      const { page, limit, search, sort, order } = queryDto;
      const query = this.notificacionRepo.createQueryBuilder('notificacion');
      if (search) {
        query.where(
          '(notificacion.destinatario ILIKE :search OR notificacion.asunto ILIKE :search)',
          { search: `%${search}%` },
        );
      }
      if (sort) {
        query.orderBy(`notificacion.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }
      return await paginate<Notificacion>(query, { page, limit });
    } catch (err) {
      console.error('Error listando notificaciones:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Notificacion | null> {
    try {
      return await this.notificacionRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando notificación:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateNotificacionDto): Promise<Notificacion | null> {
    try {
      const notificacion = await this.findOne(id);
      if (!notificacion) return null;
      Object.assign(notificacion, dto);
      return await this.notificacionRepo.save(notificacion);
    } catch (err) {
      console.error('Error actualizando notificación:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Notificacion | null> {
    try {
      const notificacion = await this.findOne(id);
      if (!notificacion) return null;
      return await this.notificacionRepo.remove(notificacion);
    } catch (err) {
      console.error('Error eliminando notificación:', err);
      return null;
    }
  }
}
