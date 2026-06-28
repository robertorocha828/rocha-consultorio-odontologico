import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Factura } from './factura.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
  ) {}

  async create(dto: CreateFacturaDto): Promise<Factura | null> {
    try {
      const factura = this.facturaRepo.create(dto);
      return await this.facturaRepo.save(factura);
    } catch (err) {
      console.error('Error creando factura:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Factura> | null> {
    try {
      const { page, limit, sort, order } = queryDto;
      const query = this.facturaRepo.createQueryBuilder('factura');

      if (sort) {
        query.orderBy(`factura.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Factura>(query, { page, limit });
    } catch (err) {
      console.error('Error listando facturas:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Factura | null> {
    try {
      return await this.facturaRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando factura:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateFacturaDto): Promise<Factura | null> {
    try {
      const factura = await this.findOne(id);
      if (!factura) return null;
      Object.assign(factura, dto);
      return await this.facturaRepo.save(factura);
    } catch (err) {
      console.error('Error actualizando factura:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Factura | null> {
    try {
      const factura = await this.findOne(id);
      if (!factura) return null;
      return await this.facturaRepo.remove(factura);
    } catch (err) {
      console.error('Error eliminando factura:', err);
      return null;
    }
  }
}