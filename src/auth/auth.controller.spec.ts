import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login:    jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login()', () => {

    const loginDto = { email: 'test@test.com', password: '123456' };

    it('should return access_token when credentials are correct', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'mock_token' });
      const result = await controller.login(loginDto);
      expect(result).toEqual({ access_token: 'mock_token' });
    });

    it('should call authService.login with the provided dto', async () => {
      mockAuthService.login.mockResolvedValue({ access_token: 'mock_token' });
      await controller.login(loginDto);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });

    it('should propagate UnauthorizedException when credentials are incorrect', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Credenciales inválidas'));
      await expect(controller.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

  });

  describe('register()', () => {

    const registerDto = { username: 'test', email: 'test@test.com', password: '123456', rol: 'usuario' } as any;

    it('should return access_token after successful registration', async () => {
      mockAuthService.register.mockResolvedValue({ access_token: 'mock_token' });
      const result = await controller.register(registerDto);
      expect(result).toEqual({ access_token: 'mock_token' });
    });

    it('should call authService.register with the provided dto', async () => {
      mockAuthService.register.mockResolvedValue({ access_token: 'mock_token' });
      await controller.register(registerDto);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should propagate UnauthorizedException when registration fails', async () => {
      mockAuthService.register.mockRejectedValue(new UnauthorizedException('Error al registrar usuario'));
      await expect(controller.register(registerDto)).rejects.toThrow(UnauthorizedException);
    });

  });

});
