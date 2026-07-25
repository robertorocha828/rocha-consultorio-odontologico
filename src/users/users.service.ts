import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Pagination } from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryDto } from 'src/common/dto/query.dto';
import { MailService } from '../mail/mail.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { emailTemplate } from '../mail/email-template';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
    private readonly notificacionesService: NotificacionesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User | null> {
    try {
      const plainPassword = createUserDto.password
      const hashedPassword = await bcrypt.hash(plainPassword, 10)
      const user = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      })
      const saved = await this.userRepository.save(user)

      this.mailService.sendMail({
        to: saved.email as string,
        subject: 'Bienvenido a DentalCare',
        message: emailTemplate({
          titulo: `¡Bienvenido, ${saved.username}!`,
          contenidoHtml: `
            <p>Se creó una cuenta para ti en <b>DentalCare</b>. Estas son tus credenciales de acceso:</p>
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;font-size:14px;width:100%;">
              <tr>
                <td style="padding:6px 12px 6px 0;color:#7a8a96;">Usuario (email):</td>
                <td style="font-weight:600;color:#0a2540;">${saved.email}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px 6px 0;color:#7a8a96;">Contraseña:</td>
                <td style="font-weight:600;color:#0a2540;">${plainPassword}</td>
              </tr>
            </table>
            <p>Por seguridad te recomendamos cambiar tu contraseña después de ingresar.</p>
          `,
        }),
      }).catch((mailErr) => console.error('Error enviando correo de bienvenida:', mailErr))

      this.notificacionesService.create({
        destinatario: saved.email as string,
        asunto: 'Bienvenido a DentalCare',
        mensaje: `Cuenta creada para ${saved.username} (rol: ${saved.rol})`,
        estado: 'enviado',
        tipo: 'bienvenida',
      }).catch((notifErr) => console.error('Error registrando notificación de bienvenida:', notifErr))

      return saved
    } catch (err) {
      console.error('Error creando usuario:', err)
      return null
    }
  }

  async findAll(queryDto: QueryDto): Promise<Pagination<User> | null> {
    try {
      const { page, limit, search, sort, order } = queryDto;
      const query = this.userRepository.createQueryBuilder('user');
      if (search) {
        query.where(
          '(user.username ILIKE :search OR user.email ILIKE :search)',
          { search: `%${search}%` },
        );
      }
      if (sort) {
        query.orderBy(`user.${sort}`, (order ?? 'ASC') as 'ASC' | 'DESC');
      }
      return await paginate<User>(query, { page, limit });
    } catch (err) {
      console.error('Error listando usuarios:', err);
      return null;
    }
  }

  async findByRol(rol: string): Promise<User[]> {
    try {
      return await this.userRepository.find({ where: { rol } });
    } catch (err) {
      console.error('Error listando usuarios por rol:', err);
      return [];
    }
  }

  async findOne(id: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (err) {
      console.error('Error buscando usuario:', err);
      return null;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { email } });
    } catch (err) {
      return null;
    }
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { googleId } });
    } catch (err) {
      return null;
    }
  }

  async createFromGoogle(data: {
    username: string;
    email: string;
    googleId: string;
    avatarUrl?: string;
  }): Promise<User | null> {
    try {
      const user = this.userRepository.create({
        username: data.username,
        email: data.email,
        googleId: data.googleId,
        avatarUrl: data.avatarUrl,
        rol: 'paciente',
      });
      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error creando usuario desde Google:', err);
      return null;
    }
  }

  async linkGoogleAccount(userId: string, googleId: string, avatarUrl?: string): Promise<User | null> {
    try {
      const user = await this.findOne(userId);
      if (!user) return null;
      user.googleId = googleId;
      if (avatarUrl) user.avatarUrl = avatarUrl;
      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error vinculando cuenta de Google:', err);
      return null;
    }
  }

  async unlinkGoogleAccount(userId: string): Promise<User | null> {
    try {
      const user = await this.findOne(userId);
      if (!user) return null;
      user.googleId = null as unknown as string;
      return await this.userRepository.save(user);
    } catch (err) {
      console.error('Error desvinculando cuenta de Google:', err);
      return null;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;

      const rolAnterior = user.rol;

      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      Object.assign(user, updateUserDto);
      const saved = await this.userRepository.save(user);

      if (updateUserDto.rol && updateUserDto.rol !== rolAnterior) {
        this.notificacionesService.create({
          destinatario: saved.email as string,
          asunto: 'Cambio de rol',
          mensaje: `El usuario ${saved.username} cambió de rol: ${rolAnterior} → ${saved.rol}`,
          estado: 'enviado',
          tipo: 'cambio-rol',
        }).catch((notifErr) => console.error('Error registrando notificación de cambio de rol:', notifErr))
      }

      return saved;
    } catch (err) {
      console.error('Error actualizando usuario:', err);
      return null;
    }
  }

  async remove(id: string): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;
      return await this.userRepository.remove(user);
    } catch (err) {
      console.error('Error eliminando usuario:', err);
      return null;
    }
  }
}