jest.mock('nestjs-typeorm-paginate', () => ({
  paginate: jest.fn(),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { CitasService } from './citas.service';
import { Cita } from './cita.entity';
import { MailService } from '../mail/mail.service';
import { NotificacionesService } from '../notificaciones/notificaciones.service';

const mockPaginate = paginate as jest.Mock;

const CITA_ID   = '11111111-1111-1111-1111-111111111111';
const CITA_ID_2 = '22222222-2222-2222-2222-222222222222';
const NOT_FOUND_ID = '99999999-9999-9999-9999-999999999999';

describe('CitasService', () => {
  let service: CitasService;

  const mockQueryBuilder = {
    where:   jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
  };

  const mockCitaRepository = {
    create:             jest.fn(),
    save:               jest.fn(),
    findOne:            jest.fn(),
    remove:             jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockMailService = { sendMail: jest.fn() };
  const mockNotificacionesService = { create: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockCitaRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
    mockQueryBuilder.where.mockReturnThis();
    mockQueryBuilder.orderBy.mockReturnThis();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CitasService,
        { provide: getRepositoryToken(Cita), useValue: mockCitaRepository },
        { provide: MailService, useValue: mockMailService },
        { provide: NotificacionesService, useValue: mockNotificacionesService },
      ],
    }).compile();

    service = module.get<CitasService>(CitasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {

    it('should create and return a cita', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitaRepository.create.mockReturnValue(mockCita);
      mockCitaRepository.save.mockResolvedValue(mockCita);
      expect(await service.create({ motivo: 'Limpieza' } as any)).toEqual(mockCita);
    });

    it('should send email when emailPaciente is provided', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitaRepository.create.mockReturnValue(mockCita);
      mockCitaRepository.save.mockResolvedValue(mockCita);
      mockMailService.sendMail.mockResolvedValue({});
      mockNotificacionesService.create.mockResolvedValue({});
      await service.create({ motivo: 'Limpieza', emailPaciente: 'test@test.com' } as any);
      expect(mockMailService.sendMail).toHaveBeenCalled();
    });

    it('should not send email when emailPaciente is not provided', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitaRepository.create.mockReturnValue(mockCita);
      mockCitaRepository.save.mockResolvedValue(mockCita);
      await service.create({ motivo: 'Limpieza' } as any);
      expect(mockMailService.sendMail).not.toHaveBeenCalled();
    });

    it('should return null when repository throws', async () => {
      mockCitaRepository.create.mockReturnValue({});
      mockCitaRepository.save.mockRejectedValue(new Error('DB error'));
      expect(await service.create({ motivo: 'Limpieza' } as any)).toBeNull();
    });

  });

  describe('findOne()', () => {

    it('should return a cita when it exists', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitaRepository.findOne.mockResolvedValue(mockCita);
      const result = await service.findOne(CITA_ID);
      expect(result).toEqual(mockCita);
      expect(mockCitaRepository.findOne).toHaveBeenCalledWith({ where: { id: CITA_ID } });
    });

    it('should return null when cita does not exist', async () => {
      mockCitaRepository.findOne.mockResolvedValue(null);
      expect(await service.findOne(NOT_FOUND_ID)).toBeNull();
    });

    it('should return null when repository throws', async () => {
      mockCitaRepository.findOne.mockRejectedValue(new Error('DB error'));
      expect(await service.findOne(CITA_ID)).toBeNull();
    });

  });

  describe('update()', () => {

    it('should return null when cita does not exist', async () => {
      mockCitaRepository.findOne.mockResolvedValue(null);
      expect(await service.update(NOT_FOUND_ID, { motivo: 'Nuevo' } as any)).toBeNull();
    });

    it('should update and return the cita', async () => {
      mockCitaRepository.findOne.mockResolvedValue({ id: CITA_ID, motivo: 'Viejo' });
      mockCitaRepository.save.mockResolvedValue({ id: CITA_ID, motivo: 'Nuevo' });
      expect(await service.update(CITA_ID, { motivo: 'Nuevo' } as any)).toEqual({ id: CITA_ID, motivo: 'Nuevo' });
    });

    it('should apply dto fields to the existing cita', async () => {
      mockCitaRepository.findOne.mockResolvedValue({ id: CITA_ID, motivo: 'Viejo' });
      mockCitaRepository.save.mockImplementation((c) => Promise.resolve(c));
      const result = await service.update(CITA_ID, { motivo: 'Actualizado' } as any);
      expect(result).toHaveProperty('motivo', 'Actualizado');
    });

    it('should return null when save throws', async () => {
      mockCitaRepository.findOne.mockResolvedValue({ id: CITA_ID, motivo: 'Cita' });
      mockCitaRepository.save.mockRejectedValue(new Error('Save error'));
      expect(await service.update(CITA_ID, { motivo: 'x' } as any)).toBeNull();
    });

  });

  describe('remove()', () => {

    it('should return null when cita does not exist', async () => {
      mockCitaRepository.findOne.mockResolvedValue(null);
      expect(await service.remove(NOT_FOUND_ID)).toBeNull();
    });

    it('should call repository.remove with the found cita', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitaRepository.findOne.mockResolvedValue(mockCita);
      mockCitaRepository.remove.mockResolvedValue(mockCita);
      await service.remove(CITA_ID);
      expect(mockCitaRepository.remove).toHaveBeenCalledWith(mockCita);
    });

    it('should return the removed cita', async () => {
      const mockCita = { id: CITA_ID, motivo: 'Limpieza' };
      mockCitaRepository.findOne.mockResolvedValue(mockCita);
      mockCitaRepository.remove.mockResolvedValue(mockCita);
      expect(await service.remove(CITA_ID)).toEqual(mockCita);
    });

    it('should return null when remove throws', async () => {
      mockCitaRepository.findOne.mockResolvedValue({ id: CITA_ID });
      mockCitaRepository.remove.mockRejectedValue(new Error('FK constraint'));
      expect(await service.remove(CITA_ID)).toBeNull();
    });

  });

  describe('findAll()', () => {

    const mockPaginationResult = {
      items: [{ id: CITA_ID, motivo: 'Limpieza' }, { id: CITA_ID_2, motivo: 'Revisión' }],
      meta: { currentPage: 1, totalPages: 1, itemCount: 2, totalItems: 2, itemsPerPage: 10 },
    };

    it('should return paginated citas', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toEqual(mockPaginationResult);
    });

    it('should call createQueryBuilder with "cita" alias', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10 } as any);
      expect(mockCitaRepository.createQueryBuilder).toHaveBeenCalledWith('cita');
    });

    it('should call where when search is provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, search: 'Limpieza' } as any);
      expect(mockQueryBuilder.where).toHaveBeenCalled();
    });

    it('should call orderBy when sort is provided', async () => {
      mockPaginate.mockResolvedValue(mockPaginationResult);
      await service.findAll({ page: 1, limit: 10, sort: 'fechaHora', order: 'DESC' } as any);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('cita.fechaHora', 'DESC');
    });

    it('should return null when paginate throws', async () => {
      mockPaginate.mockRejectedValue(new Error('DB error'));
      expect(await service.findAll({ page: 1, limit: 10 } as any)).toBeNull();
    });

  });

});
