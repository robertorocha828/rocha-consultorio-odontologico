import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EspecialidadesController } from './especialidades.controller';
import { EspecialidadesService } from './especialidades.service';

describe('EspecialidadesController', () => {
  let controller: EspecialidadesController;

  const mockEspecialidadesService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EspecialidadesController],
      providers: [
        { provide: EspecialidadesService, useValue: mockEspecialidadesService },
      ],
    }).compile();

    controller = module.get<EspecialidadesController>(EspecialidadesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return the created especialidad', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia', activo: true };
      mockEspecialidadesService.create.mockResolvedValue(mockEspecialidad);
      const result = await controller.create({ nombre: 'Ortodoncia', activo: true });
      expect(result).toEqual(mockEspecialidad);
    });

    it('should propagate ConflictException when especialidad already exists', async () => {
      mockEspecialidadesService.create.mockRejectedValue(new ConflictException('La especialidad ya existe'));
      await expect(controller.create({ nombre: 'Ortodoncia', activo: true })).rejects.toThrow(ConflictException);
    });

    it('should call service.create with the provided dto', async () => {
      const dto = { nombre: 'Endodoncia', activo: true };
      mockEspecialidadesService.create.mockResolvedValue({ id: 2, ...dto });
      await controller.create(dto);
      expect(mockEspecialidadesService.create).toHaveBeenCalledWith(dto);
    });

  });

  describe('findAll()', () => {

    it('should return all especialidades', async () => {
      const mockList = [{ id: 1, nombre: 'Ortodoncia' }];
      mockEspecialidadesService.findAll.mockResolvedValue(mockList);
      expect(await controller.findAll()).toEqual(mockList);
    });

    it('should return empty array when no especialidades exist', async () => {
      mockEspecialidadesService.findAll.mockResolvedValue([]);
      expect(await controller.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return the especialidad when it exists', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia' };
      mockEspecialidadesService.findOne.mockResolvedValue(mockEspecialidad);
      expect(await controller.findOne(1)).toEqual(mockEspecialidad);
    });

    it('should propagate NotFoundException when especialidad does not exist', async () => {
      mockEspecialidadesService.findOne.mockRejectedValue(new NotFoundException('Especialidad no encontrada'));
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return the updated especialidad', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia Avanzada', activo: true };
      mockEspecialidadesService.update.mockResolvedValue(mockEspecialidad);
      const result = await controller.update(1, { nombre: 'Ortodoncia Avanzada' });
      expect(result).toEqual(mockEspecialidad);
    });

    it('should propagate NotFoundException when especialidad does not exist', async () => {
      mockEspecialidadesService.update.mockRejectedValue(new NotFoundException('Especialidad no encontrada'));
      await expect(controller.update(99, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with correct id and dto', async () => {
      mockEspecialidadesService.update.mockResolvedValue({ id: 1 });
      const dto = { nombre: 'Nuevo' };
      await controller.update(1, dto);
      expect(mockEspecialidadesService.update).toHaveBeenCalledWith(1, dto);
    });

  });

  describe('remove()', () => {

    it('should return success message when removed', async () => {
      mockEspecialidadesService.remove.mockResolvedValue({ message: 'Especialidad eliminada correctamente' });
      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Especialidad eliminada correctamente' });
    });

    it('should propagate NotFoundException when especialidad does not exist', async () => {
      mockEspecialidadesService.remove.mockRejectedValue(new NotFoundException('Especialidad no encontrada'));
      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockEspecialidadesService.remove.mockResolvedValue({ message: 'Especialidad eliminada correctamente' });
      await controller.remove(1);
      expect(mockEspecialidadesService.remove).toHaveBeenCalledWith(1);
    });

  });

});
