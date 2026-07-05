jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { RolesService } from './roles.service';
import { Rol } from './rol.entity';

const mockPaginate = paginate as jest.Mock;

const ROL_ID       = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('RolesService', () => {
  let service: RolesService;

  const mockQueryBuilder = {
    where:   jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockRolRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockRolRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        { provide: getRepositoryToken(Rol), useValue: mockRolRepository },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a rol', async () => {
      const mockRol = { id: ROL_ID, nombre: 'admin' };
      mockRolRepository.create.mockReturnValue(mockRol);
      mockRolRepository.save.mockResolvedValue(mockRol);
      expect(await service.create({ nombre: 'admin' } as any)).toEqual(mockRol);
    });

    it('should call repository.create with the provided dto', async () => {
      const dto = { nombre: 'usuario' } as any;
      mockRolRepository.create.mockReturnValue({});
      mockRolRepository.save.mockResolvedValue({ id: ROL_ID, ...dto });
      await service.create(dto);
      expect(mockRolRepository.create).toHaveBeenCalledWith(dto);
    });

    it('should return null when repository throws', async () => {
      mockRolRepository.create.mockReturnValue({});
      mockRolRepository.save.mockRejectedValue(new Error('Unique constraint'));
      expect(await service.create({ nombre: 'admin' } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('should return a rol when it exists', async () => {
      const mockRol = { id: ROL_ID, nombre: 'admin' };
      mockRolRepository.findOne.mockResolvedValue(mockRol);
      const result = await service.findOne(ROL_ID);
      expect(result).toEqual(mockRol);
      expect(mockRolRepository.findOne).toHaveBeenCalledWith({ where: { id: ROL_ID } });
    });

    it('should return null when rol does not exist', async () => {
      mockRolRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });

    it('should return null when repository throws', async () => {
      mockRolRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findOne(ROL_ID)).toBeNull();
    });

  });

  describe('update()', () => {

    it('should return null when rol does not exist', async () => {
      mockRolRepository.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { descripcion: 'Nueva' } as any)).toBeNull();
    });

    it('should update and return the rol', async () => {
      mockRolRepository.findOne.mockResolvedValue({ id: ROL_ID, descripcion: 'Vieja' });
      mockRolRepository.save.mockResolvedValue({ id: ROL_ID, descripcion: 'Nueva' });
      expect(await service.update(ROL_ID, { descripcion: 'Nueva' } as any)).toEqual({ id: ROL_ID, descripcion: 'Nueva' });
    });

    it('should apply dto fields to the existing rol', async () => {
      mockRolRepository.findOne.mockResolvedValue({ id: ROL_ID, descripcion: 'Vieja' });
      mockRolRepository.save.mockImplementation((r) => Promise.resolve(r));
      const result = await service.update(ROL_ID, { descripcion: 'Actualizada' } as any);
      expect(result).toHaveProperty('descripcion', 'Actualizada');
    });

    it('should return null when save throws', async () => {
      mockRolRepository.findOne.mockResolvedValue({ id: ROL_ID });
      mockRolRepository.save.mockRejectedValue(new Error('Save error'));
      expect(await service.update(ROL_ID, { descripcion: 'x' } as any)).toBeNull();
    });

  });

  describe('remove()', () => {

    it('should return null when rol does not exist', async () => {
      mockRolRepository.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });

    it('should call repository.remove with the found rol', async () => {
      const mockRol = { id: ROL_ID, nombre: 'admin' };
      mockRolRepository.findOne.mockResolvedValue(mockRol);
      mockRolRepository.remove.mockResolvedValue(mockRol);
      await service.remove(ROL_ID);
      expect(mockRolRepository.remove).toHaveBeenCalledWith(mockRol);
    });

    it('should return the removed rol', async () => {
      const mockRol = { id: ROL_ID, nombre: 'admin' };
      mockRolRepository.findOne.mockResolvedValue(mockRol);
      mockRolRepository.remove.mockResolvedValue(mockRol);
      expect(await service.remove(ROL_ID)).toEqual(mockRol);
    });

    it('should return null when remove throws', async () => {
      mockRolRepository.findOne.mockResolvedValue({ id: ROL_ID });
      mockRolRepository.remove.mockRejectedValue(new Error('FK constraint'));
      expect(await service.remove(ROL_ID)).toBeNull();
    });

  });

  describe('findAll()', () => {

    const mockPaginationResult = {
      items: [{ id: ROL_ID, nombre: 'admin' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return paginated roles', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toEqual(mockPaginationResult);
    });

    it('should call createQueryBuilder with "rol" alias', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockRolRepository.createQueryBuilder).toHaveBeenCalledWith('rol');
    });

    it('should call where when search is provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, search: 'admin' } as any);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should return null when paginate throws', async () => {
      mockPaginate.mockRejectedValue(new Error('DB error'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });

  });

});
