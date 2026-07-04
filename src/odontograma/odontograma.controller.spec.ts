import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { OdontogramaController } from './odontograma.controller';
import { OdontogramaService } from './odontograma.service';

const ODONTOGRAMA_ID = '6a4025d8ae410bd32b32e659';
const PACIENTE_ID    = '11111111-1111-1111-1111-111111111111';

describe('OdontogramaController', () => {
  let controller: OdontogramaController;

  const mockOdontogramaService = {
    create:          jest.fn(),
    findAll:         jest.fn(),
    findOne:         jest.fn(),
    findByPaciente:  jest.fn(),
    updateDiente:    jest.fn(),
    remove:          jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OdontogramaController],
      providers: [
        { provide: OdontogramaService, useValue: mockOdontogramaService },
      ],
    }).compile();

    controller = module.get<OdontogramaController>(OdontogramaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return SuccessResponseDto with created odontograma', async () => {
      const mockOdontograma = { _id: ODONTOGRAMA_ID, pacienteId: PACIENTE_ID };
      mockOdontogramaService.create.mockResolvedValue(mockOdontograma);
      const result = await controller.create({ pacienteId: PACIENTE_ID } as any);
      expect(result).toEqual({ success: true, message: 'Odontograma creado exitosamente', data: mockOdontograma });
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockOdontogramaService.create.mockResolvedValue(null);
      await expect(controller.create({ pacienteId: PACIENTE_ID } as any)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findAll()', () => {

    const mockResult = { items: [{ _id: ODONTOGRAMA_ID }], page: 1, limit: 10 };

    it('should return SuccessResponseDto with paginated odontogramas', async () => {
      mockOdontogramaService.findAll.mockResolvedValue(mockResult);
      const result = await controller.findAll(1, 10);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockResult);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockOdontogramaService.findAll.mockResolvedValue(null);
      await expect(controller.findAll(1, 10)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findByPaciente()', () => {

    it('should return SuccessResponseDto with odontogramas del paciente', async () => {
      const mockResult = { items: [], page: 1, limit: 10 };
      mockOdontogramaService.findByPaciente.mockResolvedValue(mockResult);
      const result = await controller.findByPaciente(PACIENTE_ID, 1, 10);
      expect(result.success).toBe(true);
    });

    it('should throw InternalServerErrorException when service returns null', async () => {
      mockOdontogramaService.findByPaciente.mockResolvedValue(null);
      await expect(controller.findByPaciente(PACIENTE_ID, 1, 10)).rejects.toThrow(InternalServerErrorException);
    });

  });

  describe('findOne()', () => {

    it('should return SuccessResponseDto with odontograma', async () => {
      const mockOdontograma = { _id: ODONTOGRAMA_ID };
      mockOdontogramaService.findOne.mockResolvedValue(mockOdontograma);
      const result = await controller.findOne(ODONTOGRAMA_ID);
      expect(result).toEqual({ success: true, message: 'Odontograma obtenido exitosamente', data: mockOdontograma });
    });

    it('should throw NotFoundException when odontograma does not exist', async () => {
      mockOdontogramaService.findOne.mockResolvedValue(null);
      await expect(controller.findOne('nonexistentid')).rejects.toThrow(NotFoundException);
    });

  });

  describe('updateDiente()', () => {

    it('should return SuccessResponseDto with updated odontograma', async () => {
      const mockOdontograma = { _id: ODONTOGRAMA_ID };
      mockOdontogramaService.updateDiente.mockResolvedValue(mockOdontograma);
      const result = await controller.updateDiente(ODONTOGRAMA_ID, { numero: 11 } as any);
      expect(result).toEqual({ success: true, message: 'Diente actualizado exitosamente', data: mockOdontograma });
    });

    it('should throw NotFoundException when odontograma does not exist', async () => {
      mockOdontogramaService.updateDiente.mockResolvedValue(null);
      await expect(controller.updateDiente('nonexistentid', { numero: 11 } as any)).rejects.toThrow(NotFoundException);
    });

    it('should call service.updateDiente with correct params', async () => {
      mockOdontogramaService.updateDiente.mockResolvedValue({ _id: ODONTOGRAMA_ID });
      const dto = { numero: 11, superficies: { distal: 'obturado' } } as any;
      await controller.updateDiente(ODONTOGRAMA_ID, dto);
      expect(mockOdontogramaService.updateDiente).toHaveBeenCalledWith(ODONTOGRAMA_ID, dto);
    });

  });

  describe('remove()', () => {

    it('should return SuccessResponseDto with deleted odontograma', async () => {
      const mockOdontograma = { _id: ODONTOGRAMA_ID };
      mockOdontogramaService.remove.mockResolvedValue(mockOdontograma);
      const result = await controller.remove(ODONTOGRAMA_ID);
      expect(result).toEqual({ success: true, message: 'Odontograma eliminado exitosamente', data: mockOdontograma });
    });

    it('should throw NotFoundException when odontograma does not exist', async () => {
      mockOdontogramaService.remove.mockResolvedValue(null);
      await expect(controller.remove('nonexistentid')).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockOdontogramaService.remove.mockResolvedValue({ _id: ODONTOGRAMA_ID });
      await controller.remove(ODONTOGRAMA_ID);
      expect(mockOdontogramaService.remove).toHaveBeenCalledWith(ODONTOGRAMA_ID);
    });

  });

});
