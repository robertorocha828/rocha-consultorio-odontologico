import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TratamientosService } from './tratamientos.service';
import { Tratamiento } from './tratamiento.entity';

describe('TratamientosService', () => {
  let service: TratamientosService;

  const mockTratamientoRepository = {
    create:    jest.fn(),
    save:      jest.fn(),
    findOneBy: jest.fn(),
    find:      jest.fn(),
    remove:    jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TratamientosService,
        { provide: getRepositoryToken(Tratamiento), useValue: mockTratamientoRepository },
      ],
    }).compile();

    service = module.get<TratamientosService>(TratamientosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a tratamiento', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza', costo: 50, activo: true };
      mockTratamientoRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockTratamiento);
      mockTratamientoRepository.create.mockReturnValue(mockTratamiento);
      mockTratamientoRepository.save.mockResolvedValue(mockTratamiento);
      const result = await service.create({ nombre: 'Limpieza', costo: 50, tipoTratamientoId: 1, activo: true });
      expect(result).toEqual(mockTratamiento);
    });

    it('should throw ConflictException when tratamiento already exists', async () => {
      mockTratamientoRepository.findOneBy.mockResolvedValue({ id: 1, nombre: 'Limpieza' });
      await expect(service.create({ nombre: 'Limpieza', costo: 50, tipoTratamientoId: 1, activo: true })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when tratamiento cannot be found after save', async () => {
      mockTratamientoRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockTratamientoRepository.create.mockReturnValue({});
      mockTratamientoRepository.save.mockResolvedValue({});
      await expect(service.create({ nombre: 'Limpieza', costo: 50, tipoTratamientoId: 1, activo: true })).rejects.toThrow(NotFoundException);
    });

  });

  describe('findAll()', () => {

    it('should return all tratamientos ordered by id', async () => {
      const mockList = [{ id: 1, nombre: 'Limpieza' }, { id: 2, nombre: 'Extracción' }];
      mockTratamientoRepository.find.mockResolvedValue(mockList);
      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(mockTratamientoRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });

    it('should return empty array when no tratamientos exist', async () => {
      mockTratamientoRepository.find.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return a tratamiento when it exists', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza' };
      mockTratamientoRepository.findOneBy.mockResolvedValue(mockTratamiento);
      expect(await service.findOne(1)).toEqual(mockTratamiento);
    });

    it('should throw NotFoundException when tratamiento does not exist', async () => {
      mockTratamientoRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should update and return the tratamiento', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza', costo: 50, activo: true };
      const mockUpdated     = { id: 1, nombre: 'Limpieza Profunda', costo: 70, activo: true };
      mockTratamientoRepository.findOneBy
        .mockResolvedValueOnce(mockTratamiento)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUpdated);
      mockTratamientoRepository.save.mockResolvedValue(mockUpdated);
      const result = await service.update(1, { nombre: 'Limpieza Profunda', costo: 70 });
      expect(result).toEqual(mockUpdated);
    });

    it('should throw NotFoundException when tratamiento does not exist', async () => {
      mockTratamientoRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(99, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new nombre already exists', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza' };
      const mockExisting    = { id: 2, nombre: 'Extracción' };
      mockTratamientoRepository.findOneBy
        .mockResolvedValueOnce(mockTratamiento)
        .mockResolvedValueOnce(mockExisting);
      await expect(service.update(1, { nombre: 'Extracción' })).rejects.toThrow(ConflictException);
    });

  });

  describe('remove()', () => {

    it('should remove and return a success message', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza' };
      mockTratamientoRepository.findOneBy.mockResolvedValue(mockTratamiento);
      mockTratamientoRepository.remove.mockResolvedValue(mockTratamiento);
      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Tratamiento eliminado correctamente' });
    });

    it('should throw NotFoundException when tratamiento does not exist', async () => {
      mockTratamientoRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call repository.remove with the found tratamiento', async () => {
      const mockTratamiento = { id: 1, nombre: 'Limpieza' };
      mockTratamientoRepository.findOneBy.mockResolvedValue(mockTratamiento);
      mockTratamientoRepository.remove.mockResolvedValue(mockTratamiento);
      await service.remove(1);
      expect(mockTratamientoRepository.remove).toHaveBeenCalledWith(mockTratamiento);
    });

  });

});
