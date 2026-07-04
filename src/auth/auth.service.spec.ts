jest.mock('bcrypt', () => ({
  hash:    jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
    create:      jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  const mockMailService = {
    sendMail: jest.fn().mockResolvedValue({}),
  };

  const mockNotificacionesService = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService,          useValue: mockUsersService },
        { provide: JwtService,            useValue: mockJwtService },
        { provide: MailService,           useValue: mockMailService },
        { provide: NotificacionesService, useValue: mockNotificacionesService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login()', () => {

    const loginDto = { email: 'test@test.com', password: '123456' };
    const mockUser = { id: 'user-id', email: 'test@test.com', password: 'hashed', rol: 'admin' };

    it('should return access_token when credentials are correct', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      const result = await service.login(loginDto);
      expect(result).toEqual({ access_token: 'mock_token' });
    });

    it('should call jwtService.sign with correct payload', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      await service.login(loginDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: mockUser.id, email: mockUser.email, rol: mockUser.rol });
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      mockUsersService.findByEmail.mockResolvedValue(null);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should call bcrypt.compare with provided password and hashed password', async () => {
      mockUsersService.findByEmail.mockResolvedValue(mockUser);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      await service.login(loginDto);
      expect(mockBcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.password);
    });

  });

  describe('register()', () => {

    const createUserDto = { username: 'test', email: 'test@test.com', password: '123456', rol: 'usuario' } as any;
    const mockUser      = { id: 'user-id', username: 'test', email: 'test@test.com', rol: 'usuario' };

    it('should return access_token after successful registration', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      const result = await service.register(createUserDto);
      expect(result).toEqual({ access_token: 'mock_token' });
    });

    it('should call usersService.create with the provided dto', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      await service.register(createUserDto);
      expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should call mailService.sendMail after registration', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      await service.register(createUserDto);
      expect(mockMailService.sendMail).toHaveBeenCalled();
    });

    it('should call notificacionesService.create after sending mail', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      await service.register(createUserDto);
      expect(mockNotificacionesService.create).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when usersService.create returns null', async () => {
      mockUsersService.create.mockResolvedValue(null);
      await expect(service.register(createUserDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should still return token even if sendMail throws', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      mockMailService.sendMail.mockRejectedValue(new Error('SMTP error'));
      const result = await service.register(createUserDto);
      expect(result).toEqual({ access_token: 'mock_token' });
    });

    it('should call jwtService.sign with correct payload', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);
      await service.register(createUserDto);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: mockUser.id, email: mockUser.email, rol: mockUser.rol });
    });

  });

});
