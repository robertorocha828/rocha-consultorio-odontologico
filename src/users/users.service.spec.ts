jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

jest.mock('bcrypt', () => ({
  hash:    jest.fn().mockResolvedValue('hashed_password'),
  compare: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { UsersService } from './users.service';
import { User } from './user.entity';

const mockPaginate = paginate as jest.Mock;

const USER_ID      = '11111111-1111-1111-1111-111111111111';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('UsersService', () => {
  let service: UsersService;

  const mockQueryBuilder = {
    where:   jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockUserRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockUserRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a user with hashed password', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com', password: 'hashed_password' };
      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockResolvedValue(mockUser);
      const result = await service.create({ email: 'test@test.com', password: '123456' } as any);
      expect(result).toEqual(mockUser);
    });

    it('should call bcrypt.hash with the provided password', async () => {
      const bcrypt = require('bcrypt');
      mockUserRepository.create.mockReturnValue({});
      mockUserRepository.save.mockResolvedValue({ id: USER_ID });
      await service.create({ email: 'test@test.com', password: '123456' } as any);
      expect(bcrypt.hash).toHaveBeenCalledWith('123456', 10);
    });

    it('should return null when repository throws', async () => {
      mockUserRepository.create.mockReturnValue({});
      mockUserRepository.save.mockRejectedValue(new Error('Unique constraint'));
      expect(await service.create({ email: 'test@test.com', password: '123456' } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('should return a user when it exists', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      const result = await service.findOne(USER_ID);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: USER_ID } });
    });

    it('should return null when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });

    it('should return null when repository throws', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findOne(USER_ID)).toBeNull();
    });

  });

  describe('findByEmail()', () => {

    it('should return a user when email exists', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      expect(await service.findByEmail('test@test.com')).toEqual(mockUser);
    });

    it('should return null when email does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(await service.findByEmail('noexiste@test.com')).toBeNull();
    });

    it('should return null when repository throws', async () => {
      mockUserRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findByEmail('test@test.com')).toBeNull();
    });

  });

  describe('update()', () => {

    it('should return null when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { rol: 'admin' } as any)).toBeNull();
    });

    it('should update and return the user', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: USER_ID, rol: 'usuario' });
      mockUserRepository.save.mockResolvedValue({ id: USER_ID, rol: 'admin' });
      expect(await service.update(USER_ID, { rol: 'admin' } as any)).toEqual({ id: USER_ID, rol: 'admin' });
    });

    it('should hash password when password is in dto', async () => {
      const bcrypt = require('bcrypt');
      mockUserRepository.findOne.mockResolvedValue({ id: USER_ID, password: 'old' });
      mockUserRepository.save.mockImplementation((u) => Promise.resolve(u));
      await service.update(USER_ID, { password: 'newpass' } as any);
      expect(bcrypt.hash).toHaveBeenCalledWith('newpass', 10);
    });

    it('should return null when save throws', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: USER_ID });
      mockUserRepository.save.mockRejectedValue(new Error('Save error'));
      expect(await service.update(USER_ID, { rol: 'admin' } as any)).toBeNull();
    });

  });

  describe('remove()', () => {

    it('should return null when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });

    it('should call repository.remove with the found user', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);
      await service.remove(USER_ID);
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should return the removed user', async () => {
      const mockUser = { id: USER_ID, email: 'test@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);
      expect(await service.remove(USER_ID)).toEqual(mockUser);
    });

    it('should return null when remove throws', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: USER_ID });
      mockUserRepository.remove.mockRejectedValue(new Error('FK constraint'));
      expect(await service.remove(USER_ID)).toBeNull();
    });

  });

  describe('findAll()', () => {

    const mockPaginationResult = {
      items: [{ id: USER_ID, email: 'test@test.com' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 1, totalItems: 1, itemsPerPage: 10 },
    };

    it('should return paginated users', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toEqual(mockPaginationResult);
    });

    it('should call createQueryBuilder with "user" alias', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    });

    it('should call where when search is provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, search: 'test' } as any);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should return null when paginate throws', async () => {
      mockPaginate.mockRejectedValue(new Error('DB error'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });

  });

});
