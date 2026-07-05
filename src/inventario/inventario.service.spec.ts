import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { InventarioService } from './inventario.service';
import { Inventario } from './inventario.entity';

describe('InventarioService', () => {
  let service: InventarioService;

  const mockInventarioRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventarioService,
        { provide: getRepositoryToken(Inventario), useValue: mockInventarioRepository },
      ],
    }).compile();

    service = module.get<InventarioService>(InventarioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should create and return an inventario item', async () => {
      const mockItem = { id: 1, nombre: 'Guantes', cantidad: 100, activo: true };

      mockInventarioRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockItem);

      mockInventarioRepository.create.mockReturnValue(mockItem);
      mockInventarioRepository.save.mockResolvedValue(mockItem);

      const result = await service.create({
        nombre: 'Guantes',
        cantidad: 100,
        precioUnitario: 0.5,
        activo: true,
      });

      expect(result).toEqual(mockItem);
    });

    it('should throw ConflictException when item already exists', async () => {
      mockInventarioRepository.findOneBy.mockResolvedValue({ id: 1, nombre: 'Guantes' });

      await expect(
        service.create({
          nombre: 'Guantes',
          cantidad: 100,
          precioUnitario: 0.5,
          activo: true,
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when item cannot be found after save', async () => {
      mockInventarioRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      mockInventarioRepository.create.mockReturnValue({});
      mockInventarioRepository.save.mockResolvedValue({});

      await expect(
        service.create({
          nombre: 'Guantes',
          cantidad: 100,
          precioUnitario: 0.5,
          activo: true,
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll()', () => {
    it('should return all inventario items ordered by id', async () => {
      const mockList = [{ id: 1, nombre: 'Guantes' }, { id: 2, nombre: 'Mascarillas' }];

      mockInventarioRepository.find.mockResolvedValue(mockList);

      const result = await service.findAll();

      expect(result).toEqual(mockList);
      expect(mockInventarioRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });

    it('should return empty array when no items exist', async () => {
      mockInventarioRepository.find.mockResolvedValue([]);

      expect(await service.findAll()).toEqual([]);
    });
  });

  describe('findOne()', () => {
    it('should return an inventario item when it exists', async () => {
      const mockItem = { id: 1, nombre: 'Guantes' };

      mockInventarioRepository.findOneBy.mockResolvedValue(mockItem);

      expect(await service.findOne(1)).toEqual(mockItem);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      mockInventarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update and return the inventario item', async () => {
      const mockItem = {
        id: 1,
        nombre: 'Guantes',
        categoria: '',
        cantidad: 100,
        stockMinimo: 0,
        precioUnitario: 0.5,
        activo: true,
      };

      const mockUpdated = {
        id: 1,
        nombre: 'Guantes',
        categoria: '',
        cantidad: 200,
        stockMinimo: 0,
        precioUnitario: 0.5,
        activo: true,
      };

      mockInventarioRepository.findOneBy
        .mockResolvedValueOnce(mockItem)
        .mockResolvedValueOnce(mockUpdated);

      mockInventarioRepository.save.mockResolvedValue(mockUpdated);

      const result = await service.update(1, { cantidad: 200 });

      expect(result).toEqual(mockUpdated);
    });

    it('should throw NotFoundException when item does not exist', async () => {
      mockInventarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(99, { cantidad: 200 })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new nombre already exists', async () => {
      const mockItem = {
        id: 1,
        nombre: 'Guantes',
        categoria: '',
        cantidad: 100,
        stockMinimo: 0,
        precioUnitario: 0.5,
        activo: true,
      };

      const mockExisting = {
        id: 2,
        nombre: 'Mascarillas',
        categoria: '',
        cantidad: 50,
        stockMinimo: 0,
        precioUnitario: 1,
        activo: true,
      };

      mockInventarioRepository.findOneBy
        .mockResolvedValueOnce(mockItem)
        .mockResolvedValueOnce(mockExisting);

      await expect(service.update(1, { nombre: 'Mascarillas' })).rejects.toThrow(ConflictException);
    });
  });

  describe('remove()', () => {
    it('should remove and return a success message', async () => {
      const mockItem = { id: 1, nombre: 'Guantes' };

      mockInventarioRepository.findOneBy.mockResolvedValue(mockItem);
      mockInventarioRepository.remove.mockResolvedValue(mockItem);

      const result = await service.remove(1);

      expect(result).toEqual({ message: 'Ítem de inventario eliminado correctamente' });
    });

    it('should throw NotFoundException when item does not exist', async () => {
      mockInventarioRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call repository.remove with the found item', async () => {
      const mockItem = { id: 1, nombre: 'Guantes' };

      mockInventarioRepository.findOneBy.mockResolvedValue(mockItem);
      mockInventarioRepository.remove.mockResolvedValue(mockItem);

      await service.remove(1);

      expect(mockInventarioRepository.remove).toHaveBeenCalledWith(mockItem);
    });
  });
});