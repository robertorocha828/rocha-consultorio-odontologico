import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';

const PACIENTE_ID  = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('PacientesController', () => {
  let controller: PacientesController;

  const mockPacientesService = {
    create:                jest.fn(),
    findAll:               jest.fn(),
    findOne:               jest.fn(),
    findByCedula:          jest.fn(),
    update:                jest.fn(),
    remove:                jest.fn(),
    findOneConOdontograma: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacientesController],
      providers: [
        { provide: PacientesService, useValue: mockPacientesService },
      ],
    }).compile();

    controller = module.get<PacientesController>(PacientesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return SuccessResponseDto with created paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacientesService.create.mockResolvedValue(mockPaciente);
      const result = await controller.create({ nombre: 'Juan' } as any);
      expect(result).toEqual({ success: true, message: 'Paciente creado exitosamente', data: mockPaciente });
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockPacientesService.create.mockResolvedValue(null);
      await expect(controller.create({ nombre: 'x' } as any)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findAll()', () => {

    const mockPagination = {
      items: [{ id: PACIENTE_ID, nombre: 'Juan' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return SuccessResponseDto with paginated pacientes', async () => {
      mockPacientesService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.data).toEqual(mockPagination);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockPacientesService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any)).rejects.toThrow(InternalServerErrorException);
    });

    it('should cap limit to 100 when limit exceeds 100', async () => {
      mockPacientesService.findAll.mockResolvedValue(mockPagination);
      const query = { page: 1, limit: 200 } as any;
      await controller.findAll(query);
      expect(mockPacientesService.findAll).toHaveBeenCalledWith(expect.objectContaining({ limit: 100 }));
    });

  });

  describe('findByCedula()', () => {

    it('should return SuccessResponseDto with paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, cedula: '1234567890' };
      mockPacientesService.findByCedula.mockResolvedValue(mockPaciente);
      const result = await controller.findByCedula('1234567890');
      expect(result).toEqual({ success: true, message: 'Paciente obtenido exitosamente', data: mockPaciente });
    });

    it('should throw NotFoundException when paciente does not exist', async () => {
      mockPacientesService.findByCedula.mockResolvedValue(null);
      await expect(controller.findByCedula('0000000000')).rejects.toThrow(NotFoundException);
    });

  });

  describe('findOneConOdontograma()', () => {

    it('should return SuccessResponseDto with paciente and odontograma', async () => {
      const mockResult = { paciente: { id: PACIENTE_ID }, odontograma: { items: [] } };
      mockPacientesService.findOneConOdontograma.mockResolvedValue(mockResult);
      const result = await controller.findOneConOdontograma(PACIENTE_ID);
      expect(result).toEqual({ success: true, message: 'Paciente con odontograma obtenido', data: mockResult });
    });

    it('should throw NotFoundException when paciente does not exist', async () => {
      mockPacientesService.findOneConOdontograma.mockResolvedValue(null);
      await expect(controller.findOneConOdontograma(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('findOne()', () => {

    it('should return SuccessResponseDto with paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacientesService.findOne.mockResolvedValue(mockPaciente);
      const result = await controller.findOne(PACIENTE_ID);
      expect(result).toEqual({ success: true, message: 'Paciente obtenido exitosamente', data: mockPaciente });
    });

    it('should throw NotFoundException when paciente does not exist', async () => {
      mockPacientesService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return SuccessResponseDto with updated paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan v2' };
      mockPacientesService.update.mockResolvedValue(mockPaciente);
      const result = await controller.update(PACIENTE_ID, { nombre: 'Juan v2' } as any);
      expect(result).toEqual({ success: true, message: 'Paciente actualizado exitosamente', data: mockPaciente });
    });

    it('should throw NotFoundException when paciente does not exist', async () => {
      mockPacientesService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { nombre: 'x' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with the correct id and dto', async () => {
      mockPacientesService.update.mockResolvedValue({ id: PACIENTE_ID, nombre: 'Nuevo' });
      const dto = { nombre: 'Nuevo' } as any;
      await controller.update(PACIENTE_ID, dto);
      expect(mockPacientesService.update).toHaveBeenCalledWith(PACIENTE_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return SuccessResponseDto with deleted paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacientesService.remove.mockResolvedValue(mockPaciente);
      const result = await controller.remove(PACIENTE_ID);
      expect(result).toEqual({ success: true, message: 'Paciente eliminado exitosamente', data: mockPaciente });
    });

    it('should throw NotFoundException when paciente does not exist', async () => {
      mockPacientesService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockPacientesService.remove.mockResolvedValue({ id: PACIENTE_ID });
      await controller.remove(PACIENTE_ID);
      expect(mockPacientesService.remove).toHaveBeenCalledWith(PACIENTE_ID);
    });

  });

});
