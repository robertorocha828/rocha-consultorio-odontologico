import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from './factura.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { Pago } from '../pagos/pago.entity';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';

@Injectable()
export class FacturasService {
  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,

    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,

    @InjectRepository(Pago)
    private readonly pagoRepository: Repository<Pago>,
  ) {}

  async create(createFacturaDto: CreateFacturaDto) {
    const paciente = await this.pacienteRepository.findOne({ where: { id: createFacturaDto.pacienteId } });
    if (!paciente) throw new NotFoundException('Paciente no encontrado');

    let pago = undefined;
    if (createFacturaDto.pagoId) {
      pago = await this.pagoRepository.findOne({ where: { id: createFacturaDto.pagoId } });
      if (!pago) throw new NotFoundException('Pago no encontrado');
    }

    const factura = this.facturaRepository.create({
      numero: createFacturaDto.numero,
      subtotal: createFacturaDto.subtotal,
      total: createFacturaDto.total,
      observaciones: createFacturaDto.observaciones,
      paciente,
      pago,
    });
    return this.facturaRepository.save(factura);
  }

  findAll() {
    return this.facturaRepository.find({ relations: { paciente: true, pago: true } });
  }

  async findOne(id: string) {
    const factura = await this.facturaRepository.findOne({ where: { id }, relations: { paciente: true, pago: true } });
    if (!factura) throw new NotFoundException('Factura no encontrada');
    return factura;
  }

  async update(id: string, updateFacturaDto: UpdateFacturaDto) {
    const factura = await this.findOne(id);

    if (updateFacturaDto.pagoId) {
      const pago = await this.pagoRepository.findOne({ where: { id: updateFacturaDto.pagoId } });
      if (!pago) throw new NotFoundException('Pago no encontrado');
      factura.pago = pago;
    }

    Object.assign(factura, updateFacturaDto);
    return this.facturaRepository.save(factura);
  }

  async remove(id: string) {
    const factura = await this.findOne(id);
    return this.facturaRepository.remove(factura);
  }
}