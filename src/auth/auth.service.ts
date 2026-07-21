import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly notificacionesService: NotificacionesService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { id: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    if (!user) throw new UnauthorizedException('Error al registrar usuario');

    try {
      await this.mailService.sendMail({
        to: user.email,
        subject: 'Bienvenido al Consultorio Odontológico',
        message: `
          <h2>Hola ${user.username}</h2>
          <p>Tu cuenta fue creada exitosamente.</p>
          <p>Tus credenciales de acceso son:</p>
          <ul>
            <li><b>Email:</b> ${user.email}</li>
            <li><b>Contraseña:</b> ${user['plainPassword']}</li>
          </ul>
          <p>Por seguridad te recomendamos cambiar tu contraseña después de ingresar.</p>
        `,
            })
      await this.notificacionesService.create({
        destinatario: user.email,
        asunto: 'Bienvenido al Consultorio Odontológico',
        mensaje: `Cuenta creada para ${user.username}`,
        estado: 'enviado',
        tipo: 'bienvenida',
      });
    } catch (err) {
      console.error('Error enviando email:', err);
    }

    const payload = { id: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }

  async registerPaciente(createUserDto: CreateUserDto) {
  const user = await this.usersService.create({
    ...createUserDto,
    rol: 'paciente',  // ← forzado, no importa lo que venga en el body
  })
  if (!user) throw new UnauthorizedException('Error al registrar paciente')

  try {
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Bienvenido al Consultorio Odontológico',
      message: `
        <h2>Hola ${user.username}</h2>
        <p>Tu cuenta de paciente fue creada exitosamente.</p>
        <p>Tus credenciales de acceso son:</p>
        <ul>
          <li><b>Email:</b> ${user.email}</li>
          <li><b>Contraseña:</b> ${user['plainPassword']}</li>
        </ul>
      `,
    })
    await this.notificacionesService.create({
      destinatario: user.email,
      asunto: 'Bienvenido al Consultorio Odontológico',
      mensaje: `Cuenta de paciente creada para ${user.username}`,
      estado: 'enviado',
      tipo: 'bienvenida',
    })
  } catch (err) {
    console.error('Error enviando email:', err)
  }

  const payload = { id: user.id, email: user.email, rol: user.rol }
  return { access_token: this.jwtService.sign(payload) }
}

  // Recibe lo que devuelve GoogleStrategy.validate() y decide: vincular a un
  // usuario ya logueado (linkUserId viene del ?state=), iniciar sesión si el
  // googleId ya existe, o crear una cuenta nueva de paciente si es la primera vez.
  async googleLogin(googleProfile: {
    googleId: string;
    email?: string;
    username?: string;
    avatarUrl?: string;
    linkUserId?: string;
  }) {
    if (!googleProfile.email) {
      throw new UnauthorizedException('Tu cuenta de Google no tiene un email público');
    }

    if (googleProfile.linkUserId) {
      const linked = await this.usersService.linkGoogleAccount(
        googleProfile.linkUserId,
        googleProfile.googleId,
        googleProfile.avatarUrl,
      );
      if (!linked) throw new UnauthorizedException('No se pudo vincular la cuenta de Google');
      const payload = { id: linked.id, email: linked.email, rol: linked.rol };
      return { access_token: this.jwtService.sign(payload) };
    }

    let user = await this.usersService.findByGoogleId(googleProfile.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(googleProfile.email);
      if (user) {
        user = await this.usersService.linkGoogleAccount(
          user.id as string,
          googleProfile.googleId,
          googleProfile.avatarUrl,
        );
      } else {
        user = await this.usersService.createFromGoogle({
          username: googleProfile.username ?? googleProfile.email,
          email: googleProfile.email,
          googleId: googleProfile.googleId,
          avatarUrl: googleProfile.avatarUrl,
        });
      }
    }

    if (!user) throw new UnauthorizedException('No se pudo iniciar sesión con Google');

    const payload = { id: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }

  async unlinkGoogleAccount(userId: string) {
    const user = await this.usersService.unlinkGoogleAccount(userId);
    if (!user) throw new UnauthorizedException('No se pudo desvincular la cuenta de Google');
    return { success: true };
  }
}