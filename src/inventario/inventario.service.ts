import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventario } from './inventario.entity';
import { CreateInventarioDto } from './dto/create-inventario.dto';
import { UpdateInventarioDto } from './dto/update-inventario.dto';

@Injectable()
export class InventarioService {
  constructor(
    @InjectRepository(Inventario)
    private readonly inventarioRepository: Repository<Inventario>,
  ) {}

  async create(dto: CreateInventarioDto): Promise<Inventario> {
    const existe = await this.inventarioRepository.findOneBy({ nombre: dto.nombre });

    if (existe) {
      throw new ConflictException('El ítem de inventario ya existe');
    }

    const nuevoItem = this.inventarioRepository.create({
      nombre: dto.nombre,
      categoria: dto.categoria ?? '',
      cantidad: dto.cantidad,
      stockMinimo: dto.stockMinimo ?? 0,
      precioUnitario: dto.precioUnitario,
      activo: dto.activo ?? true,
    });

    await this.inventarioRepository.save(nuevoItem);

    const itemGuardado = await this.inventarioRepository.findOneBy({ nombre: dto.nombre });

    if (!itemGuardado) {
      throw new NotFoundException('No se pudo guardar el ítem de inventario');
    }

    return itemGuardado;
  }

  async findAll(): Promise<Inventario[]> {
    return this.inventarioRepository.find({
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Inventario> {
    const item = await this.inventarioRepository.findOneBy({ id });

    if (!item) {
      throw new NotFoundException('Ítem de inventario no encontrado');
    }

    return item;
  }

  async update(id: number, dto: UpdateInventarioDto): Promise<Inventario> {
    const item = await this.findOne(id);

    if (dto.nombre && dto.nombre !== item.nombre) {
      const existe = await this.inventarioRepository.findOneBy({ nombre: dto.nombre });

      if (existe) {
        throw new ConflictException('El ítem de inventario ya existe');
      }
    }

    item.nombre = dto.nombre ?? item.nombre;
    item.categoria = dto.categoria ?? item.categoria;
    item.cantidad = dto.cantidad ?? item.cantidad;
    item.stockMinimo = dto.stockMinimo ?? item.stockMinimo;
    item.precioUnitario = dto.precioUnitario ?? item.precioUnitario;
    item.activo = dto.activo ?? item.activo;

    await this.inventarioRepository.save(item);

    return this.findOne(id);
  }

  async remove(id: number): Promise<{ message: string }> {
    const item = await this.findOne(id);
    await this.inventarioRepository.remove(item);

    return {
      message: 'Ítem de inventario eliminado correctamente',
    };
  }
}