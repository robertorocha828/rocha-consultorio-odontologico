import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const USER_ID      = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    create:      jest.fn(),
    findAll:     jest.fn(),
    findOne:     jest.fn(),
    update:      jest.fn(),
    remove:      jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return SuccessResponseDto with created user', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com' };
      mockUsersService.create.mockResolvedValue(mockUser);
      const result = await controller.create({ email: 'test@test.com', password: '123456' } as any);
      expect(result).toEqual({ success: true, message: 'Usuario creado exitosamente', data: mockUser });
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockUsersService.create.mockResolvedValue(null);
      await expect(controller.create({ email: 'x' } as any)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findAll()', () => {

    const mockPagination = {
      items: [{ id: USER_ID, email: 'test@test.com' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return SuccessResponseDto with paginated users', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.data).toEqual(mockPagination);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockUsersService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any)).rejects.toThrow(InternalServerErrorException);
    });

    it('should cap limit to 100 when limit exceeds 100', async () => {
      mockUsersService.findAll.mockResolvedValue(mockPagination);
      const query = { page: 1, limit: 200 } as any;
      await controller.findAll(query);
      expect(mockUsersService.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }));
    });

  });

  describe('findOne()', () => {

    it('should return SuccessResponseDto with user', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com' };
      mockUsersService.findOne.mockResolvedValue(mockUser);
      const result = await controller.findOne(USER_ID);
      expect(result).toEqual({ success: true, message: 'Usuario obtenido exitosamente', data: mockUser });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUsersService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return SuccessResponseDto with updated user', async () => {
      const mockUser = { id: USER_ID, rol: 'admin' };
      mockUsersService.update.mockResolvedValue(mockUser);
      const result = await controller.update(USER_ID, { rol: 'admin' } as any);
      expect(result).toEqual({ success: true, message: 'Usuario actualizado exitosamente', data: mockUser });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUsersService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { rol: 'admin' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with the correct id and dto', async () => {
      mockUsersService.update.mockResolvedValue({ id: USER_ID });
      const dto = { rol: 'admin' } as any;
      await controller.update(USER_ID, dto);
      expect(mockUsersService.update).toHaveBeenCalledWith(USER_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return SuccessResponseDto with deleted user', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com' };
      mockUsersService.remove.mockResolvedValue(mockUser);
      const result = await controller.remove(USER_ID);
      expect(result).toEqual({ success: true, message: 'Usuario eliminado exitosamente', data: mockUser });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUsersService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockUsersService.remove.mockResolvedValue({ id: USER_ID });
      await controller.remove(USER_ID);
      expect(mockUsersService.remove).toHaveBeenCalledWith(USER_ID);
    });

  });

});
