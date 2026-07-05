import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { OdontologosController } from './odontologos.controller';
import { OdontologosService } from './odontologos.service';

const ODONTOLOGO_ID = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID  = '99999999-9999-9999-9999-999999999999';

describe('OdontologosController', () => {
  let controller: OdontologosController;

  const mockService = {
    create:       jest.fn(),
    findAll:      jest.fn(),
    findOne:      jest.fn(),
    findByCedula: jest.fn(),
    update:       jest.fn(),
    remove:       jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OdontologosController],
      providers: [{ provide: OdontologosService, useValue: mockService }],
    }).compile();
    controller = module.get<OdontologosController>(OdontologosController);
  });

  it('debe estar definido', () => expect(controller).toBeDefined());

  describe('create()', () => {
    const dto = { cedula: '1234567890', nombre: 'Maria', apellido: 'Lopez', telefono: '0981234567', especialidad: 'ortodoncia', numeroRegistro: 'REG-001' };

    it('debe retornar el odontólogo creado', async () => {
      const mock = { id: ODONTOLOGO_ID, ...dto };
      mockService.create.mockResolvedValue(mock);
      const result = await controller.create(dto);
      expect(result).toEqual({ success: true, message: 'Odontólogo creado exitosamente', data: mock });
    });

    it('debe lanzar InternalServerErrorException cuando el service retorna null', async () => {
      mockService.create.mockResolvedValue(null);
      await expect(controller.create(dto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll()', () => {
    const mockPagination = { items: [{ id: ODONTOLOGO_ID }], meta: {} };

    it('debe retornar los odontólogos paginados', async () => {
      mockService.findAll.mockResolvedValue(mockPagination);
      const result = await controller.findAll({ page: 1, limit: 10 } as any);
      expect(result.success).toBe(true);
    });

    it('debe lanzar InternalServerErrorException cuando el service retorna null', async () => {
      mockService.findAll.mockResolvedValue(null);
      await expect(controller.findAll({ page: 1, limit: 10 } as any)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findByCedula()', () => {
    it('debe retornar el odontólogo cuando existe', async () => {
      const mock = { id: ODONTOLOGO_ID, cedula: '1234567890' };
      mockService.findByCedula.mockResolvedValue(mock);
      const result = await controller.findByCedula('1234567890');
      expect(result).toEqual({ success: true, message: 'Odontólogo obtenido exitosamente', data: mock });
    });

    it('debe lanzar NotFoundException cuando no existe', async () => {
      mockService.findByCedula.mockResolvedValue(null);
      await expect(controller.findByCedula('0000000000')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOne()', () => {
    it('debe retornar el odontólogo cuando existe', async () => {
      const mock = { id: ODONTOLOGO_ID };
      mockService.findOne.mockResolvedValue(mock);
      const result = await controller.findOne(ODONTOLOGO_ID);
      expect(result).toEqual({ success: true, message: 'Odontólogo obtenido exitosamente', data: mock });
    });

    it('debe lanzar NotFoundException cuando no existe', async () => {
      mockService.findOne.mockResolvedValue(null);
      await expect(controller.findOne(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('debe retornar el odontólogo actualizado', async () => {
      const mock = { id: ODONTOLOGO_ID, nombre: 'Nuevo' };
      mockService.update.mockResolvedValue(mock);
      const result = await controller.update(ODONTOLOGO_ID, { nombre: 'Nuevo' });
      expect(result).toEqual({ success: true, message: 'Odontólogo actualizado exitosamente', data: mock });
    });

    it('debe lanzar NotFoundException cuando no existe', async () => {
      mockService.update.mockResolvedValue(null);
      await expect(controller.update(NOT_FOUND_ID, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove()', () => {
    it('debe retornar el odontólogo eliminado', async () => {
      const mock = { id: ODONTOLOGO_ID };
      mockService.remove.mockResolvedValue(mock);
      const result = await controller.remove(ODONTOLOGO_ID);
      expect(result).toEqual({ success: true, message: 'Odontólogo eliminado exitosamente', data: mock });
    });

    it('debe lanzar NotFoundException cuando no existe', async () => {
      mockService.remove.mockResolvedValue(null);
      await expect(controller.remove(NOT_FOUND_ID)).rejects.toThrow(NotFoundException);
    });
  });
});