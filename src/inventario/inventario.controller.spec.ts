import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InventarioController } from './inventario.controller';
import { InventarioService } from './inventario.service';

describe('InventarioController', () => {
  let controller: InventarioController;

  const mockInventarioService = {
    create:  jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update:  jest.fn(),
    remove:  jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventarioController],
      providers: [
        { provide: InventarioService, useValue: mockInventarioService },
      ],
    }).compile();

    controller = module.get<InventarioController>(InventarioController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {

    it('should return the created inventario item', async () => {
      const mockItem = { id: 1, nombre: 'Guantes', cantidad: 100, activo: true };
      mockInventarioService.create.mockResolvedValue(mockItem);
      const result = await controller.create({ nombre: 'Guantes', cantidad: 100, precioUnitario: 0.5, activo: true });
      expect(result).toEqual(mockItem);
    });

    it('should propagate ConflictException when item already exists', async () => {
      mockInventarioService.create.mockRejectedValue(new ConflictException('El ítem de inventario ya existe'));
      await expect(controller.create({ nombre: 'Guantes', cantidad: 100, precioUnitario: 0.5, activo: true })).rejects.toThrow(ConflictException);
    });

    it('should call service.create with the provided dto', async () => {
      const dto = { nombre: 'Mascarillas', cantidad: 50, precioUnitario: 0.3, activo: true };
      mockInventarioService.create.mockResolvedValue({ id: 2, ...dto });
      await controller.create(dto);
      expect(mockInventarioService.create).toHaveBeenCalledWith(dto);
    });

  });

  describe('findAll()', () => {

    it('should return all inventario items', async () => {
      const mockList = [{ id: 1, nombre: 'Guantes' }, { id: 2, nombre: 'Mascarillas' }];
      mockInventarioService.findAll.mockResolvedValue(mockList);
      expect(await controller.findAll()).toEqual(mockList);
    });

    it('should return empty array when no items exist', async () => {
      mockInventarioService.findAll.mockResolvedValue([]);
      expect(await controller.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return the inventario item when it exists', async () => {
      const mockItem = { id: 1, nombre: 'Guantes' };
      mockInventarioService.findOne.mockResolvedValue(mockItem);
      expect(await controller.findOne(1)).toEqual(mockItem);
    });

    it('should propagate NotFoundException when item does not exist', async () => {
      mockInventarioService.findOne.mockRejectedValue(new NotFoundException('Ítem de inventario no encontrado'));
      await expect(controller.findOne(99)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should return the updated inventario item', async () => {
      const mockItem = { id: 1, nombre: 'Guantes', cantidad: 200 };
      mockInventarioService.update.mockResolvedValue(mockItem);
      const result = await controller.update(1, { cantidad: 200 });
      expect(result).toEqual(mockItem);
    });

    it('should propagate NotFoundException when item does not exist', async () => {
      mockInventarioService.update.mockRejectedValue(new NotFoundException('Ítem de inventario no encontrado'));
      await expect(controller.update(99, { cantidad: 200 })).rejects.toThrow(NotFoundException);
    });

    it('should call service.update with correct id and dto', async () => {
      mockInventarioService.update.mockResolvedValue({ id: 1 });
      const dto = { cantidad: 150 };
      await controller.update(1, dto);
      expect(mockInventarioService.update).toHaveBeenCalledWith(1, dto);
    });

  });

  describe('remove()', () => {

    it('should return success message when removed', async () => {
      mockInventarioService.remove.mockResolvedValue({ message: 'Ítem de inventario eliminado correctamente' });
      const result = await controller.remove(1);
      expect(result).toEqual({ message: 'Ítem de inventario eliminado correctamente' });
    });

    it('should propagate NotFoundException when item does not exist', async () => {
      mockInventarioService.remove.mockRejectedValue(new NotFoundException('Ítem de inventario no encontrado'));
      await expect(controller.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call service.remove with the correct id', async () => {
      mockInventarioService.remove.mockResolvedValue({ message: 'Ítem de inventario eliminado correctamente' });
      await controller.remove(1);
      expect(mockInventarioService.remove).toHaveBeenCalledWith(1);
    });

  });

});
