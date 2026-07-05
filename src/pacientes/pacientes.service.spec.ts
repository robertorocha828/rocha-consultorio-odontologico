jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PacientesService } from './pacientes.service';
import { Paciente } from './paciente.entity';
import { OdontogramaService } from '../odontograma/odontograma.service';

const mockPaginate = paginate as jest.Mock;

const PACIENTE_ID   = '11111111-1111-1111-1111-111111111111';
const PACIENTE_ID_2 = '22222222-2222-2222-2222-222222222222';
const NOT_FOUND_ID  = '99999999-9999-9999-9999-999999999999';

describe('PacientesService', () => {
  let service: PacientesService;

  const mockQueryBuilder = {
    where:   jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockPacienteRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockOdontogramaService = {
    findByPaciente: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPacienteRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        { provide: getRepositoryToken(Paciente), useValue: mockPacienteRepository },
        { provide: OdontogramaService, useValue: mockOdontogramaService },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan', cedula: '1234567890' };
      mockPacienteRepository.create.mockReturnValue(mockPaciente);
      mockPacienteRepository.save.mockResolvedValue(mockPaciente);
      expect(await service.create({ nombre: 'Juan', cedula: '1234567890' } as any)).toEqual(mockPaciente);
    });

    it('should call repository.create with the provided dto', async () => {
      const dto = { nombre: 'Maria', cedula: '0987654321' } as any;
      mockPacienteRepository.create.mockReturnValue({});
      mockPacienteRepository.save.mockResolvedValue({ id: PACIENTE_ID_2, ...dto });
      await service.create(dto);
      expect(mockPacienteRepository.create).toHaveBeenCalledWith(dto);
    });

    it('should return null when repository throws', async () => {
      mockPacienteRepository.create.mockReturnValue({});
      mockPacienteRepository.save.mockRejectedValue(new Error('Constraint error'));
      expect(await service.create({ nombre: 'Duplicado' } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('should return a paciente when it exists', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      const result = await service.findOne(PACIENTE_ID);
      expect(result).toEqual(mockPaciente);
      expect(mockPacienteRepository.findOne).toHaveBeenCalledWith({ where: { id: PACIENTE_ID } });
    });

    it('should return null when paciente does not exist', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });

    it('should return null when repository throws', async () => {
      mockPacienteRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findOne(PACIENTE_ID)).toBeNull();
    });

  });

  describe('findByCedula()', () => {

    it('should return a paciente when cedula exists', async () => {
      const mockPaciente = { id: PACIENTE_ID, cedula: '1234567890' };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      expect(await service.findByCedula('1234567890')).toEqual(mockPaciente);
    });

    it('should return null when cedula does not exist', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      expect(await service.findByCedula('0000000000')).toBeNull();
    });

    it('should return null when repository throws', async () => {
      mockPacienteRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findByCedula('1234567890')).toBeNull();
    });

  });

  describe('update()', () => {

    it('should return null when paciente does not exist', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { nombre: 'Nuevo' } as any)).toBeNull();
    });

    it('should update and return the paciente', async () => {
      mockPacienteRepository.findOne.mockResolvedValue({ id: PACIENTE_ID, nombre: 'Viejo' });
      mockPacienteRepository.save.mockResolvedValue({ id: PACIENTE_ID, nombre: 'Nuevo' });
      expect(await service.update(PACIENTE_ID, { nombre: 'Nuevo' } as any)).toEqual({ id: PACIENTE_ID, nombre: 'Nuevo' });
    });

    it('should apply dto fields to the existing paciente', async () => {
      mockPacienteRepository.findOne.mockResolvedValue({ id: PACIENTE_ID, nombre: 'Viejo' });
      mockPacienteRepository.save.mockImplementation((p) => Promise.resolve(p));
      const result = await service.update(PACIENTE_ID, { nombre: 'Actualizado' } as any);
      expect(result).toHaveProperty('nombre', 'Actualizado');
    });

    it('should return null when save throws', async () => {
      mockPacienteRepository.findOne.mockResolvedValue({ id: PACIENTE_ID, nombre: 'Juan' });
      mockPacienteRepository.save.mockRejectedValue(new Error('Save error'));
      expect(await service.update(PACIENTE_ID, { nombre: 'x' } as any)).toBeNull();
    });

  });

  describe('remove()', () => {

    it('should return null when paciente does not exist', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });

    it('should call repository.remove with the found paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPacienteRepository.remove.mockResolvedValue(mockPaciente);
      await service.remove(PACIENTE_ID);
      expect(mockPacienteRepository.remove).toHaveBeenCalledWith(mockPaciente);
    });

    it('should return the removed paciente', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockPacienteRepository.remove.mockResolvedValue(mockPaciente);
      expect(await service.remove(PACIENTE_ID)).toEqual(mockPaciente);
    });

    it('should return null when remove throws', async () => {
      mockPacienteRepository.findOne.mockResolvedValue({ id: PACIENTE_ID });
      mockPacienteRepository.remove.mockRejectedValue(new Error('FK constraint'));
      expect(await service.remove(PACIENTE_ID)).toBeNull();
    });

  });

  describe('findAll()', () => {

    const mockPaginationResult = {
      items: [{ id: PACIENTE_ID, nombre: 'Juan' }, { id: PACIENTE_ID_2, nombre: 'Maria' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 2, totalItems: 2, itemsPerPage: 10 },
    };

    it('should return paginated pacientes', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toEqual(mockPaginationResult);
    });

    it('should call createQueryBuilder with "paciente" alias', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockPacienteRepository.createQueryBuilder).toHaveBeenCalledWith('paciente');
    });

    it('should call where when search is provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, search: 'Juan' } as any);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should not call where when search is not provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockQueryBuilder.where).not.toHaveBeenCalled();
    });

    it('should call orderBy when sort is provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, sort: 'nombre', order: 'DESC' } as any);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('paciente.nombre', 'DESC');
    });

    it('should return null when paginate throws', async () => {
      mockPaginate.mockRejectedValue(new Error('DB error'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });

  });

  describe('findOneConOdontograma()', () => {

    it('should return paciente with odontograma', async () => {
      const mockPaciente = { id: PACIENTE_ID, nombre: 'Juan' };
      const mockOdontograma = { items: [], page: 1, limit: 1 };
      mockPacienteRepository.findOne.mockResolvedValue(mockPaciente);
      mockOdontogramaService.findByPaciente.mockResolvedValue(mockOdontograma);
      const result = await service.findOneConOdontograma(PACIENTE_ID);
      expect(result).toEqual({ paciente: mockPaciente, odontograma: mockOdontograma });
    });

    it('should return null when paciente does not exist', async () => {
      mockPacienteRepository.findOne.mockResolvedValue(null);
      expect(await service.findOneConOdontograma(NOT_FOUND_ID)).toBeNull();
    });

    it('should return null when service throws', async () => {
      mockPacienteRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findOneConOdontograma(PACIENTE_ID)).toBeNull();
    });

  });

});
