import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EspecialidadesService } from './especialidades.service';
import { Especialidad } from './especialidad.entity';

describe('EspecialidadesService', () => {
  let service: EspecialidadesService;

  const mockQueryBuilder = {
    leftJoin:  jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where:     jest.fn().mockReturnThis(),
    getOne:    jest.fn(),
  };

  const mockEspecialidadRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOneBy:          jest.fn(),
    find:               jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockEspecialidadRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EspecialidadesService,
        { provide: getRepositoryToken(Especialidad), useValue: mockEspecialidadRepository },
      ],
    }).compile();

    service = module.get<EspecialidadesService>(EspecialidadesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return an especialidad', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia', activo: true };
      mockEspecialidadRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockEspecialidad);
      mockEspecialidadRepository.create.mockReturnValue(mockEspecialidad);
      mockEspecialidadRepository.save.mockResolvedValue(mockEspecialidad);
      const result = await service.create({ nombre: 'Ortodoncia', activo: true });
      expect(result).toEqual(mockEspecialidad);
    });

    it('should throw ConflictException when especialidad already exists', async () => {
      mockEspecialidadRepository.findOneBy.mockResolvedValue({ id: 1, nombre: 'Ortodoncia' });
      await expect(service.create({ nombre: 'Ortodoncia', activo: true })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException when especialidad cannot be found after save', async () => {
      mockEspecialidadRepository.findOneBy
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);
      mockEspecialidadRepository.create.mockReturnValue({});
      mockEspecialidadRepository.save.mockResolvedValue({});
      await expect(service.create({ nombre: 'Ortodoncia', activo: true })).rejects.toThrow(NotFoundException);
    });

  });

  describe('findAll()', () => {

    it('should return all especialidades ordered by id', async () => {
      const mockList = [{ id: 1, nombre: 'Ortodoncia' }, { id: 2, nombre: 'Endodoncia' }];
      mockEspecialidadRepository.find.mockResolvedValue(mockList);
      const result = await service.findAll();
      expect(result).toEqual(mockList);
      expect(mockEspecialidadRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });

    it('should return empty array when no especialidades exist', async () => {
      mockEspecialidadRepository.find.mockResolvedValue([]);
      expect(await service.findAll()).toEqual([]);
    });

  });

  describe('findOne()', () => {

    it('should return an especialidad when it exists', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia' };
      mockQueryBuilder.getOne.mockResolvedValue(mockEspecialidad);
      expect(await service.findOne(1)).toEqual(mockEspecialidad);
    });

    it('should throw NotFoundException when especialidad does not exist', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });

  });

  describe('update()', () => {

    it('should update and return the especialidad', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia', activo: true };
      const mockUpdated = { id: 1, nombre: 'Ortodoncia Avanzada', activo: true };
      mockQueryBuilder.getOne
        .mockResolvedValueOnce(mockEspecialidad)
        .mockResolvedValueOnce(mockUpdated);
      mockEspecialidadRepository.findOneBy.mockResolvedValueOnce(null);
      mockEspecialidadRepository.save.mockResolvedValue(mockUpdated);
      const result = await service.update(1, { nombre: 'Ortodoncia Avanzada' });
      expect(result).toEqual(mockUpdated);
    });

    it('should throw NotFoundException when especialidad does not exist', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await expect(service.update(99, { nombre: 'x' })).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when new nombre already exists', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia' };
      const mockExisting = { id: 2, nombre: 'Endodoncia' };
      mockQueryBuilder.getOne.mockResolvedValueOnce(mockEspecialidad);
      mockEspecialidadRepository.findOneBy.mockResolvedValueOnce(mockExisting);
      await expect(service.update(1, { nombre: 'Endodoncia' })).rejects.toThrow(ConflictException);
    });

  });

  describe('remove()', () => {

    it('should remove and return a success message', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia' };
      mockQueryBuilder.getOne.mockResolvedValue(mockEspecialidad);
      mockEspecialidadRepository.remove.mockResolvedValue(mockEspecialidad);
      const result = await service.remove(1);
      expect(result).toEqual({ message: 'Especialidad eliminada correctamente' });
    });

    it('should throw NotFoundException when especialidad does not exist', async () => {
      mockQueryBuilder.getOne.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('should call repository.remove with the found especialidad', async () => {
      const mockEspecialidad = { id: 1, nombre: 'Ortodoncia' };
      mockQueryBuilder.getOne.mockResolvedValue(mockEspecialidad);
      mockEspecialidadRepository.remove.mockResolvedValue(mockEspecialidad);
      await service.remove(1);
      expect(mockEspecialidadRepository.remove).toHaveBeenCalledWith(mockEspecialidad);
    });

  });

});