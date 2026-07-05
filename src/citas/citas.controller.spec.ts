import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CitasController } from './citas.controller';
import { CitasService } from './citas.service';

const CITA_ID      = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('CitasController', () => {
  let controller: CitasController;

  const mockCitasService = {
    create:          jest.fn(),
    findAll:         jest.fn(),
    findOne:         jest.fn(),
    findByPaciente:  jest.fn(),
    findByOdontologo: jest.fn(),
    update:          jest.fn(),
    remove:          jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CitasController],
      providers: [
        { provide: CitasService, useValue: mockCitasService },
      ],
    }).compile();

    controller = module.get<CitasController>(CitasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return SuccessResponseDto with created cita', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitasService.create.mockResolvedValue(mockCita);
      const result = await controller.create({ motivo: 'Limpieza' } as any);
      expect(result).toEqual({ success: true, message: 'Cita creada exitosamente', data: mockCita });
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockCitasService.create.mockResolvedValue(null);
      await expect(controller.create({ motivo: 'x' } as any)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findAll()', () => {

    const mockPagination = {
      items: [{ id: CITA_ID, motivo: 'Limpieza' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return SuccessResponseDto with paginated citas', async () => {
      mockCitasService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.data).toEqual(mockPagination);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockCitasService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any)).rejects.toThrow(InternalServerErrorException);
    });

    it('should cap limit to 100 when limit exceeds 100', async () => {
      mockCitasService.findAll.mockResolvedValue(mockPagination);
      const query = { page: 1, limit: 200 } as any;
      await controller.findAll(query);
      expect(mockCitasService.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }));
    });

  });

  describe('findByPaciente()', () => {

    it('should return SuccessResponseDto with citas del paciente', async () => {
      const mockResult = { items: [{ id: CITA_ID }], page: 1, limit: 10 };
      mockCitasService.findByPaciente.mockResolvedValue(mockResult);
      const result = await controller.findByPaciente('pac-id', { page: 1, limit: 10 } as any);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockCitasService.findByPaciente.mockResolvedValue(null);
      await expect(controller.findByPaciente('pac-id', { page: 1, limit: 10 } as any))
        .rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findOne()', () => {

    it('should return SuccessResponseDto with cita', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitasService.findOne.mockResolvedValue(mockCita);
      const result = await controller.findOne(CITA_ID);
      expect(result).toEqual({ success: true, message: 'Cita obtenida exitosamente', data: mockCita });
    });

    it('should throw NotFoundException when cita does not exist', async () => {
      mockCitasService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return SuccessResponseDto with updated cita', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Revisión' };
      mockCitasService.update.mockResolvedValue(mockCita);
      const result = await controller.update(CITA_ID, { motivo: 'Revisión' } as any);
      expect(result).toEqual({ success: true, message: 'Cita actualizada exitosamente', data: mockCita });
    });

    it('should throw NotFoundException when cita does not exist', async () => {
      mockCitasService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { motivo: 'x' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with the correct id and dto', async () => {
      mockCitasService.update.mockResolvedValue({ id: CITA_ID });
      const dto = { motivo: 'Nuevo' } as any;
      await controller.update(CITA_ID, dto);
      expect(mockCitasService.update).toHaveBeenCalledWith(CITA_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return SuccessResponseDto with deleted cita', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitasService.remove.mockResolvedValue(mockCita);
      const result = await controller.remove(CITA_ID);
      expect(result).toEqual({ success: true, message: 'Cita eliminada exitosamente', data: mockCita });
    });

    it('should throw NotFoundException when cita does not exist', async () => {
      mockCitasService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockCitasService.remove.mockResolvedValue({ id: CITA_ID });
      await controller.remove(CITA_ID);
      expect(mockCitasService.remove).toHaveBeenCalledWith(CITA_ID);
    });

  });

});
