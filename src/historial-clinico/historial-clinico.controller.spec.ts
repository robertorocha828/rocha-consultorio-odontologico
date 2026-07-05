import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HistorialClinicoController } from './historial-clinico.controller';
import { HistorialClinicoService } from './historial-clinico.service';

const HISTORIAL_ID = '6a4025d8ae410bd32b32e660';
const PACIENTE_ID  = '11111111-1111-1111-1111-111111111111';

describe('HistorialClinicoController', () => {
  let controller: HistorialClinicoController;

  const mockHistorialService = {
    create:          jest.fn(),
    findAll:         jest.fn(),
    findOne:         jest.fn(),
    findByPaciente:  jest.fn(),
    update:          jest.fn(),
    remove:          jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistorialClinicoController],
      providers: [
        { provide: HistorialClinicoService, useValue: mockHistorialService },
      ],
    }).compile();

    controller = module.get<HistorialClinicoController>(HistorialClinicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return SuccessResponseDto with created historial', async () => {
      const mockHistorial = { _id: HISTORIAL_ID, pacienteId: PACIENTE_ID };
      mockHistorialService.create.mockResolvedValue(mockHistorial);
      const result = await controller.create({ pacienteId: PACIENTE_ID } as any);
      expect(result).toEqual({ success: true, message: 'Historial clínico creado exitosamente', data: mockHistorial });
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockHistorialService.create.mockResolvedValue(null);
      await expect(controller.create({ pacienteId: PACIENTE_ID } as any)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findAll()', () => {

    const mockResult = { items: [{ _id: HISTORIAL_ID }], page: 1, limit: 10 };

    it('should return SuccessResponseDto with paginated historiales', async () => {
      mockHistorialService.findAll.mockResolvedValue(mockResult);
      const result = await controller.findAll(1, 10);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockHistorialService.findAll.mockResolvedValue(null);
      await expect(controller.findAll(1, 10)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findByPaciente()', () => {

    it('should return SuccessResponseDto with historiales del paciente', async () => {
      const mockResult = { items: [], page: 1, limit: 10 };
      mockHistorialService.findByPaciente.mockResolvedValue(mockResult);
      const result = await controller.findByPaciente(PACIENTE_ID, 1, 10);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockHistorialService.findByPaciente.mockResolvedValue(null);
      await expect(controller.findByPaciente(PACIENTE_ID, 1, 10)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findOne()', () => {

    it('should return SuccessResponseDto with historial', async () => {
      const mockHistorial = { _id: HISTORIAL_ID };
      mockHistorialService.findOne.mockResolvedValue(mockHistorial);
      const result = await controller.findOne(HISTORIAL_ID);
      expect(result).toEqual({ success: true, message: 'Historial clínico obtenido exitosamente', data: mockHistorial });
    });

    it('should throw NotFoundException when historial does not exist', async () => {
      mockHistorialService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('nonexistentid')).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return SuccessResponseDto with updated historial', async () => {
      const mockHistorial = { _id: HISTORIAL_ID, diagnostico: 'Actualizado' };
      mockHistorialService.update.mockResolvedValue(mockHistorial);
      const result = await controller.update(HISTORIAL_ID, { diagnostico: 'Actualizado' } as any);
      expect(result).toEqual({ success: true, message: 'Historial clínico actualizado exitosamente', data: mockHistorial });
    });

    it('should throw NotFoundException when historial does not exist', async () => {
      mockHistorialService.update.mockResolvedValue(null);
      await expect(controller.update('nonexistentid', { diagnostico: 'x' } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with the correct id and dto', async () => {
      mockHistorialService.update.mockResolvedValue({ _id: HISTORIAL_ID });
      const dto = { diagnostico: 'Nuevo' } as any;
      await controller.update(HISTORIAL_ID, dto);
      expect(mockHistorialService.update).toHaveBeenCalledWith(HISTORIAL_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return SuccessResponseDto with deleted historial', async () => {
      const mockHistorial = { _id: HISTORIAL_ID };
      mockHistorialService.remove.mockResolvedValue(mockHistorial);
      const result = await controller.remove(HISTORIAL_ID);
      expect(result).toEqual({ success: true, message: 'Historial clínico eliminado exitosamente', data: mockHistorial });
    });

    it('should throw NotFoundException when historial does not exist', async () => {
      mockHistorialService.remove.mockResolvedValue(null);
      await expect(controller.remove('nonexistentid')).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockHistorialService.remove.mockResolvedValue({ _id: HISTORIAL_ID });
      await controller.remove(HISTORIAL_ID);
      expect(mockHistorialService.remove).toHaveBeenCalledWith(HISTORIAL_ID);
    });

  });

});
