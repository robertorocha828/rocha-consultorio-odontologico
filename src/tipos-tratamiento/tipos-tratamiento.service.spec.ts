import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TiposTratamientoService } from './tipos-tratamiento.service';
import { TipoTratamiento } from './tipo-tratamiento.entity';

describe('TiposTratamientoService', () => {
  let service: TiposTratamientoService;

  const mockTipoTratamientoRepository = {
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
        TiposTratamientoService,
        { provide: getRepositoryToken(TipoTratamiento), useValue: mockTipoTratamientoRepository },
      ],
    }).compile();

    service = module.get<TiposTratamientoService>(TiposTratamientoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a tipo tratamiento', async () => {
      const mockTipo = { id: 1, nombre: 'Preventivo', activo: true };
      mockTipoTratamientoRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockTipo);
      mockTipoTratamientoRepository.create.mockReturnValue(mockTipo);
      mockTipoTratamientoRepository.save.mockResolvedValue(mockTipo);
      const result = await service.create({ nombre: 'Preventivo', activo: true });
      expect(result).toEqual(mockTipo);
    });

    it('should throw ConflictException when tipo tratamiento already exists', async () => {
      mockTipoTratamientoRepository.findOneBy.mockResolvedValue({ id: 1, nombre: 'Preventivo' });
      await expect(service.create({ nombre: 'Preventivo', activo: true })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when tipo tratamiento cannot be found after save', async () => {
      mockTipoTratamientoRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockTipoTratamientoRepository.create.mockReturnValue({});
      mockTipoTratamientoRepository.save.mockResolvedValue({});
      await expect(service.create({ nombre: 'Preventivo', activo: true })).rejects.toThrow(NotFoundException);
    });

  });

  describe('findAll()', () => {

    it('should return all tipos tratamiento ordered by id', async () => {
      const mockList = [{ id: 1, nombre: 'Preventivo' }, { id: 2, nombre: 'Correctivo' }];
      mockTipoTratamientoRepository.find.mockResolvedValue(mockList);
      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(mockTipoTratamientoRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });

    it('should return empty array when no tipos exist', async () => {
      mockTipoTratamientoRepository.find.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return a tipo tratamiento when it exists', async () => {
      const mockTipo = { id: 1, nombre: 'Preventivo' };
      mockTipoTratamientoRepository.findOneBy.mockResolvedValue(mockTipo);
      expect(await service.findOne(1)).toEqual(mockTipo);
    });

    it('should throw NotFoundException when tipo tratamiento does not exist', async () => {
      mockTipoTratamientoRepository.findOneBy.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should update and return the tipo tratamiento', async () => {
      const mockTipo    = { id: 1, nombre: 'Preventivo', activo: true };
      const mockUpdated = { id: 1, nombre: 'Preventivo Avanzado', activo: true };
      mockTipoTratamientoRepository.findOneBy
        .mockResolvedValueOnce(mockTipo)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUpdated);
      mockTipoTratamientoRepository.save.mockResolvedValue(mockUpdated);
      const result = await service.update(1, { nombre: 'Preventivo Avanzado' });
      expect(result).toEqual(mockUpdated);
    });

    it('should throw NotFoundException when tipo tratamiento does not exist', async () => {
      mockTipoTratamientoRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update(99, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new nombre already exists', async () => {
      const mockTipo     = { id: 1, nombre: 'Preventivo' };
      const mockExisting = { id: 2, nombre: 'Correctivo' };
      mockTipoTratamientoRepository.findOneBy
        .mockResolvedValueOnce(mockTipo)
        .mockResolvedValueOnce(mockExisting);
      await expect(service.update(1, { nombre: 'Correctivo' })).rejects.toThrow(ConflictException);
    });

  });

  describe('remove()', () => {

    it('should remove and return a success message', async () => {
      const mockTipo = { id: 1, nombre: 'Preventivo' };
      mockTipoTratamientoRepository.findOneBy.mockResolvedValue(mockTipo);
      mockTipoTratamientoRepository.remove.mockResolvedValue(mockTipo);
      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Tipo de tratamiento eliminado correctamente' });
    });

    it('should throw NotFoundException when tipo tratamiento does not exist', async () => {
      mockTipoTratamientoRepository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call repository.remove with the found tipo tratamiento', async () => {
      const mockTipo = { id: 1, nombre: 'Preventivo' };
      mockTipoTratamientoRepository.findOneBy.mockResolvedValue(mockTipo);
      mockTipoTratamientoRepository.remove.mockResolvedValue(mockTipo);
      await service.remove(1);
      expect(mockTipoTratamientoRepository.remove).toHaveBeenCalledWith(mockTipo);
    });

  });

});
