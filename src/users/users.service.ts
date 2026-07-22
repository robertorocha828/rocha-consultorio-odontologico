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
    const plainPassword = createUserDto.password  // ← guardar antes del hash
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    })
    const saved = await this.userRepository.save(user)
    saved['plainPassword'] = plainPassword  // ← adjuntar temporalmente para el email

    try {
      await this.mailService.sendMail({
        to: saved.email as string,
        subject: 'Bienvenido al Consultorio Odontológico',
        message: `
          <h2>Hola ${saved.username}</h2>
          <p>Se creó una cuenta para ti en el Consultorio Odontológico.</p>
          <p>Tus credenciales de acceso son:</p>
          <ul>
            <li><b>Usuario (email):</b> ${saved.email}</li>
            <li><b>Contraseña:</b> ${plainPassword}</li>
          </ul>
          <p>Por seguridad te recomendamos cambiar tu contraseña después de ingresar.</p>
        `,
      })
      await this.notificacionesService.create({
        destinatario: saved.email as string,
        asunto: 'Bienvenido al Consultorio Odontológico',
        mensaje: `Cuenta creada para ${saved.username} (rol: ${saved.rol})`,
        estado: 'enviado',
        tipo: 'bienvenida',
      })
    } catch (mailErr) {
      console.error('Error enviando correo de bienvenida:', mailErr)
    }

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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      const user = await this.findOne(id);
      if (!user) return null;
      if (updateUserDto.password) {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
      }
      Object.assign(user, updateUserDto);
      return await this.userRepository.save(user);
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