jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { PermisosService } from './permisos.service';
import { Permiso } from './permiso.entity';

const mockPaginate = paginate as jest.Mock;

const PERMISO_ID   = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('PermisosService', () => {
  let service: PermisosService;

  const mockQueryBuilder = {
    where:   jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockPermisoRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    find:               jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockPermisoRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermisosService,
        { provide: getRepositoryToken(Permiso), useValue: mockPermisoRepository },
      ],
    }).compile();

    service = module.get<PermisosService>(PermisosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a permiso', async () => {
      const mockPermiso = { id: PERMISO_ID, nombre: 'crear_cita' };
      mockPermisoRepository.create.mockReturnValue(mockPermiso);
      mockPermisoRepository.save.mockResolvedValue(mockPermiso);
      expect(await service.create({ nombre: 'crear_cita' } as any)).toEqual(mockPermiso);
    });

    it('should call repository.create with the provided dto', async () => {
      const dto = { nombre: 'eliminar_paciente' } as any;
      mockPermisoRepository.create.mockReturnValue({});
      mockPermisoRepository.save.mockResolvedValue({ id: PERMISO_ID, ...dto });
      await service.create(dto);
      expect(mockPermisoRepository.create).toHaveBeenCalledWith(dto);
    });

    it('should return null when repository throws', async () => {
      mockPermisoRepository.create.mockReturnValue({});
      mockPermisoRepository.save.mockRejectedValue(new Error('Unique constraint'));
      expect(await service.create({ nombre: 'crear_cita' } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('should return a permiso when it exists', async () => {
      const mockPermiso = { id: PERMISO_ID, nombre: 'crear_cita' };
      mockPermisoRepository.findOne.mockResolvedValue(mockPermiso);
      const result = await service.findOne(PERMISO_ID);
      expect(result).toEqual(mockPermiso);
      expect(mockPermisoRepository.findOne).toHaveBeenCalledWith({ where: { id: PERMISO_ID } });
    });

    it('should return null when permiso does not exist', async () => {
      mockPermisoRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });

    it('should return null when repository throws', async () => {
      mockPermisoRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findOne(PERMISO_ID)).toBeNull();
    });

  });

  describe('update()', () => {

    it('should return null when permiso does not exist', async () => {
      mockPermisoRepository.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { descripcion: 'Nueva' } as any)).toBeNull();
    });

    it('should update and return the permiso', async () => {
      mockPermisoRepository.findOne.mockResolvedValue({ id: PERMISO_ID, descripcion: 'Vieja' });
      mockPermisoRepository.save.mockResolvedValue({ id: PERMISO_ID, descripcion: 'Nueva' });
      expect(await service.update(PERMISO_ID, { descripcion: 'Nueva' } as any)).toEqual({ id: PERMISO_ID, descripcion: 'Nueva' });
    });

    it('should apply dto fields to the existing permiso', async () => {
      mockPermisoRepository.findOne.mockResolvedValue({ id: PERMISO_ID, descripcion: 'Vieja' });
      mockPermisoRepository.save.mockImplementation((p) => Promise.resolve(p));
      const result = await service.update(PERMISO_ID, { descripcion: 'Actualizada' } as any);
      expect(result).toHaveProperty('descripcion', 'Actualizada');
    });

    it('should return null when save throws', async () => {
      mockPermisoRepository.findOne.mockResolvedValue({ id: PERMISO_ID });
      mockPermisoRepository.save.mockRejectedValue(new Error('Save error'));
      expect(await service.update(PERMISO_ID, { descripcion: 'x' } as any)).toBeNull();
    });

  });

  describe('remove()', () => {

    it('should return null when permiso does not exist', async () => {
      mockPermisoRepository.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });

    it('should call repository.remove with the found permiso', async () => {
      const mockPermiso = { id: PERMISO_ID, nombre: 'crear_cita' };
      mockPermisoRepository.findOne.mockResolvedValue(mockPermiso);
      mockPermisoRepository.remove.mockResolvedValue(mockPermiso);
      await service.remove(PERMISO_ID);
      expect(mockPermisoRepository.remove).toHaveBeenCalledWith(mockPermiso);
    });

    it('should return the removed permiso', async () => {
      const mockPermiso = { id: PERMISO_ID, nombre: 'crear_cita' };
      mockPermisoRepository.findOne.mockResolvedValue(mockPermiso);
      mockPermisoRepository.remove.mockResolvedValue(mockPermiso);
      expect(await service.remove(PERMISO_ID)).toEqual(mockPermiso);
    });

    it('should return null when remove throws', async () => {
      mockPermisoRepository.findOne.mockResolvedValue({ id: PERMISO_ID });
      mockPermisoRepository.remove.mockRejectedValue(new Error('FK constraint'));
      expect(await service.remove(PERMISO_ID)).toBeNull();
    });

  });

  describe('findAll()', () => {

    const mockPaginationResult = {
      items: [{ id: PERMISO_ID, nombre: 'crear_cita' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return paginated permisos', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toEqual(mockPaginationResult);
    });

    it('should call where when search is provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, search: 'crear' } as any);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should return null when paginate throws', async () => {
      mockPaginate.mockRejectedValue(new Error('DB error'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });

  });

});
