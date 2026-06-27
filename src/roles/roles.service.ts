import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Rol } from './rol.entity';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Rol)
    private readonly rolRepo: Repository<Rol>,
  ) {}

  async create(dto: CreateRolDto): Promise<Rol | null> {
    try {
      const rol = this.rolRepo.create(dto);
      return await this.rolRepo.save(rol);
    } catch (err) {
      console.error('Error creando rol:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Rol> | null> {
    try {
      const { page, limit, search, sort, order } = queryDto;
      const query = this.rolRepo.createQueryBuilder('rol');
      if (search) {
        query.where('rol.nombre ILIKE :search', { search: `%${search}%` });
      }
      if (sort) {
        query.orderBy(`rol.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }
      return await paginate<Rol>(query, { page, limit });
    } catch (err) {
      console.error('Error listando roles:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Rol | null> {
    try {
      return await this.rolRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando rol:', err);
      return null;
    }
  }

  async findByNombre(nombre: string): Promise<Rol | null> {
    try {
      return await this.rolRepo.findOne({ where: { nombre } });
    } catch (err) {
      return null;
    }
  }

  async update(id: string, dto: UpdateRolDto): Promise<Rol | null> {
    try {
      const rol = await this.findOne(id);
      if (!rol) return null;
      Object.assign(rol, dto);
      return await this.rolRepo.save(rol);
    } catch (err) {
      console.error('Error actualizando rol:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Rol | null> {
    try {
      const rol = await this.findOne(id);
      if (!rol) return null;
      return await this.rolRepo.remove(rol);
    } catch (err) {
      console.error('Error eliminando rol:', err);
      return null;
    }
  }
}
