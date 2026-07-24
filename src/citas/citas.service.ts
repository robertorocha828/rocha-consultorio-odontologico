import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Cita, EstadoCita } from './cita.entity';
import { CreateCitaDto } from './dto/create-cita.dto';
import { UpdateCitaDto } from './dto/update-cita.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { MailService } from '../mail/mail.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { HorariosService } from '../horarios/horarios.service';
import { DiaSemana } from '../horarios/horario.entity';
import { emailTemplate } from '../mail/email-template';

const DIAS_JS_ORDER: DiaSemana[] = [
  DiaSemana.DOMINGO, DiaSemana.LUNES, DiaSemana.MARTES, DiaSemana.MIERCOLES,
  DiaSemana.JUEVES, DiaSemana.VIERNES, DiaSemana.SABADO,
];

function formatearFecha(fechaHora: string | Date): string {
  const fecha = new Date(fechaHora);
  const texto = fecha.toLocaleString('es-EC', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function esMismoDiaOAnterior(fecha: Date, referencia: Date): boolean {
  const f = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate());
  const r = new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate());
  return f.getTime() <= r.getTime();
}

@Injectable()
export class CitasService {
  constructor(
    @InjectRepository(Cita)
    private readonly citaRepo: Repository<Cita>,
    private readonly mailService: MailService,
    private readonly notificacionesService: NotificacionesService,
    private readonly horariosService: HorariosService,
  ) {}

  async create(dto: CreateCitaDto): Promise<Cita | null> {
    if (dto.fechaHora) {
      const fecha = new Date(dto.fechaHora);

      if (fecha.getTime() < Date.now()) {
        throw new BadRequestException('No puedes agendar una cita en una fecha u hora que ya pasó');
      }

      const dia = DIAS_JS_ORDER[fecha.getDay()];
      const hora = `${String(fecha.getHours()).padStart(2, '0')}:${String(fecha.getMinutes()).padStart(2, '0')}`;
      const disponible = await this.horariosService.existeHorarioDisponible(dia, hora);
      if (!disponible) {
        throw new BadRequestException('No hay horario de atención disponible para esa fecha y hora');
      }
    }

    if (dto.odontologoId && dto.fechaHora) {
      const conflicto = await this.citaRepo.findOne({
        where: {
          odontologoId: dto.odontologoId,
          fechaHora: dto.fechaHora,
          estado: EstadoCita.AGENDADA,
        },
      });
      if (conflicto) {
        throw new ConflictException('Ese odontólogo ya tiene una cita agendada en ese horario');
      }
    }

    try {
      const cita = this.citaRepo.create(dto);
      const saved = await this.citaRepo.save(cita);

      if (dto.emailPaciente) {
        try {
          await this.mailService.sendMail({
            to: dto.emailPaciente,
            subject: 'Confirmación de tu cita — DentalCare',
            message: emailTemplate({
              titulo: 'Tu cita fue agendada',
              contenidoHtml: `
                <p>Confirmamos tu cita en <b>DentalCare</b>:</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;font-size:14px;width:100%;">
                  <tr>
                    <td style="padding:6px 12px 6px 0;color:#7a8a96;">Motivo:</td>
                    <td style="font-weight:600;color:#0a2540;">${dto.motivo}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 12px 6px 0;color:#7a8a96;">Fecha:</td>
                    <td style="font-weight:600;color:#0a2540;">${formatearFecha(dto.fechaHora as unknown as string)}</td>
                  </tr>
                </table>
                <p>Si necesitas reprogramar o cancelar, contáctanos con anticipación.</p>
              `,
            }),
          });
          await this.notificacionesService.create({
            destinatario: dto.emailPaciente,
            asunto: 'Confirmación de cita — DentalCare',
            mensaje: `Cita agendada para ${dto.motivo}`,
            estado: 'enviado',
            tipo: 'cita',
          });
        } catch (err) {
          console.error('Error enviando email de cita:', err);
        }
      }

      return saved;
    } catch (err) {
      console.error('Error creando cita:', err);
      return null;
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<Cita> | null> {
    try {
      const { page, limit, search, searchField, sort, order } = queryDto;
      const query = this.citaRepo.createQueryBuilder('cita');
      if (search) {
        if (searchField) {
          switch (searchField) {
            case 'motivo':
              query.where('cita.motivo ILIKE :search', { search: `%${search}%` });
              break;
            case 'pacienteId':
              query.where('cita.pacienteId = :search', { search });
              break;
            case 'odontologoId':
              query.where('cita.odontologoId = :search', { search });
              break;
            default:
              query.where('cita.motivo ILIKE :search', { search: `%${search}%` });
          }
        } else {
          query.where('cita.motivo ILIKE :search', { search: `%${search}%` });
        }
      }
      if (sort) {
        query.orderBy(`cita.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }
      return await paginate<Cita>(query, { page, limit });
    } catch (err) {
      console.error('Error listando citas:', err);
      return null;
    }
  }

  async findOne(id: string): Promise<Cita | null> {
    try {
      return await this.citaRepo.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando cita:', err);
      return null;
    }
  }

  async findByPaciente(pacienteId: string, queryDto: QueryDto): Promise<Pagination<Cita> | null> {
    try {
      const { page, limit } = queryDto;
      const query = this.citaRepo
        .createQueryBuilder('cita')
        .where('cita.pacienteId = :pacienteId', { pacienteId })
        .orderBy('cita.fechaHora', 'DESC');
      return await paginate<Cita>(query, { page, limit });
    } catch (err) {
      console.error('Error buscando citas por paciente:', err);
      return null;
    }
  }

  async findByOdontologo(odontologoId: string, queryDto: QueryDto): Promise<Pagination<Cita> | null> {
    try {
      const { page, limit } = queryDto;
      const query = this.citaRepo
        .createQueryBuilder('cita')
        .where('cita.odontologoId = :odontologoId', { odontologoId })
        .orderBy('cita.fechaHora', 'ASC');
      return await paginate<Cita>(query, { page, limit });
    } catch (err) {
      console.error('Error buscando citas por odontólogo:', err);
      return null;
    }
  }

  async update(id: string, dto: UpdateCitaDto): Promise<Cita | null> {
    try {
      const cita = await this.findOne(id);
      if (!cita) return null;

      if (dto.estado === EstadoCita.COMPLETADA && cita.fechaHora) {
        const fechaCita = new Date(cita.fechaHora);
        if (!esMismoDiaOAnterior(fechaCita, new Date())) {
          throw new BadRequestException(
            'No puedes atender esta cita todavía: su fecha programada es posterior a hoy',
          );
        }
      }

      Object.assign(cita, dto);
      return await this.citaRepo.save(cita);
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      console.error('Error actualizando cita:', err);
      return null;
    }
  }

  async remove(id: string): Promise<Cita | null> {
    try {
      const cita = await this.findOne(id);
      if (!cita) return null;
      return await this.citaRepo.remove(cita);
    } catch (err) {
      console.error('Error eliminando cita:', err);
      return null;
    }
  }
}