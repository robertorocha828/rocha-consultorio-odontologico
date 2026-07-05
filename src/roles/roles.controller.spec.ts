import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

const ROL_ID       = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('RolesController', () => {
  let controller: RolesController;

  const mockRolesService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        { provide: RolesService, useValue: mockRolesService },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return SuccessResponseDto with created rol', async () => {
      const mockRol = { id: ROL_ID, nombre: 'admin' };
      mockRolesService.create.mockResolvedValue(mockRol);
      const result = await controller.create({ nombre: 'admin' } as any);
      expect(result).toEqual({ success: true, message: 'Rol creado exitosamente', data: mockRol });
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockRolesService.create.mockResolvedValue(null);
      await expect(controller.create({ nombre: 'x' } as any)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findAll()', () => {

    const mockPagination = {
      items: [{ id: ROL_ID, nombre: 'admin' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return SuccessResponseDto with paginated roles', async () => {
      mockRolesService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.data).toEqual(mockPagination);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockRolesService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any)).rejects.toThrow(InternalServerErrorException);
    });

    it('should cap limit to 100 when limit exceeds 100', async () => {
      mockRolesService.findAll.mockResolvedValue(mockPagination);
      const query = { page: 1, limit: 200 } as any;
      await controller.findAll(query);
      expect(mockRolesService.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }));
    });

  });

  describe('findOne()', () => {

    it('should return SuccessResponseDto with rol', async () => {
      const mockRol = { id: ROL_ID, nombre: 'admin' };
      mockRolesService.findOne.mockResolvedValue(mockRol);
      const result = await controller.findOne(ROL_ID);
      expect(result).toEqual({ success: true, message: 'Rol obtenido exitosamente', data: mockRol });
    });

    it('should throw NotFoundException when rol does not exist', async () => {
      mockRolesService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return SuccessResponseDto with updated rol', async () => {
      const mockRol = { id: ROL_ID, descripcion: 'Nueva' };
      mockRolesService.update.mockResolvedValue(mockRol);
      const result = await controller.update(ROL_ID, { descripcion: 'Nueva' } as any);
      expect(result).toEqual({ success: true, message: 'Rol actualizado exitosamente', data: mockRol });
    });

    it('should throw NotFoundException when rol does not exist', async () => {
      mockRolesService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { descripcion: 'x' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with the correct id and dto', async () => {
      mockRolesService.update.mockResolvedValue({ id: ROL_ID });
      const dto = { descripcion: 'Nueva' } as any;
      await controller.update(ROL_ID, dto);
      expect(mockRolesService.update).toHaveBeenCalledWith(ROL_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return SuccessResponseDto with deleted rol', async () => {
      const mockRol = { id: ROL_ID, nombre: 'admin' };
      mockRolesService.remove.mockResolvedValue(mockRol);
      const result = await controller.remove(ROL_ID);
      expect(result).toEqual({ success: true, message: 'Rol eliminado exitosamente', data: mockRol });
    });

    it('should throw NotFoundException when rol does not exist', async () => {
      mockRolesService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockRolesService.remove.mockResolvedValue({ id: ROL_ID });
      await controller.remove(ROL_ID);
      expect(mockRolesService.remove).toHaveBeenCalledWith(ROL_ID);
    });

  });

});
