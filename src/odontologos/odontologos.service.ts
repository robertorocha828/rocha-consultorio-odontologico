import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Odontologo } from './odontologo.entity';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class OdontologosService {
  constructor(
    @InjectRepository(Odontologo)
    private readonly odontologoRepo: Repository<Odontologo>,
  ) {}

  async create(dto: CreateOdontologoDto): Promise<Odontologo | null> {
    try {
      const odontologo = this.odontologoRepo.create(dto);
      return await this.odontologoRepo.save(odontologo);
    } catch (err) {
      console.error('Error creando odontólogo:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Odontologo> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.odontologoRepo.createQueryBuilder('odontologo');

      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'nombre':
              query.where('odontologo.nombre ILIKE :search', { search: `%${search}%` });
              break;
            case 'apellido':
              query.where('odontologo.apellido ILIKE :search', { search: `%${search}%` });
              break;
            case 'cedula':
              query.where('odontologo.cedula ILIKE :search', { search: `%${search}%` });
              break;
            default:
              query.where(
                '(odontologo.nombre ILIKE :search OR odontologo.apellido ILIKE :search OR odontologo.cedula ILIKE :search)',
                { search: `%${search}%` },
              );
          }
        } else {
          query.where(
            '(odontologo.nombre ILIKE :search OR odontologo.apellido ILIKE :search OR odontologo.cedula ILIKE :search)',
            { search: `%${search}%` },
          );
        }
      }

      if (sort) {
        query.orderBy(`odontologo.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Odontologo>(query, { page, limit });
    } catch (err) {
      console.error('Error listando odontólogos:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Odontologo | null> {
    try {
      return await this.odontologoRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando odontólogo:', err);
      return null;
    }
  }

  async findByCedula(cedula: string): Promise<Odontologo | null> {
    try {
      return await this.odontologoRepo.findOne({ where: { cedula } });
    } catch (err) {
      console.error('Error buscando odontólogo por cédula:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateOdontologoDto): Promise<Odontologo | null> {
    try {
      const odontologo = await this.findOne(id);
      if (!odontologo) return null;
      Object.assign(odontologo, dto);
      return await this.odontologoRepo.save(odontologo);
    } catch (err) {
      console.error('Error actualizando odontólogo:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Odontologo | null> {
    try {
      const odontologo = await this.findOne(id);
      if (!odontologo) return null;
      return await this.odontologoRepo.remove(odontologo);
    } catch (err) {
      console.error('Error eliminando odontólogo:', err);
      return null;
    }
  }
}