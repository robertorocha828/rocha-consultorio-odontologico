import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { id: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }

  // usersService.create() ya se encarga de enviar el correo de bienvenida
  // y de registrar la notificación — no lo dupliques aquí.
  async register(createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    if (!user) throw new UnauthorizedException('Error al registrar usuario');

    const payload = { id: user.id, email: user.email, rol: user.rol };
    return { access_token: this.jwtService.sign(payload) };
  }

  async registerPaciente(createUserDto: CreateUserDto) {
    const user = await this.usersService.create({
      ...createUserDto,
      rol: 'paciente',
    })
    if (!user) throw new UnauthorizedException('Error al registrar paciente')

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