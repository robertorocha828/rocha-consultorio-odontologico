import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TiposTratamientoController } from './tipos-tratamiento.controller';
import { TiposTratamientoService } from './tipos-tratamiento.service';

describe('TiposTratamientoController', () => {
  let controller: TiposTratamientoController;

  const mockTiposTratamientoService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TiposTratamientoController],
      providers: [
        { provide: TiposTratamientoService, useValue: mockTiposTratamientoService },
      ],
    }).compile();

    controller = module.get<TiposTratamientoController>(TiposTratamientoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return the created tipo tratamiento', async () => {
      const mockTipo = { id: 1, nombre: 'Preventivo', activo: true };
      mockTiposTratamientoService.create.mockResolvedValue(mockTipo);
      const result = await controller.create({ nombre: 'Preventivo', activo: true });
      expect(result).toEqual(mockTipo);
    });

    it('should propagate ConflictException when tipo already exists', async () => {
      mockTiposTratamientoService.create.mockRejectedValue(new ConflictException('El tipo de tratamiento ya existe'));
      await expect(controller.create({ nombre: 'Preventivo', activo: true })).rejects.toThrow(ConflictException);
    });

    it('should call service.create with the provided dto', async () => {
      const dto = { nombre: 'Correctivo', activo: true };
      mockTiposTratamientoService.create.mockResolvedValue({ id: 2, ...dto });
      await controller.create(dto);
      expect(mockTiposTratamientoService.create).toHaveBeenCalledWith(dto);
    });

  });

  describe('findAll()', () => {

    it('should return all tipos tratamiento', async () => {
      const mockList = [{ id: 1, nombre: 'Preventivo' }, { id: 2, nombre: 'Correctivo' }];
      mockTiposTratamientoService.findAll.mockResolvedValue(mockList);
      expect(await controller.findAll()).toEqual(mockList);
    });

    it('should return empty array when no tipos exist', async () => {
      mockTiposTratamientoService.findAll.mockResolvedValue([]);
      expect(await controller.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return the tipo tratamiento when it exists', async () => {
      const mockTipo = { id: 1, nombre: 'Preventivo' };
      mockTiposTratamientoService.findOne.mockResolvedValue(mockTipo);
      expect(await controller.findOne(1)).toEqual(mockTipo);
    });

    it('should propagate NotFoundException when tipo does not exist', async () => {
      mockTiposTratamientoService.findOne.mockRejectedValue(new NotFoundException('Tipo de tratamiento no encontrado'));
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return the updated tipo tratamiento', async () => {
      const mockTipo = { id: 1, nombre: 'Preventivo Avanzado', activo: true };
      mockTiposTratamientoService.update.mockResolvedValue(mockTipo);
      const result = await controller.update(1, { nombre: 'Preventivo Avanzado' });
      expect(result).toEqual(mockTipo);
    });

    it('should propagate NotFoundException when tipo does not exist', async () => {
      mockTiposTratamientoService.update.mockRejectedValue(new NotFoundException('Tipo de tratamiento no encontrado'));
      await expect(controller.update(99, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with correct id and dto', async () => {
      mockTiposTratamientoService.update.mockResolvedValue({ id: 1 });
      const dto = { nombre: 'Nuevo' };
      await controller.update(1, dto);
      expect(mockTiposTratamientoService.update).toHaveBeenCalledWith(1, dto);
    });

  });

  describe('remove()', () => {

    it('should return success message when removed', async () => {
      mockTiposTratamientoService.remove.mockResolvedValue({ message: 'Tipo de tratamiento eliminado correctamente' });
      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Tipo de tratamiento eliminado correctamente' });
    });

    it('should propagate NotFoundException when tipo does not exist', async () => {
      mockTiposTratamientoService.remove.mockRejectedValue(new NotFoundException('Tipo de tratamiento no encontrado'));
      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockTiposTratamientoService.remove.mockResolvedValue({ message: 'Tipo de tratamiento eliminado correctamente' });
      await controller.remove(1);
      expect(mockTiposTratamientoService.remove).toHaveBeenCalledWith(1);
    });

  });

});
