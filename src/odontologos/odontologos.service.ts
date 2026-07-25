import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Odontologo } from './odontologo.entity';
import { CreateOdontologoDto } from './dto/create-odontologo.dto';
import { UpdateOdontologoDto } from './dto/update-odontologo.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

@Injectable()
export class OdontologosService {
  constructor(
    @InjectRepository(Odontologo)
    private readonly odontologoRepo: Repository<Odontologo>,
    private readonly usersService: UsersService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  private async generarNumeroRegistro(): Promise<string> {
    const total = await this.odontologoRepo.count();
    const year = new Date().getFullYear();
    return `REG-${year}-${String(total + 1).padStart(4, '0')}`;
  }

  async findUsuariosDisponibles(): Promise<User[]> {
    const doctores = await this.usersService.findByRol('doctor');
    const odontologos = await this.odontologoRepo.find({ where: {} });
    const vinculados = new Set(odontologos.map((o) => o.userId).filter(Boolean));
    return doctores.filter((u) => !vinculados.has(u.id));
  }

  async create(dto: CreateOdontologoDto): Promise<Odontologo | null> {
    try {
      const numeroRegistro = dto.numeroRegistro || (await this.generarNumeroRegistro());
      const odontologo = this.odontologoRepo.create({ ...dto, numeroRegistro });
      const saved = await this.odontologoRepo.save(odontologo);

      this.notificacionesService.create({
        destinatario: saved.email ?? 'admin',
        asunto: 'Nuevo odontólogo registrado',
        mensaje: `Se registró al odontólogo ${saved.nombre} ${saved.apellido} (Reg. ${saved.numeroRegistro}).`,
        estado: 'enviado',
        tipo: 'odontologo',
      }).catch((notifErr) => console.error('Error registrando notificación de odontólogo:', notifErr));

      return saved;
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

      query.leftJoinAndSelect('odontologo.especialidadRel', 'especialidadRel');

      return await paginate<Odontologo>(query, { page, limit });
    } catch (err) {
      console.error('Error listando odontólogos:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Odontologo | null> {
    try {
      return await this.odontologoRepo.findOne({ where: { id }, relations: ['especialidadRel'] });
    } catch (err) {
      console.error('Error buscando odontólogo:', err);
      return null;
    }
  }

  async findByCedula(cedula: string): Promise<Odontologo | null> {
    try {
      return await this.odontologoRepo.findOne({ where: { cedula }, relations: ['especialidadRel'] });
    } catch (err) {
      console.error('Error buscando odontólogo por cédula:', err);
      return null;
    }
  }

  async findByUsuario(userId: string): Promise<Odontologo | null> {
    try {
      return await this.odontologoRepo.findOne({ where: { userId }, relations: ['especialidadRel'] });
    } catch (err) {
      console.error('Error buscando odontólogo por usuario:', err);
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