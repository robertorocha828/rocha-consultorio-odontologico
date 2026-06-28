import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pago } from './pago.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { CreatePagoDto } from './dto/create-pago.dto';
import { UpdatePagoDto } from './dto/update-pago.dto';

@Injectable()
export class PagosService {
  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
  ) {}

  async create(createPagoDto: CreatePagoDto) {
    const paciente = await this.pacienteRepository.findOne({ where: { id: createPagoDto.pacienteId } });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    const pago = this.pagoRepository.create({
      monto: createPagoDto.monto,
      metodoPago: createPagoDto.metodoPago,
      observaciones: createPagoDto.observaciones,
      paciente,
    });
    return this.pagoRepository.save(pago);
  }

  findAll() {
    return this.pagoRepository.find({ relations: { paciente: true } });
  }

  async findOne(id: string) {
    const pago = await this.pagoRepository.findOne({ where: { id }, relations: { paciente: true } });
    if (!pago) throw new NotFoundException('Pago no encontrado');
    return pago;
  }

  async update(id: string, updatePagoDto: UpdatePagoDto) {
    const pago = await this.findOne(id);
    Object.assign(pago, updatePagoDto);
    return this.pagoRepository.save(pago);
  }

  async remove(id: string) {
    const pago = await this.findOne(id);
    return this.pagoRepository.remove(pago);
  }
}