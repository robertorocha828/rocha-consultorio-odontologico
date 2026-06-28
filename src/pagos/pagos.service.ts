import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Pago } from './pago.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';
import { QueryDto } from 'src/common/dto/query.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,
  ) {}

  async create(dto: CreatePagoDto): Promise<Pago | null> {
    try {
      const pago = this.pagoRepo.create(dto);
      return await this.pagoRepo.save(pago);
    } catch (err) {
      console.error('Error creando pago:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Pago> | null> {
    try {
      const { page, limit, sort, order } = queryDto;
      const query = this.pagoRepo.createQueryBuilder('pago');

      if (sort) {
        query.orderBy(`pago.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }

      return await paginate<Pago>(query, { page, limit });
    } catch (err) {
      console.error('Error listando pagos:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Pago | null> {
    try {
      return await this.pagoRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando pago:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdatePagoDto): Promise<Pago | null> {
    try {
      const pago = await this.findOne(id);
      if (!pago) return null;
      Object.assign(pago, dto);
      return await this.pagoRepo.save(pago);
    } catch (err) {
      console.error('Error actualizando pago:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Pago | null> {
    try {
      const pago = await this.findOne(id);
      if (!pago) return null;
      return await this.pagoRepo.remove(pago);
    } catch (err) {
      console.error('Error eliminando pago:', err);
      return null;
    }
  }
}