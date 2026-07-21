import { Controller, Post, Body, Get, Delete, UseGuards, Req, Res, Query } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('register/paciente')
  registerPaciente(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerPaciente(createUserDto)
  }

  // Inicia el flujo de Google. Si viene ?state=<userId>, es una vinculación
  // desde /perfil de un usuario ya logueado; si no, es un login/registro nuevo.
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const { access_token } = await this.authService.googleLogin(req.user as any);
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/google/callback?token=${access_token}`);
  }

  @Delete('google')
  @UseGuards(JwtAuthGuard)
  unlinkGoogle(@Req() req: Request) {
    return this.authService.unlinkGoogleAccount((req.user as any).id);
  }
}