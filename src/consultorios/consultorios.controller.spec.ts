import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ConsultoriosController } from './consultorios.controller';
import { ConsultoriosService } from './consultorios.service';

const CONSULTORIO_ID = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID   = '99999999-9999-9999-9999-999999999999';

describe('ConsultoriosController', () => {
  let controller: ConsultoriosController;

  const mockConsultoriosService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConsultoriosController],
      providers: [
        { provide: ConsultoriosService, useValue: mockConsultoriosService },
      ],
    }).compile();

    controller = module.get<ConsultoriosController>(ConsultoriosController);
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('debe retornar SuccessResponseDto con el consultorio creado', async () => {
      const dto = { nombre: 'Consultorio 1', descripcion: 'Planta baja' };
      const mockConsultorio = { id: CONSULTORIO_ID, ...dto };
      mockConsultoriosService.create.mockResolvedValue(mockConsultorio);

      const result = await controller.create(dto);
      expect(result).toEqual({ success: true, message: 'Consultorio creado exitosamente', data: mockConsultorio });
    });

    it('debe lanzar InternalServerErrorException cuando el service retorna null', async () => {
      mockConsultoriosService.create.mockResolvedValue(null);
      await expect(controller.create({ nombre: 'Consultorio' }))
        .rejects.toThrow(InternalServerErrorException);
    });

    it('debe llamar a consultoriosService.create con el dto proporcionado', async () => {
      const dto = { nombre: 'Consultorio 1' };
      mockConsultoriosService.create.mockResolvedValue({ id: CONSULTORIO_ID, ...dto });
      await controller.create(dto);
      expect(mockConsultoriosService.create).toHaveBeenCalledWith(dto);
    });

  });

  describe('findAll()', () => {

    const mockPagination = {
      items: [{ id: CONSULTORIO_ID, nombre: 'Consultorio A' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('debe retornar SuccessResponseDto con los consultorios paginados', async () => {
      mockConsultoriosService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPagination);
    });

    it('debe lanzar InternalServerErrorException cuando el service retorna null', async () => {
      mockConsultoriosService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any))
        .rejects.toThrow(InternalServerErrorException);
    });

    it('debe limitar el limit a 100 cuando excede 100', async () => {
      mockConsultoriosService.findAll.mockResolvedValue(mockPagination);
      const query = { page: 1, limit: 200 } as any;
      await controller.findAll(query);
      expect(mockConsultoriosService.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 100 }),
      );
    });

  });

  describe('findOne()', () => {

    it('debe retornar SuccessResponseDto cuando el consultorio existe', async () => {
      const mockConsultorio = { id: CONSULTORIO_ID, nombre: 'Consultorio 1' };
      mockConsultoriosService.findOne.mockResolvedValue(mockConsultorio);

      const result = await controller.findOne(CONSULTORIO_ID);
      expect(result).toEqual({ success: true, message: 'Consultorio obtenido exitosamente', data: mockConsultorio });
    });

    it('debe lanzar NotFoundException cuando el consultorio no existe', async () => {
      mockConsultoriosService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar NotFoundException con el mensaje correcto', async () => {
      mockConsultoriosService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow('Consultorio no encontrado');
    });

    it('debe llamar a consultoriosService.findOne con el id correcto', async () => {
      mockConsultoriosService.findOne.mockResolvedValue({ id: CONSULTORIO_ID });
      await controller.findOne(CONSULTORIO_ID);
      expect(mockConsultoriosService.findOne).toHaveBeenCalledWith(CONSULTORIO_ID);
    });

  });

  describe('update()', () => {

    it('debe retornar SuccessResponseDto con el consultorio actualizado', async () => {
      const mockConsultorio = { id: CONSULTORIO_ID, nombre: 'Actualizado' };
      mockConsultoriosService.update.mockResolvedValue(mockConsultorio);

      const result = await controller.update(CONSULTORIO_ID, { nombre: 'Actualizado' });
      expect(result).toEqual({ success: true, message: 'Consultorio actualizado exitosamente', data: mockConsultorio });
    });

    it('debe lanzar NotFoundException cuando el consultorio no existe', async () => {
      mockConsultoriosService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { nombre: 'x' }))
        .rejects.toThrow(NotFoundException);
    });

  });

  describe('remove()', () => {

    it('debe retornar SuccessResponseDto cuando el consultorio se elimina', async () => {
      const mockConsultorio = { id: CONSULTORIO_ID, nombre: 'Consultorio 1' };
      mockConsultoriosService.remove.mockResolvedValue(mockConsultorio);

      const result = await controller.remove(CONSULTORIO_ID);
      expect(result).toEqual({ success: true, message: 'Consultorio eliminado exitosamente', data: mockConsultorio });
    });

    it('debe lanzar NotFoundException cuando el consultorio no existe', async () => {
      mockConsultoriosService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

});
