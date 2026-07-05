import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { ConsultoriosService } from './consultorios.service';
import { Consultorio, EstadoConsultorio } from './consultorio.entity';

jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

const mockPaginate = paginate as jest.Mock;

const CONSULTORIO_ID   = '11111111-1111-1111-1111-111111111111';
const CONSULTORIO_ID_2 = '22222222-2222-2222-2222-222222222222';
const NOT_FOUND_ID     = '99999999-9999-9999-9999-999999999999';

describe('ConsultoriosService', () => {
  let service: ConsultoriosService;

  const mockQueryBuilder = {
    where:   jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockConsultorioRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockConsultorioRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConsultoriosService,
        { provide: getRepositoryToken(Consultorio), useValue: mockConsultorioRepository },
      ],
    }).compile();

    service = module.get<ConsultoriosService>(ConsultoriosService);
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('debe crear y retornar un consultorio', async () => {
      const dto = { nombre: 'Consultorio 1', descripcion: 'Planta baja' };
      const mockConsultorio = { id: CONSULTORIO_ID, ...dto, estado: EstadoConsultorio.ACTIVO };
      mockConsultorioRepository.create.mockReturnValue(mockConsultorio);
      mockConsultorioRepository.save.mockResolvedValue(mockConsultorio);

      const result = await service.create(dto);
      expect(result).toEqual(mockConsultorio);
    });

    it('debe llamar a consultorioRepo.create con el dto proporcionado', async () => {
      const dto = { nombre: 'Consultorio 2' };
      mockConsultorioRepository.create.mockReturnValue(dto);
      mockConsultorioRepository.save.mockResolvedValue({ id: CONSULTORIO_ID, ...dto });

      await service.create(dto);
      expect(mockConsultorioRepository.create).toHaveBeenCalledWith(dto);
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockConsultorioRepository.create.mockReturnValue({});
      mockConsultorioRepository.save.mockRejectedValue(new Error('DB error'));
      expect(await service.create({ nombre: 'x' })).toBeNull();
    });

  });

  describe('findAll()', () => {

    const mockPaginationResult = {
      items: [
        { id: CONSULTORIO_ID,   nombre: 'Consultorio A' },
        { id: CONSULTORIO_ID_2, nombre: 'Consultorio B' },
      ],
      meta: { itemCount: 2, totalItems: 2, itemsPerPage: 10, totalPages: 1, currentPage: 1 },
    };

    it('debe retornar consultorios paginados sin filtros', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      const result = await service.findAll({ page: 1, limit: 10 } as any);
      expect(result).toEqual(mockPaginationResult);
    });

    it('debe llamar a createQueryBuilder con el alias "consultorio"', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockConsultorioRepository.createQueryBuilder).toHaveBeenCalledWith('consultorio');
    });

    it('debe llamar a where cuando se proporciona search', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, search: 'Consultorio A' } as any);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'consultorio.nombre ILIKE :search',
        { search: '%Consultorio A%' },
      );
    });

    it('no debe llamar a where cuando no se proporciona search', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockQueryBuilder.where).not.toHaveBeenCalled();
    });

    it('debe llamar a orderBy cuando se proporciona sort', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, sort: 'nombre', order: 'ASC' } as any);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('consultorio.nombre', 'ASC');
    });

    it('no debe llamar a orderBy cuando no se proporciona sort', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockQueryBuilder.orderBy).not.toHaveBeenCalled();
    });

    it('debe pasar page y limit a paginate', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 2, limit: 5 } as any);
      expect(mockPaginate).toHaveBeenCalledWith(mockQueryBuilder, { page: 2, limit: 5 });
    });

    it('debe retornar null cuando paginate lanza un error', async () => {
      mockPaginate.mockRejectedValue(new Error('DB timeout'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('debe retornar un consultorio cuando existe', async () => {
      const mockConsultorio = { id: CONSULTORIO_ID, nombre: 'Consultorio encontrado' };
      mockConsultorioRepository.findOne.mockResolvedValue(mockConsultorio);
      expect(await service.findOne(CONSULTORIO_ID)).toEqual(mockConsultorio);
    });

    it('debe retornar null cuando el consultorio no existe', async () => {
      mockConsultorioRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });

    it('debe llamar a findOne con el id correcto', async () => {
      mockConsultorioRepository.findOne.mockResolvedValue(null);
      await service.findOne(CONSULTORIO_ID);
      expect(mockConsultorioRepository.findOne).toHaveBeenCalledWith({ where: { id: CONSULTORIO_ID } });
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockConsultorioRepository.findOne.mockRejectedValue(new Error('Timeout'));
      expect(await service.findOne(CONSULTORIO_ID)).toBeNull();
    });

  });

  describe('update()', () => {

    it('debe retornar null cuando el consultorio no existe', async () => {
      mockConsultorioRepository.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { nombre: 'Nuevo' })).toBeNull();
    });

    it('debe actualizar y retornar el consultorio', async () => {
      const mockConsultorio = { id: CONSULTORIO_ID, nombre: 'Viejo' };
      const savedConsultorio = { id: CONSULTORIO_ID, nombre: 'Nuevo' };
      mockConsultorioRepository.findOne.mockResolvedValue({ ...mockConsultorio });
      mockConsultorioRepository.save.mockResolvedValue(savedConsultorio);

      const result = await service.update(CONSULTORIO_ID, { nombre: 'Nuevo' });
      expect(result).toEqual(savedConsultorio);
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockConsultorioRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.update(CONSULTORIO_ID, { nombre: 'x' })).toBeNull();
    });

  });

  describe('remove()', () => {

    it('debe retornar null cuando el consultorio no existe', async () => {
      mockConsultorioRepository.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });

    it('debe eliminar y retornar el consultorio', async () => {
      const mockConsultorio = { id: CONSULTORIO_ID, nombre: 'Consultorio 1' };
      mockConsultorioRepository.findOne.mockResolvedValue(mockConsultorio);
      mockConsultorioRepository.remove.mockResolvedValue(mockConsultorio);

      expect(await service.remove(CONSULTORIO_ID)).toEqual(mockConsultorio);
    });

    it('debe retornar null cuando el repositorio lanza un error', async () => {
      mockConsultorioRepository.findOne.mockResolvedValue({ id: CONSULTORIO_ID });
      mockConsultorioRepository.remove.mockRejectedValue(new Error('FK constraint'));
      expect(await service.remove(CONSULTORIO_ID)).toBeNull();
    });

  });

});
