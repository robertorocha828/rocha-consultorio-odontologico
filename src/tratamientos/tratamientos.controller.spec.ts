import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TratamientosController } from './tratamientos.controller';
import { TratamientosService } from './tratamientos.service';

describe('TratamientosController', () => {
  let controller: TratamientosController;

  const mockTratamientosService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TratamientosController],
      providers: [
        { provide: TratamientosService, useValue: mockTratamientosService },
      ],
    }).compile();

    controller = module.get<TratamientosController>(TratamientosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return the created tratamiento', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza', costo: 50, activo: true };
      mockTratamientosService.create.mockResolvedValue(mockTratamiento);
      const result = await controller.create({ nombre: 'Limpieza', costo: 50, tipoTratamientoId: 1, activo: true });
      expect(result).toEqual(mockTratamiento);
    });

    it('should propagate ConflictException when tratamiento already exists', async () => {
      mockTratamientosService.create.mockRejectedValue(new ConflictException('El tratamiento ya existe'));
      await expect(controller.create({ nombre: 'Limpieza', costo: 50, tipoTratamientoId: 1, activo: true })).rejects.toThrow(ConflictException);
    });

    it('should call service.create with the provided dto', async () => {
      const dto = { nombre: 'Extracción', costo: 80, tipoTratamientoId: 1, activo: true };
      mockTratamientosService.create.mockResolvedValue({ id: 2, ...dto });
      await controller.create(dto);
      expect(mockTratamientosService.create).toHaveBeenCalledWith(dto);
    });

  });

  describe('findAll()', () => {

    it('should return all tratamientos', async () => {
      const mockList = [{ id: 1, nombre: 'Limpieza' }, { id: 2, nombre: 'Extracción' }];
      mockTratamientosService.findAll.mockResolvedValue(mockList);
      expect(await controller.findAll()).toEqual(mockList);
    });

    it('should return empty array when no tratamientos exist', async () => {
      mockTratamientosService.findAll.mockResolvedValue([]);
      expect(await controller.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return the tratamiento when it exists', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza' };
      mockTratamientosService.findOne.mockResolvedValue(mockTratamiento);
      expect(await controller.findOne(1)).toEqual(mockTratamiento);
    });

    it('should propagate NotFoundException when tratamiento does not exist', async () => {
      mockTratamientosService.findOne.mockRejectedValue(new NotFoundException('Tratamiento no encontrado'));
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return the updated tratamiento', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza Profunda', costo: 70 };
      mockTratamientosService.update.mockResolvedValue(mockTratamiento);
      const result = await controller.update(1, { nombre: 'Limpieza Profunda', costo: 70 });
      expect(result).toEqual(mockTratamiento);
    });

    it('should propagate NotFoundException when tratamiento does not exist', async () => {
      mockTratamientosService.update.mockRejectedValue(new NotFoundException('Tratamiento no encontrado'));
      await expect(controller.update(99, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with correct id and dto', async () => {
      mockTratamientosService.update.mockResolvedValue({ id: 1 });
      const dto = { nombre: 'Nuevo', costo: 60 };
      await controller.update(1, dto);
      expect(mockTratamientosService.update).toHaveBeenCalledWith(1, dto);
    });

  });

  describe('remove()', () => {

    it('should return success message when removed', async () => {
      mockTratamientosService.remove.mockResolvedValue({ message: 'Tratamiento eliminado correctamente' });
      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Tratamiento eliminado correctamente' });
    });

    it('should propagate NotFoundException when tratamiento does not exist', async () => {
      mockTratamientosService.remove.mockRejectedValue(new NotFoundException('Tratamiento no encontrado'));
      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockTratamientosService.remove.mockResolvedValue({ message: 'Tratamiento eliminado correctamente' });
      await controller.remove(1);
      expect(mockTratamientosService.remove).toHaveBeenCalledWith(1);
    });

  });

});
