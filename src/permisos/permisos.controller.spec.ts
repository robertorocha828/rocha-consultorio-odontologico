import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PermisosController } from './permisos.controller';
import { PermisosService } from './permisos.service';

const PERMISO_ID   = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('PermisosController', () => {
  let controller: PermisosController;

  const mockPermisosService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermisosController],
      providers: [
        { provide: PermisosService, useValue: mockPermisosService },
      ],
    }).compile();

    controller = module.get<PermisosController>(PermisosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return SuccessResponseDto with created permiso', async () => {
      const mockPermiso = { id: PERMISO_ID, nombre: 'crear_cita' };
      mockPermisosService.create.mockResolvedValue(mockPermiso);
      const result = await controller.create({ nombre: 'crear_cita' } as any);
      expect(result).toEqual({ success: true, message: 'Permiso creado exitosamente', data: mockPermiso });
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockPermisosService.create.mockResolvedValue(null);
      await expect(controller.create({ nombre: 'x' } as any)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findAll()', () => {

    const mockPagination = {
      items: [{ id: PERMISO_ID, nombre: 'crear_cita' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return SuccessResponseDto with paginated permisos', async () => {
      mockPermisosService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.data).toEqual(mockPagination);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockPermisosService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any)).rejects.toThrow(InternalServerErrorException);
    });

    it('should cap limit to 100 when limit exceeds 100', async () => {
      mockPermisosService.findAll.mockResolvedValue(mockPagination);
      const query = { page: 1, limit: 200 } as any;
      await controller.findAll(query);
      expect(mockPermisosService.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }));
    });

  });

  describe('findOne()', () => {

    it('should return SuccessResponseDto with permiso', async () => {
      const mockPermiso = { id: PERMISO_ID, nombre: 'crear_cita' };
      mockPermisosService.findOne.mockResolvedValue(mockPermiso);
      const result = await controller.findOne(PERMISO_ID);
      expect(result).toEqual({ success: true, message: 'Permiso obtenido exitosamente', data: mockPermiso });
    });

    it('should throw NotFoundException when permiso does not exist', async () => {
      mockPermisosService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return SuccessResponseDto with updated permiso', async () => {
      const mockPermiso = { id: PERMISO_ID, descripcion: 'Nueva' };
      mockPermisosService.update.mockResolvedValue(mockPermiso);
      const result = await controller.update(PERMISO_ID, { descripcion: 'Nueva' } as any);
      expect(result).toEqual({ success: true, message: 'Permiso actualizado exitosamente', data: mockPermiso });
    });

    it('should throw NotFoundException when permiso does not exist', async () => {
      mockPermisosService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { descripcion: 'x' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with the correct id and dto', async () => {
      mockPermisosService.update.mockResolvedValue({ id: PERMISO_ID });
      const dto = { descripcion: 'Nueva' } as any;
      await controller.update(PERMISO_ID, dto);
      expect(mockPermisosService.update).toHaveBeenCalledWith(PERMISO_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return SuccessResponseDto with deleted permiso', async () => {
      const mockPermiso = { id: PERMISO_ID, nombre: 'crear_cita' };
      mockPermisosService.remove.mockResolvedValue(mockPermiso);
      const result = await controller.remove(PERMISO_ID);
      expect(result).toEqual({ success: true, message: 'Permiso eliminado exitosamente', data: mockPermiso });
    });

    it('should throw NotFoundException when permiso does not exist', async () => {
      mockPermisosService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockPermisosService.remove.mockResolvedValue({ id: PERMISO_ID });
      await controller.remove(PERMISO_ID);
      expect(mockPermisosService.remove).toHaveBeenCalledWith(PERMISO_ID);
    });

  });

});
