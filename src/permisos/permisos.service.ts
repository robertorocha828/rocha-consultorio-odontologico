import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Permiso } from './permiso.entity';
import { CreatePermisoDto } from './dto/create-permiso.dto';
import { UpdatePermisoDto } from './dto/update-permiso.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class PermisosService {
  constructor(
    @InjectRepository(Permiso)
    private readonly permisoRepo: Repository<Permiso>,
  ) {}

  async create(dto: CreatePermisoDto): Promise<Permiso | null> {
    try {
      const permiso = this.permisoRepo.create(dto);
      return await this.permisoRepo.save(permiso);
    } catch (err) {
      console.error('Error creando permiso:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Permiso> | null> {
    try {
      const { page, limit, search, sort, order } = queryDto;
      const query = this.permisoRepo.createQueryBuilder('permiso');
      if (search) {
        query.where('permiso.nombre ILIKE :search', { search: `%${search}%` });
      }
      if (sort) {
        query.orderBy(`permiso.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }
      return await paginate<Permiso>(query, { page, limit });
    } catch (err) {
      console.error('Error listando permisos:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Permiso | null> {
    try {
      return await this.permisoRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando permiso:', err);
      return null;
    }
  }

  async findByRol(rolId: string): Promise<Permiso[]> {
    try {
      return await this.permisoRepo.find({ where: { rolId } });
    } catch (err) {
      console.error('Error buscando permisos por rol:', err);
      return [];
    }
  }

  async update(id: string, dto: UpdatePermisoDto): Promise<Permiso | null> {
    try {
      const permiso = await this.findOne(id);
      if (!permiso) return null;
      Object.assign(permiso, dto);
      return await this.permisoRepo.save(permiso);
    } catch (err) {
      console.error('Error actualizando permiso:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Permiso | null> {
    try {
      const permiso = await this.findOne(id);
      if (!permiso) return null;
      return await this.permisoRepo.remove(permiso);
    } catch (err) {
      console.error('Error eliminando permiso:', err);
      return null;
    }
  }
}
